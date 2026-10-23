---
title: 'IDE vs ADE: What Changes When Your Tools Start Acting for You?'
description: Follow one API endpoint through manual, AI-assisted and delegated development to see how execution, verification, permissions and recovery change.
status: published
publishedAt: 2026-10-22
format: review
verification: researched
difficulty: beginner
author: The Daily AI Pulse
verifiedAt: 2026-10-22
affiliateLinks: false
image: /images/guides/ide-vs-ade-workflows.webp
imageAlt: A stone balancing beam with contrasting weights and a brass adjustment wheel, representing delegated work with retained control.
sources:
  - label: Microsoft — Language Server Protocol
    url: https://microsoft.github.io/language-server-protocol/
  - label: GitHub — Understanding Actions
    url: https://docs.github.com/en/actions/get-started/understand-github-actions
  - label: Cursor — Agent tools
    url: https://cursor.com/docs/agent/overview
  - label: Anthropic — Permissions
    url: https://code.claude.com/docs/en/permissions
  - label: Anthropic — Shell sandbox scope
    url: https://code.claude.com/docs/en/sandboxing
  - label: OpenAI — Agent approvals and security
    url: https://learn.chatgpt.com/docs/agent-approvals-security
  - label: OpenHands — Agent Server architecture
    url: https://docs.openhands.dev/sdk/guides/agent-server/overview
---

Your team needs a new `POST /bookmarks` endpoint. It must accept a title and an HTTPS URL, reject invalid input, require an authenticated user, and return the existing API's normal error format. Tests must cover those rules. No database migration or deployment is part of the task.

You can build that endpoint in an IDE, with an AI assistant, or by delegating work to an agent. The endpoint should satisfy the same contract in all three cases. What changes is **who chooses and executes the steps between the requirement and the reviewed patch**.

**Practical technical explainer · Sources checked October 22, 2026.** The bookmarks service is fictional. The workflows and task brief below are conceptual teaching examples, not an executed endpoint tutorial or a benchmark of any product. They apply to beginner and intermediate developers. The diagram shows logical responsibilities, not a particular vendor's process boundaries.

## Start with the tools you already know

An integrated development environment brings editing, navigation, diagnostics, debugging and other tools into a working space. It may call a language server for definitions and completions, as the [Language Server Protocol](https://microsoft.github.io/language-server-protocol/) describes. It can also run your test command. Integration does not mean the editor independently decides which feature to implement.

For the bookmarks endpoint, you locate a neighboring route, find the authentication middleware and input validator, write the change, and decide which tests to run. The compiler and test runner execute automatically once invoked, but you choose the sequence and interpret the results.

That is the first workflow: **the developer directs the loop**. It is not automation-free. It simply keeps the engineering decisions with the developer.

## Add assistance without handing over the whole task

Now imagine asking an assistant to explain the neighboring route or suggest tests for invalid URLs. It might propose a validator or generate a patch. You decide whether the suggestion fits the codebase, apply or approve edits, and decide the next step.

This can save typing and help you explore unfamiliar code. It can also produce a convincing mistake. A generated validator might accept any string beginning with `https`, or a test might verify only the happy path. You still need to inspect what the code actually does.

The boundary depends on behavior, not the product name. Some modes called “assistants” can run tools and continue without a new instruction; those sessions are already delegating part of the loop. [Cursor's agent documentation](https://cursor.com/docs/agent/overview), for example, describes searching, editing and terminal execution. Putting that agent in an IDE does not make its actions mere suggestions.

## Delegate an outcome, then inspect how it was reached

In the third workflow, you give an agent a bounded task. Within the configured permissions, it chooses files to inspect, edits the implementation and tests, runs commands, reads failures and revises the patch. You intervene when needed and review the result.

The surrounding **harness** is the software that supplies instructions, context, tools and continuation logic to the model. The **execution environment** supplies the files and processes those tools operate on. An **approval policy** decides when an action needs intervention. A **sandbox** constrains access through a technical boundary. These are different jobs even when one application configures all of them.

Calling the resulting setup an ADE can be convenient. It does not require replacing the IDE. You might review the patch in the same editor while the agent runs in a separate container or remote workspace. [OpenHands' Agent Server documentation](https://docs.openhands.dev/sdk/guides/agent-server/overview) illustrates that separation of client, server and workspace in a concrete architecture.

<figure class="guide-technical-diagram">
  <picture>
    <source media="(max-width: 640px)" srcset="/images/guides/ide-vs-ade-responsibilities-mobile.svg" />
    <img src="/images/guides/ide-vs-ade-responsibilities.svg" alt="The developer defines the endpoint and acceptance criteria. In a manual workflow the developer directs edits and tests; with assistance the AI proposes work for the developer to direct; in a delegated workflow the agent loops through tools under configured controls. All paths return a diff and test evidence to human review, which can request changes." width="1200" height="750" loading="lazy" decoding="async" />
  </picture>
  <figcaption>One endpoint, three ways to direct the work. Tools execute actions; the agent can choose a sequence; the developer retains acceptance and release responsibility. The controls are configured by humans, not created by the agent's promise to be careful.</figcaption>
</figure>

The diagram's shared beginning is the requirement, and its shared end is review. The delegated path contains an agent–tool feedback loop because the agent can choose a new action after observing a result. Review can send work back for revision. None of those arrows means automatic production deployment.

## Give the agent a brief that can be checked

“Add bookmarks” leaves the agent to guess authentication, data ownership and the meaning of done. A useful brief removes those guesses. You could adapt the following plain-text task contract; it is **not vendor configuration or an enforced security policy**.

```yaml title="Task brief · YAML · Example"
task: Add POST /bookmarks using existing repository conventions
acceptance:
  - Require the existing authentication middleware
  - Derive the owner from the authenticated session, never from request input
  - Accept a nonempty title and a valid HTTPS URL
  - Return the established validation and error response shapes
  - Cover valid input, invalid input and unauthenticated requests with tests
scope:
  - Route, validator and tests only; explain any additional file changes
  - No schema migration, production access, deployment or unrelated refactor
handoff:
  - Base revision and reviewable diff
  - Exact checks run, exit results, skipped checks and remaining questions
  - Stop and explain a blocker rather than broadening access to work around it
```

The brief defines intent. Separately configure the environment so the agent cannot reach production or obtain credentials that the task does not need. [Claude Code's permissions documentation](https://code.claude.com/docs/en/permissions) and [Codex's approval/security documentation](https://learn.chatgpt.com/docs/agent-approvals-security) describe product-specific controls; copying the YAML above enables none of them.

## A passing test can still answer the wrong question

Suppose the new endpoint trusts `ownerId` from the request body. A happy-path test can pass while allowing one user to choose another user's identifier. That is a fictional failure scenario, but it exposes a real review question: **did the tests exercise the security requirement, or just the code the agent happened to write?**

For this task, inspect whether ownership comes from the authenticated session. Check unauthenticated requests and malformed input, and verify the error shape against existing endpoints. Review unexpected files and dependency changes. Ask what could go wrong even if every newly generated assertion passes.

The agent can execute a test runner. It cannot turn a weak acceptance criterion into a strong one merely by reporting green output. Independent CI checks the proposed revision and preserves logs; [GitHub Actions](https://docs.github.com/en/actions/get-started/understand-github-actions) is one documented way to run that validation. Human acceptance still asks whether the right behavior was tested.

| Responsibility | Manual IDE workflow | AI-assisted workflow | Delegated agent workflow |
| --- | --- | --- | --- |
| Set the endpoint contract | Developer | Developer | Developer |
| Find implementation context | Developer navigates/searches | Developer and assistant explore | Agent explores; developer supplies constraints and missing context |
| Choose the next edit/check | Developer | Developer guides suggestions | Agent within task and tool permissions |
| Execute edits and tests | Developer invokes tools | Developer or approved assistance invokes tools | Agent invokes exposed tools; tools perform the action |
| Interpret evidence and accept | Developer/reviewer | Developer/reviewer | Developer/reviewer; agent reports findings |
| Own release and side effects | Authorized humans/processes | Authorized humans/processes | Authorized humans/processes; any delegated release authority must be explicit |

## Plan the escape route before something breaks

For this endpoint, begin from a clean revision and use a branch or isolated worktree. If the patch changes the wrong route, a file diff and known baseline make recovery straightforward. Preserve unrelated work before reverting anything.

The story changes if the agent can modify a database or call an external service. Reverting Git files does not reverse those side effects. Likewise, a permission prompt and a sandbox are not substitutes for each other. [Anthropic documents the scope of its shell sandbox](https://code.claude.com/docs/en/sandboxing); other tools and integrations may sit outside that boundary. Understand the specific setup instead of assuming the word “sandbox” covers everything.

If the test environment is unavailable, a truthful handoff says which checks could not run and why. If a missing dependency requires more access, decide whether that access is justified rather than disabling controls to make progress look smooth. Record usage limits too: a bounded task should have a bounded opportunity to spend time and compute.

You do not need to adopt maximum autonomy to benefit. Use assistance while learning an unfamiliar code path. Delegate a small, well-specified endpoint when checks and review can catch mistakes. Keep close control over ambiguous requirements or hard-to-reverse actions.

For tool selection, see [the assistant comparison](/guides/ai-coding-assistants-compared/); for execution boundaries, see [the environment comparison](/guides/agentic-development-environments-compared/). The practical change is that you can move from choosing every step to defining a verifiable outcome. You remain responsible for deciding whether the result deserves to ship.
