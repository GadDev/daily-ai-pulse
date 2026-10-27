/**
 * Curated reader journeys for English news and evergreen guides.
 *
 * Each reason names the next reader decision. These are not tag-based recommendations:
 * add a link only after checking that the destination answers a genuinely related question.
 * Guide publication status is checked again when resolving links, so an unpublished
 * destination disappears without leaking its title or URL.
 *
 * The mappings below backfill pre-existing articles. New drafts should specify
 * their own relatedGuides in frontmatter to avoid concurrent edits to this shared file.
 */
export interface RelatedGuideIndexEntry {
  id: string;
  data: {
    status: 'draft' | 'published' | 'withdrawn';
    title: string;
    description: string;
    format: 'tutorial' | 'review' | 'toolkit';
  };
}

export interface EditorialGuideLink {
  id: string;
  reason: string;
}

export interface ResolvedGuideLink<T extends RelatedGuideIndexEntry> {
  guide: T;
  reason: string;
}

/** Source story ID -> editorially relevant *English* published guide IDs. */
export const storyGuideLinks: Record<string, readonly EditorialGuideLink[]> = {
  '2026-10-23-copilot-visual-studio-september-update': [
    {
      id: 'ai-coding-assistants-compared',
      reason: 'Decide whether an editor assistant or a delegated coding agent fits your workflow.',
    },
    {
      id: 'agentic-development-environments-compared',
      reason: 'Compare execution boundaries and recovery controls before delegating code changes.',
    },
  ],
  '2026-10-14-adk-overnight-agent-workflow': [
    {
      id: 'ide-vs-ade-workflows',
      reason: 'See how testing and human control change when an agent owns a task.',
    },
    {
      id: 'agentic-development-environments-compared',
      reason: 'Plan isolation, permission checks and recovery for long-running coding agents.',
    },
  ],
  '2026-09-22-copilot-review-controls': [
    {
      id: 'ai-coding-assistants-compared',
      reason: 'Compare assistants by verification, oversight and total cost—not just model names.',
    },
  ],
  '2026-10-20-redhat-mcp-gateway-ga': [
    {
      id: 'typescript-read-only-mcp-server',
      reason: 'Start with a narrowly scoped MCP server before deciding on shared gateway controls.',
    },
    {
      id: 'agent-security-control-toolkit',
      reason: 'Separate enforcement at the tool boundary from monitoring and detection.',
    },
  ],
  '2026-09-26-mcp-secrets': [
    {
      id: 'typescript-read-only-mcp-server',
      reason: 'Build a tool interface with deliberate data and permission boundaries.',
    },
    {
      id: 'agent-security-control-toolkit',
      reason: 'Select concrete controls for agent access to sensitive documents and tools.',
    },
  ],
  '2026-10-21-openai-agents-weaken-monitoring': [
    {
      id: 'agent-observability-langfuse-phoenix',
      reason:
        'Compare trace systems and data controls while keeping monitoring outside agent authority.',
    },
    {
      id: 'agent-security-control-toolkit',
      reason: 'Distinguish independent enforcement from logs an agent could alter.',
    },
  ],
  '2026-10-23-metr-openai-monitoring-red-team': [
    {
      id: 'agent-observability-langfuse-phoenix',
      reason: 'Evaluate where traces are captured and who can change the evidence.',
    },
    {
      id: 'agentic-development-environments-compared',
      reason: 'Compare boundaries around delegated code execution and recovery.',
    },
  ],
  '2026-10-13-copilot-telemetry-capture-controls': [
    {
      id: 'agent-observability-langfuse-phoenix',
      reason: 'Compare tracing tools and decide what agent data should be captured.',
    },
  ],
};

/** Source guide ID -> other guides covering a distinct next question (not series pagination). */
export const guideGuideLinks: Record<string, readonly EditorialGuideLink[]> = {
  'ai-coding-assistants-compared': [
    {
      id: 'ide-vs-ade-workflows',
      reason: 'Follow one coding task to see what changes when execution is delegated.',
    },
    {
      id: 'agentic-development-environments-compared',
      reason: 'Choose where an agent should run and how to control access.',
    },
  ],
  'ide-vs-ade-workflows': [
    {
      id: 'agentic-development-environments-compared',
      reason: 'Compare six execution setups after deciding which tasks to delegate.',
    },
    {
      id: 'ade-real-shift-or-rebranding',
      reason: 'Examine whether the new development-environment label represents a real shift.',
    },
  ],
  'agentic-development-environments-compared': [
    {
      id: 'ade-real-shift-or-rebranding',
      reason: 'Test the claims behind the agentic development environment category.',
    },
    {
      id: 'ide-vs-ade-workflows',
      reason: 'See the practical differences between code completion and agent delegation.',
    },
    {
      id: 'agent-security-control-toolkit',
      reason: 'Select independent controls for agents with access to tools and documents.',
    },
  ],
  'ade-real-shift-or-rebranding': [
    {
      id: 'ide-vs-ade-workflows',
      reason: 'Follow a concrete development task from assistance to delegation.',
    },
    {
      id: 'ai-coding-assistants-compared',
      reason: 'Compare assistant choices against your actual development workflow.',
    },
  ],
  'first-rag-application': [
    {
      id: 'rag-retrieval-evaluation',
      reason: 'Measure which relevant passages your first retriever fails to find.',
    },
    {
      id: 'rag-document-ingestion-toolkit',
      reason: 'Keep source locations inspectable when moving beyond plain-text runbooks.',
    },
  ],
  'rag-retrieval-evaluation': [
    {
      id: 'rag-document-ingestion-toolkit',
      reason: 'Improve the incoming passages before changing retrieval infrastructure.',
    },
    {
      id: 'small-rag-pgvector-qdrant-decision',
      reason:
        'Choose between PostgreSQL and a separate vector service once retrieval needs are clear.',
    },
  ],
  'rag-document-ingestion-toolkit': [
    {
      id: 'rag-retrieval-evaluation',
      reason: 'Measure whether your extracted passages can actually be retrieved.',
    },
    {
      id: 'first-rag-application',
      reason: 'Connect inspectable passages to a small local RAG API.',
    },
  ],
  'small-rag-pgvector-qdrant-decision': [
    {
      id: 'rag-retrieval-evaluation',
      reason: 'Benchmark retrieval relevance before attributing problems to the database.',
    },
    {
      id: 'first-rag-application',
      reason: 'Start with a working local retrieval API before adding infrastructure.',
    },
  ],
  'agent-tool-approval-boundary': [
    {
      id: 'agent-security-control-toolkit',
      reason: 'Choose complementary security checks beyond a single approval gate.',
    },
    {
      id: 'typescript-read-only-mcp-server',
      reason: 'Expose narrower tools before applying approval to dangerous actions.',
    },
  ],
  'agent-security-control-toolkit': [
    {
      id: 'agent-tool-approval-boundary',
      reason: 'Implement an exact-argument human approval boundary in a local mock.',
    },
    {
      id: 'agent-observability-langfuse-phoenix',
      reason: 'Understand what tracing can reveal—and what it cannot enforce.',
    },
  ],
  'agent-observability-langfuse-phoenix': [
    {
      id: 'agent-security-control-toolkit',
      reason: 'Add independent prevention controls alongside agent trace review.',
    },
  ],
  'typescript-read-only-mcp-server': [
    {
      id: 'agent-tool-approval-boundary',
      reason: 'Add a specific approval gate when moving from read-only to impactful tools.',
    },
    {
      id: 'agent-security-control-toolkit',
      reason: 'Review enforcement, isolation and incident visibility for agent tools.',
    },
  ],
  'prompt-regression-ci': [
    {
      id: 'claude-foundations-extraction-review',
      reason: 'Build the validation and human-review path behind structured outputs.',
    },
  ],
  'claude-foundations-first-api-prompt': [
    {
      id: 'prompt-regression-ci',
      reason: 'Turn prompt behavior expectations into repeatable regression checks.',
    },
  ],
  'claude-foundations-extraction-review': [
    {
      id: 'prompt-regression-ci',
      reason: 'Extend local validation with a repeatable CI prompt-regression gate.',
    },
  ],
  'claude-foundations-controlled-agent': [
    {
      id: 'agent-tool-approval-boundary',
      reason: 'Explore exact-argument approval beyond a support agent mock.',
    },
  ],
  'claude-foundations-code-workflows': [
    {
      id: 'agentic-development-environments-compared',
      reason: 'Compare isolation and recovery choices before running coding agents.',
    },
  ],
};

/** Silently suppress missing, withdrawn, draft, duplicate or self-links at render time. */
export function resolveRelatedGuides<T extends RelatedGuideIndexEntry>(
  sourceId: string,
  links: readonly EditorialGuideLink[],
  allGuides: readonly T[],
): ResolvedGuideLink<T>[] {
  const published = new Map(
    allGuides
      .filter((guide) => guide.data.status === 'published')
      .map((guide) => [guide.id, guide]),
  );
  const seen = new Set<string>();
  return links.flatMap(({ id, reason }) => {
    const guide = published.get(id);
    if (!guide || id === sourceId || seen.has(id)) return [];
    seen.add(id);
    return [{ guide, reason }];
  });
}

export function relatedGuidesForStory<T extends RelatedGuideIndexEntry>(
  storyId: string,
  guides: readonly T[],
  authoredLinks?: readonly EditorialGuideLink[],
) {
  return resolveRelatedGuides(storyId, authoredLinks ?? storyGuideLinks[storyId] ?? [], guides);
}

export function relatedGuidesForGuide<T extends RelatedGuideIndexEntry>(
  guideId: string,
  guides: readonly T[],
  authoredLinks?: readonly EditorialGuideLink[],
) {
  return resolveRelatedGuides(guideId, authoredLinks ?? guideGuideLinks[guideId] ?? [], guides);
}
