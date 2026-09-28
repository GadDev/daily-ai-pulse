export type Category =
  | 'Models & Releases'
  | 'Research'
  | 'AI Engineering'
  | 'Dev Tools'
  | 'AI in Practice'
  | 'Workflows'
  | 'Business & Industry'
  | 'Curious AI';

export type EvidenceLevel = 'strong' | 'primary' | 'preliminary' | 'anecdotal' | 'unverified';
export type StoryType = 'pulse' | 'briefing' | 'deep-dive';

export interface Story {
  slug: string;
  title: string;
  dek: string;
  category: Category;
  type: StoryType;
  evidence: EvidenceLevel;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  date: string;
  readMinutes: number;
  tags: string[];
  isBigStory?: boolean;
}

export const stories: Story[] = [
  {
    slug: 'agent-runtimes-become-infrastructure',
    title: 'Agent runtimes are becoming infrastructure',
    dek: 'The interesting shift is not another chatbot feature. It is the movement of orchestration, memory and tool execution into dedicated runtime layers.',
    category: 'AI Engineering',
    type: 'deep-dive',
    evidence: 'primary',
    difficulty: 'intermediate',
    date: '2026-09-28',
    readMinutes: 8,
    tags: ['agents', 'infrastructure', 'orchestration'],
    isBigStory: true,
  },
  {
    slug: 'memory-architecture-paper',
    title: 'A new memory architecture worth reading',
    dek: 'A research note on what changes when memory becomes an explicit system component rather than a larger prompt.',
    category: 'Research',
    type: 'briefing',
    evidence: 'preliminary',
    difficulty: 'advanced',
    date: '2026-09-28',
    readMinutes: 6,
    tags: ['memory', 'research'],
  },
  {
    slug: 'coding-agent-tooling',
    title: 'The coding-agent toolchain is getting boring — good',
    dek: 'The best new tooling is increasingly about reliability, permissions and repeatable workflows rather than flashy demos.',
    category: 'Dev Tools',
    type: 'pulse',
    evidence: 'primary',
    difficulty: 'intermediate',
    date: '2026-09-28',
    readMinutes: 3,
    tags: ['coding-agents', 'developer-tools'],
  },
  {
    slug: 'teams-using-ai-review',
    title: 'How teams are folding AI into code review',
    dek: 'The useful pattern is not replacing reviewers. It is giving humans a better first pass and a smaller search space.',
    category: 'AI in Practice',
    type: 'briefing',
    evidence: 'anecdotal',
    difficulty: 'beginner',
    date: '2026-09-28',
    readMinutes: 5,
    tags: ['workflow', 'code-review'],
  },
  {
    slug: 'curious-ai-sandbox',
    title: 'The delightful weirdness of an agent finding the side door',
    dek: 'A curious case where the interesting lesson is less about failure and more about how optimizers reinterpret our assumptions.',
    category: 'Curious AI',
    type: 'pulse',
    evidence: 'anecdotal',
    difficulty: 'beginner',
    date: '2026-09-28',
    readMinutes: 2,
    tags: ['curious', 'agents'],
  },
];
