export type CategoryKey =
  | 'models'
  | 'research'
  | 'engineering'
  | 'tools'
  | 'practice'
  | 'workflows'
  | 'business'
  | 'curious';

export interface CategoryConfig {
  key: CategoryKey;
  title: string;
  description: string;
  eyebrow: string;
  dek: string;
  sectionTitle: string;
}

export const categories: Record<CategoryKey, CategoryConfig> = {
  research: {
    key: 'research',
    title: 'Research',
    description: 'AI research worth paying attention to.',
    eyebrow: 'ARCHIVE / RESEARCH',
    dek: 'Papers, training, inference, memory, evals, and safety — filtered for signal.',
    sectionTitle: 'Latest research',
  },
  models: {
    key: 'models',
    title: 'Models & Releases',
    description: 'Model releases and capability changes that matter to engineers.',
    eyebrow: 'ARCHIVE / MODELS',
    dek: 'Frontier releases, open models, architecture changes, APIs, limits, and price-performance shifts.',
    sectionTitle: 'Latest models & releases',
  },
  engineering: {
    key: 'engineering',
    title: 'AI Engineering',
    description: 'The systems work behind production AI.',
    eyebrow: 'ARCHIVE / AI ENGINEERING',
    dek: 'Agents, serving, context, observability, security, infrastructure, and the runtime around the model.',
    sectionTitle: 'Latest AI engineering',
  },
  tools: {
    key: 'tools',
    title: 'Dev Tools',
    description: 'AI developer tools worth trying or tracking.',
    eyebrow: 'ARCHIVE / DEV TOOLS',
    dek: 'Coding agents, IDEs, CLIs, MCP, SDKs, frameworks, and repositories with real engineering value.',
    sectionTitle: 'Latest tools',
  },
  practice: {
    key: 'practice',
    title: 'AI in Practice',
    description: 'How real teams are applying AI to engineering work.',
    eyebrow: 'ARCHIVE / AI IN PRACTICE',
    dek: 'Concrete deployments, operating models, measured outcomes, and the implementation details behind them.',
    sectionTitle: 'Latest in practice',
  },
  workflows: {
    key: 'workflows',
    title: 'Workflows',
    description: 'Practical patterns for working with AI coding and agent systems.',
    eyebrow: 'ARCHIVE / WORKFLOWS',
    dek: 'Settings, review loops, verification, orchestration, context practices, and repeatable engineering habits.',
    sectionTitle: 'Latest workflows',
  },
  business: {
    key: 'business',
    title: 'Business & Industry',
    description: 'Industry changes with real technical consequences.',
    eyebrow: 'ARCHIVE / BUSINESS & INDUSTRY',
    dek: 'Platform strategy, enterprise adoption, governance, pricing, and market moves that affect engineering decisions.',
    sectionTitle: 'Latest business & industry',
  },
  curious: {
    key: 'curious',
    title: 'Curious AI',
    description: 'The strange, surprising, and counterintuitive edge of AI engineering.',
    eyebrow: 'ARCHIVE / CURIOUS AI',
    dek: 'Unexpected agent behavior, clever experiments, emergent dynamics, and odd results that are still worth understanding.',
    sectionTitle: 'Latest curious AI',
  },
};
