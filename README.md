# Pulse

**Signal over noise in AI.**

Pulse is an English-language AI research magazine for engineers, combining rigorous research coverage, practical engineering, model and tooling releases, real-world AI case studies, and the curious side of AI.

## Editorial identity

- Research-magazine structure
- Personal but evidence-first voice
- Y2K experimental science/editorial visual language
- Primary sources first
- Explicit separation between evidence and editorial take
- Curated daily front page plus standalone stories

## Stack

- React 19
- Vite
- TypeScript
- React Router
- Markdown as the publishing source
- Tailwind CSS
- GitHub Pages
- GitHub Actions

## Local development

```bash
npm install
npm run dev
```

The content build converts Markdown in `src/content/stories/` into generated story data before Vite starts or builds.

## Publication model

The homepage is a curated front page, not a feed dump:

- Big Story — only when warranted
- Research
- Tools
- In Practice
- Curious

The broader archive also supports Models & Releases, AI Engineering, Workflows, and Business & Industry.

> Pulse is designed around one rule: **signal over noise**.
