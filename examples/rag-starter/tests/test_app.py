import httpx
import pytest

from app import Passage, create_app, load_passages, make_prompt, retrieve


class FakeGenerator:
    def __init__(self, answer: str = "Use the previous image digest [1].", fails: bool = False):
        self.answer = answer
        self.fails = fails
        self.calls = []

    async def generate(self, prompt: str) -> str:
        self.calls.append(prompt)
        if self.fails:
            raise httpx.ConnectError("Ollama unreachable")
        return self.answer


@pytest.fixture
def passages():
    return load_passages()


async def ask(app, question):
    async with httpx.AsyncClient(transport=httpx.ASGITransport(app=app), base_url="http://testserver") as client:
        return await client.post("/ask", json={"question": question})


@pytest.mark.asyncio
async def test_question_retrieves_relevant_passage_and_valid_citation(passages):
    fake = FakeGenerator()
    response = await ask(create_app(fake, passages), "How do we rollback a failed release?")
    assert response.status_code == 200
    data = response.json()
    assert data["citations"][0]["document"] == "deploy.md"
    assert data["citations"][0]["section"] == "Rollback"
    assert "rolls back" in fake.calls[0]
    assert "untrusted data" in fake.calls[0]


@pytest.mark.asyncio
async def test_no_retrieval_match_abstains_without_calling_model(passages):
    fake = FakeGenerator()
    response = await ask(create_app(fake, passages), "How do penguins sing under water?")
    assert response.status_code == 200
    assert response.json()["citations"] == []
    assert not fake.calls


@pytest.mark.asyncio
async def test_backend_outage_returns_503(passages):
    response = await ask(create_app(FakeGenerator(fails=True), passages), "Who approves a production release?")
    assert response.status_code == 503
    assert "Local model unavailable" in response.json()["detail"]


@pytest.mark.asyncio
@pytest.mark.parametrize("bad_answer", ["No source citation", "A made up citation [55].", ""])
async def test_ungrounded_citation_or_empty_model_output_is_rejected(passages, bad_answer):
    response = await ask(create_app(FakeGenerator(answer=bad_answer), passages), "How do we rollback a failed release?")
    assert response.status_code == 502


@pytest.mark.asyncio
async def test_input_bounds_are_enforced(passages):
    for question in ["hi", "z" * 501]:
        response = await ask(create_app(FakeGenerator(), passages), question)
        assert response.status_code == 422


def test_corpus_and_ranker_are_reproducible(passages):
    assert len(passages) == 4
    assert retrieve("rollback failed release", passages)[0].heading == "Rollback"
    assert retrieve("penguin satellite", passages) == []
    assert "[1]" in make_prompt("What is rollback?", [Passage("a.md", "Rollback", "Restore it")])
