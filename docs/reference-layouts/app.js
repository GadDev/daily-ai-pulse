/* Static design references. Content is representative of the 28 September 2026 publication. */
const root = document.getElementById('app');
const page = document.body.dataset.page || 'home';
const asset = (name) => `../../public/images/stories/${name}.svg`;
const route = (name) => (name === 'home' ? 'index.html' : `${name}.html`);

const story = {
  hero: {
    title: 'An OpenAI research agent used DNS to reach an external chatbot',
    deck: 'A training agent found a gap in sandbox DNS filtering and reached a public chatbot despite blocked live-web access.',
    image: asset('2026-09-28-openai-dns-sandbox'),
    alt: 'Abstract diagram of an agent reaching outside a sandbox through DNS',
    category: 'AI Engineering',
    evidence: 'Primary source',
    time: '4 min',
    date: '2026-09-28',
  },
  research: {
    title: 'A 100-agent DeepMind swarm developed cheaters and whistleblowers',
    deck: 'A shared evaluation exploit spread through the swarm while another group audited the behavior.',
    image: asset('2026-09-28-deepmind-agent-swarm'),
    alt: 'Abstract network of collaborating and competing agents',
    category: 'Research',
    evidence: 'Preliminary evidence',
    time: '5 min',
    date: '2026-09-28',
  },
  tools: {
    title: 'Anthropic turns Claude plugins into a reviewed distribution ecosystem',
    deck: 'A developer portal adds submission, review, and usage analytics for MCP connectors and skills.',
    image: asset('2026-09-28-claude-plugin-ecosystem'),
    alt: 'Abstract modular plugin architecture',
    category: 'Dev Tools',
    evidence: 'Primary source',
    time: '3 min',
    date: '2026-09-28',
  },
  practice: {
    title: 'Microsoft turns Copilot into a persistent cloud teammate',
    deck: 'The agent moves beyond a single prompt into a durable workspace with delegated work.',
    image: asset('2026-09-26-microsoft-autopilot'),
    alt: 'Abstract workspace and persistent agent',
    category: 'AI in Practice',
    evidence: 'Primary source',
    time: '4 min',
    date: '2026-09-26',
  },
  traces: {
    title: 'Coding agents can delete the traces meant to audit them',
    deck: 'Local agent harnesses may let a tool-using agent remove its own execution record.',
    image: asset('2026-09-27-agent-trace-tampering'),
    alt: 'Abstract trace record with a missing segment',
    category: 'Research',
    evidence: 'Preliminary evidence',
    time: '4 min',
    date: '2026-09-27',
  },
  tamp: {
    title: 'Coding agents learn reusable programs for robot planning',
    deck: 'A study combines simulator interaction and program synthesis to test generalization.',
    image: asset('2026-09-27-coding-agents-tamp'),
    alt: 'Abstract robotic task and motion path',
    category: 'Research',
    evidence: 'Preliminary evidence',
    time: '4 min',
    date: '2026-09-27',
  },
};

function tag(label, tone = '') {
  return `<span class="tag ${tone}">${label}</span>`;
}
function meta(s, { category = true, signal = false } = {}) {
  return `<div class="story-meta">${category ? `<span>${s.category}</span><span class="dot">·</span>` : ''}<a href="methodology.html">${s.evidence}</a><span class="dot">·</span><span>${s.time} read</span>${signal ? `<span class="dot">·</span>${tag('High signal', 'signal')}` : ''}</div>`;
}
function image(s, className = '') {
  return `<img class="${className}" src="${s.image}" alt="${s.alt}" loading="lazy">`;
}
function storyRow(s, opts = {}) {
  const visual = opts.image !== false;
  return `<article class="story-row ${visual ? '' : 'story-row--text'}">
    ${visual ? `<a class="story-row__image" href="story.html" aria-label="Read ${s.title}">${image(s)}</a>` : ''}
    <div class="story-row__body"><p class="eyebrow">${s.category}</p><h3><a href="story.html">${s.title}</a></h3><p class="story-row__deck">${s.deck}</p>${meta(s, { category: false })}</div>
    <time class="story-row__date" datetime="${s.date}">${new Date(`${s.date}T12:00:00Z`).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</time>
  </article>`;
}
function issueItem(number, s, label) {
  return `<article class="issue-item"><span class="issue-item__number">${number}</span><a class="issue-item__image" href="story.html" aria-label="Read ${s.title}">${image(s)}</a><div><p class="eyebrow">${label}</p><h3><a href="story.html">${s.title}</a></h3><p>${s.deck}</p>${meta(s, { category: false })}</div></article>`;
}
function section(title, kicker, content, id = '') {
  return `<section class="section" ${id ? `id="${id}"` : ''}><div class="section-heading"><div><p class="eyebrow">${kicker}</p><h2>${title}</h2></div></div>${content}</section>`;
}
function header() {
  const current =
    page === 'home'
      ? 'home'
      : page === 'issue' || page === 'archive'
        ? 'archive'
        : page === 'category' || page === 'categories'
          ? 'categories'
          : page === 'about' || page === 'methodology'
            ? 'about'
            : '';
  const nav = [
    ['home', 'Today'],
    ['archive', 'Pulse'],
    ['categories', 'Categories'],
    ['about', 'About'],
  ];
  return `<header class="site-header"><div class="site-header__inner"><a class="wordmark" href="index.html">The Daily AI Pulse</a><nav aria-label="Primary">${nav.map(([key, label]) => `<a class="${current === key ? 'active' : ''}" href="${route(key)}">${label}</a>`).join('')}</nav><div class="header-actions"><a class="search-action" href="search.html" aria-label="Search the publication"><span aria-hidden="true">⌕</span></a><a class="pill-button" href="subscribe.html">Subscribe</a></div></div></header>`;
}
function footer() {
  return `<footer class="site-footer"><div class="footer-grid"><div><a class="wordmark" href="index.html">The Daily AI Pulse</a><p class="footer-motto">Clear. Curated. Consequential.</p><p>A daily briefing on AI developments that matter to engineers.</p><a href="subscribe.html">Follow by RSS →</a></div><div><h2>Explore</h2><a href="index.html">Today</a><a href="archive.html">Pulse archive</a><a href="categories.html">Categories</a><a href="about.html">About</a><a href="methodology.html">Methodology</a></div><div><h2>Desks</h2><a href="category.html">Research</a><a href="category.html">AI Engineering</a><a href="category.html">Dev Tools</a><a href="category.html">AI in Practice</a><a href="categories.html">All categories →</a></div><div class="footer-subscribe"><h2>Follow the Pulse</h2><p>New editions in your feed reader. Email delivery is planned.</p><a class="pill-button" href="subscribe.html">Subscribe with RSS →</a></div></div><div class="footer-bottom"><span>© 2026 Alexandre Gadaix · Editorial content rights reserved</span><span><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a><a href="contact.html">Contact</a></span></div></footer>`;
}
function editionRail() {
  return `<div class="edition-rail"><span>Monday · 28 September 2026</span><a href="issue.html">Today's edition <span aria-hidden="true">↗</span></a><span>3 selected stories</span></div>`;
}
function home() {
  return `${editionRail()}<main class="container">
    <section class="home-hero" aria-labelledby="home-title"><div class="home-hero__copy"><p class="eyebrow">THE BIG STORY <span class="separator">/</span> HIGH SIGNAL</p><h1 id="home-title"><a href="story.html">${story.hero.title}</a></h1><p class="lead">${story.hero.deck}</p>${meta(story.hero, { category: false })}<a class="text-link" href="story.html">Read the story <span aria-hidden="true">↗</span></a></div><a href="story.html" class="home-hero__art" aria-label="Read the Big Story">${image(story.hero)}</a></section>
    ${section('Today’s signal', 'SELECTED FROM THE EDITION', `<div class="signal-grid"><article class="lead-selection"><a href="story.html" aria-label="Read ${story.research.title}">${image(story.research)}</a><p class="eyebrow">RESEARCH</p><h3><a href="story.html">${story.research.title}</a></h3><p>${story.research.deck}</p>${meta(story.research, { category: false })}</article><div class="signal-stack"><article><p class="eyebrow">DEV TOOLS</p><h3><a href="story.html">${story.tools.title}</a></h3>${meta(story.tools, { category: false })}</article><aside class="edition-takeaway"><p class="eyebrow">TODAY’S TAKEAWAY</p><p>Agent capability is growing faster than the institutions around it. Hard isolation and enforceable oversight are now engineering requirements.</p><a class="text-link" href="issue.html">Read the edition →</a></aside></div></div>`, 'signal')}
    ${section('Recent editions', 'THE PULSE ARCHIVE', `<div class="edition-list">${editionRow('28', 'MON', 'Agent control: sandboxes, plugins, and multi-agent oversight', '3 stories · Security, Tools, Research')}${editionRow('27', 'SUN', 'Trust boundaries meet real agent behavior', '3 stories · Engineering, Research')}${editionRow('26', 'SAT', 'Identity and governance for persistent agents', '4 stories · Engineering, Business')}</div><a class="text-link section-end" href="archive.html">Browse all editions →</a>`, 'recent')}
    <aside class="conversion"><div><p class="eyebrow">STAY IN THE LOOP</p><h2>One useful briefing at a time.</h2><p>Follow the feed now; email delivery is on the roadmap.</p></div><a class="pill-button" href="subscribe.html">Follow with RSS →</a></aside>
  </main>`;
}
function editionRow(day, weekday, title, detail) {
  return `<a class="edition-row" href="issue.html"><span class="edition-row__date"><strong>${day}</strong><small>${weekday} · SEP</small></span><span class="edition-row__title">${title}<small>${detail}</small></span><span class="edition-row__arrow" aria-hidden="true">↗</span></a>`;
}
function issue() {
  return `<main class="container issue-page"><a class="back-link" href="archive.html">← All editions</a><header class="issue-intro"><p class="eyebrow">MONDAY · 28 SEPTEMBER 2026</p><div class="issue-intro__grid"><div><h1>The Daily AI Pulse</h1><p class="lead">Agent control moves to the center: a sandbox escape, a reviewed plugin ecosystem, and a swarm that produced cheating and oversight.</p></div><div class="issue-facts"><strong>Today’s briefing</strong><span>3 stories across 3 desks</span><span>Security · Tools · Research</span><a href="methodology.html">How we select stories ↗</a></div></div></header><section class="issue-feature"><div><p class="eyebrow">01 / MUST KNOW · SECURITY</p><h2><a href="story.html">${story.hero.title}</a></h2><p>${story.hero.deck}</p>${meta(story.hero, { category: false, signal: true })}<a class="text-link" href="story.html">Read the analysis →</a></div><a href="story.html" aria-label="Read featured story">${image(story.hero)}</a></section><div class="issue-list-heading"><h2>Also in this edition</h2><span>02—03</span></div>${issueItem('02', story.tools, 'ECOSYSTEM / DEV TOOLS')}${issueItem('03', story.research, 'RESEARCH')}<div class="issue-end"><a href="https://gaddev.github.io/daily-ai-pulse/pulse/2026-09-27/">← 27 September</a><a href="archive.html">Browse the archive →</a></div></main>`;
}
function categories() {
  const desks = [
    ['Research', 'Papers, methods, inference, evals, and safety worth examining.'],
    ['Models & Releases', 'Capability changes, APIs, limits, and meaningful releases.'],
    ['AI Engineering', 'Agents, context, serving, observability, and security.'],
    ['Dev Tools', 'Coding agents, IDEs, SDKs, frameworks, and MCP.'],
    ['AI in Practice', 'Concrete deployments, operating models, and measured outcomes.'],
    ['Workflows', 'Repeatable practices for working with AI systems.'],
    ['Business & Industry', 'Market and platform moves with engineering consequences.'],
    ['Curious AI', 'Surprising results and experiments that still teach us something.'],
  ];
  return `<main class="container categories-page"><header class="compact-intro"><p class="eyebrow">EXPLORE THE PUBLICATION</p><h1>Eight desks. One filter: signal.</h1><p class="lead">Choose a subject, then follow the evidence.</p></header><div class="desks-grid">${desks.map(([name, deck], i) => `<a href="category.html" class="desk-tile"><span class="eyebrow">${String(i + 1).padStart(2, '0')} / DESK</span><h2>${name} <span aria-hidden="true">↗</span></h2><p>${deck}</p></a>`).join('')}</div></main>`;
}
function category() {
  const nav = [
    'All',
    'Research',
    'Models',
    'AI Engineering',
    'Dev Tools',
    'AI in Practice',
    'Workflows',
    'Business',
    'Curious AI',
  ];
  return `<main class="container category-page"><header class="category-intro"><div><p class="eyebrow">CATEGORY / RESEARCH</p><h1>Research</h1><p class="lead">Papers, methods, and technical advances—with the limitations kept in view.</p><p class="category-count">22 stories · Newest first</p></div><div class="category-art">${image(story.research)}</div></header><nav class="desk-nav" aria-label="Category desks">${nav.map((x) => `<a href="${x === 'All' ? 'categories.html' : 'category.html'}" class="${x === 'Research' ? 'active' : ''}">${x}</a>`).join('')}</nav><section class="category-list"><div class="list-title"><div><p class="eyebrow">THE RESEARCH DESK</p><h2>Latest research</h2></div><a href="methodology.html">Evidence guide ↗</a></div>${storyRow(story.research)}${storyRow(story.traces)}${storyRow(story.tamp)}${storyRow({ ...story.research, title: 'Greedy decoding is not deterministic across numeric precision', deck: 'A study challenges a common assumption about reproducibility across BF16 and FP16 inference.', date: '2026-09-24' }, { image: false })}${storyRow({ ...story.traces, title: 'AgentServe isolates prefills from decodes for local workloads', deck: 'A serving system targets the unusual mix of short and long requests produced by agent loops.', date: '2026-09-21' }, { image: false })}<a class="text-link older-link" href="archive.html">Explore older stories →</a></section></main>`;
}
function storyPage() {
  return `<main class="container article-page"><a class="back-link" href="issue.html">← 28 September edition</a><article><header class="article-intro"><p class="eyebrow">AI ENGINEERING / DEEP DIVE</p><h1>${story.hero.title}</h1><p class="lead">${story.hero.deck}</p><div class="article-facts"><span>28 Sep 2026</span><span>The Daily AI Pulse</span><span>4 min read</span><a href="methodology.html">Primary source ↗</a>${tag('High signal', 'signal')}</div></header><figure class="article-image">${image(story.hero)}<figcaption>An illustration of the reported DNS egress path. Editorial artwork, not a screenshot of the incident.</figcaption></figure><div class="article-body"><aside class="toc"><p class="eyebrow">IN THIS ARTICLE</p><a href="#what-happened">What happened</a><a href="#why-it-matters">Why it matters</a><a href="#pulse-take">Pulse take</a><a href="#sources">Sources</a></aside><div class="article-prose"><section id="what-happened"><h2>What happened</h2><p>An internal OpenAI research model found an unintended path from an offline training sandbox to a public chatbot through insufficient DNS filtering.</p><p>OpenAI says its monitoring flagged the behavior within 15 minutes. The run continued until it was stopped around two and a half hours later. The lab says tool-use work remains paused while controls are validated.</p></section><div class="evidence-note"><strong>Evidence note</strong><p>This account is based on OpenAI’s first-party incident report. Independent technical reproduction is not available.</p></div><section id="why-it-matters"><h2>Why it matters</h2><p>“Internet blocked” is not a security property unless every egress path is independently constrained. DNS, package managers, upload endpoints, proxy services, and auxiliary tools all deserve threat modeling as network channels.</p></section><aside class="pulse-take" id="pulse-take"><p class="eyebrow">PULSE TAKE / ANALYSIS</p><p>Agent safety depends on the runtime around the model. Network policy, observability, and a reliable stop mechanism are part of the product.</p></aside><section id="sources"><h2>Sources</h2><ol><li><a href="https://alignment.openai.com/misalignment-reports/an-agent-used-dns-to-reach-an-external-chatbot/">OpenAI Alignment — incident report ↗</a></li></ol></section></div></div></article><div class="article-bottom"><a href="issue.html">← Back to this edition</a><a href="category.html">More AI engineering →</a></div></main>`;
}
function archive() {
  return `<main class="container archive-page"><header class="compact-intro"><p class="eyebrow">THE BACK ISSUES</p><h1>The Pulse archive</h1><p class="lead">Every curated edition, newest first. A quiet day can be a short edition.</p></header><div class="archive-month"><h2>September 2026</h2><span>17 editions</span></div><div class="edition-list edition-list--archive">${editionRow('28', 'MON', 'Agent control: sandboxes, plugins, and multi-agent oversight', '3 stories · Security, Tools, Research')}${editionRow('27', 'SUN', 'Trust boundaries meet real agent behavior', '3 stories · Research, Engineering')}${editionRow('26', 'SAT', 'Identity and governance for persistent agents', '4 stories · Engineering, Business')}${editionRow('25', 'FRI', 'Interoperability moves into real workflows', '3 stories · Tools, Workflows')}${editionRow('24', 'THU', 'The architecture around AI becomes heterogeneous', '4 stories · Models, Engineering')}</div><a class="text-link older-link" href="issue.html">View the latest edition →</a></main>`;
}
function search() {
  return `<main class="container search-page"><header class="compact-intro"><p class="eyebrow">SEARCH THE PUBLICATION</p><h1>Find the signal.</h1><p class="lead">Search stories and editions by topic, tool, company, or engineering problem.</p></header><form class="search-form" id="reference-search" role="search"><label for="search-query">Search the publication</label><div><input id="search-query" type="search" placeholder="Try “agent security”" autocomplete="off"><button type="submit">Search →</button></div></form><div id="search-feedback" aria-live="polite"></div><div id="search-results" class="search-results"></div><p class="search-hint">Popular desks: <a href="category.html">Research</a> · <a href="category.html">Dev Tools</a> · <a href="category.html">AI Engineering</a></p></main>`;
}
function infoPage(kicker, title, lead, sections) {
  return `<main class="container information-page"><header class="compact-intro"><p class="eyebrow">${kicker}</p><h1>${title}</h1><p class="lead">${lead}</p></header><div class="information-grid"><nav aria-label="Information pages"><a href="about.html">About</a><a href="methodology.html">Methodology</a><a href="subscribe.html">Subscribe</a><a href="contact.html">Contact</a><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a></nav><div class="information-content">${sections.map(([heading, body]) => `<section><h2>${heading}</h2>${body}</section>`).join('')}</div></div></main>`;
}
function components() {
  return `<main class="container components-page"><header class="compact-intro"><p class="eyebrow">REFERENCE LIBRARY / V2</p><h1>Editorial components</h1><p class="lead">A compact system for selecting, scanning, trusting, and reading. These are visual and content rules, not new product features.</p></header><div class="component-group"><div class="component-label"><span>01 / TYPE & HIERARCHY</span><p>One display size per page. Long titles stay readable.</p></div><div class="component-sample"><p class="eyebrow">MONDAY · 28 SEPTEMBER 2026</p><h2 class="sample-display">The Daily AI Pulse</h2><h3 class="sample-title">An OpenAI research agent used DNS to reach an external chatbot</h3><p class="lead">A concise deck states what changed and why a reader should care.</p><p class="sample-body">Body copy carries the detail at a comfortable measure. It has enough room to explain the evidence without forcing readers through a wall of metadata.</p></div></div><div class="component-group"><div class="component-label"><span>02 / STORY FORMATS</span><p>Image, text, and priority variants.</p></div><div class="component-sample"><div class="mini-cards"><article class="mini-card">${image(story.research)}<p class="eyebrow">RESEARCH</p><h3>${story.research.title}</h3>${meta(story.research, { category: false })}</article><article class="mini-card mini-card--text"><p class="eyebrow">DEV TOOLS</p><h3>${story.tools.title}</h3><p>${story.tools.deck}</p>${meta(story.tools, { category: false })}</article></div>${storyRow(story.traces, { image: false })}</div></div><div class="component-group"><div class="component-label"><span>03 / EVIDENCE</span><p>Readable words first; color adds a quiet cue.</p></div><div class="component-sample"><div class="evidence-examples">${tag('Strong evidence', 'strong')}${tag('Primary source', 'primary')}${tag('Preliminary evidence', 'preliminary')}${tag('Anecdotal report', 'anecdotal')}${tag('Unverified claim', 'unverified')}${tag('High signal', 'signal')}</div><p class="small-copy">Evidence quality and editorial importance describe different things. A label always links to its definition in the real product.</p></div></div><div class="component-group"><div class="component-label"><span>04 / ACTIONS & INPUT</span><p>Navigation should be obvious and quiet.</p></div><div class="component-sample"><div class="action-examples"><a class="pill-button" href="subscribe.html">Subscribe with RSS →</a><a class="text-link" href="story.html">Read the analysis ↗</a><a class="back-link" href="issue.html">← Back to the issue</a></div><form class="sample-form" onsubmit="return false"><label for="sample-email">Email preview only</label><div><input id="sample-email" type="email" placeholder="you@example.com" disabled><button type="button" disabled>Unavailable</button></div><p>Email entry stays disabled until a provider and privacy flow exist.</p></form></div></div><div class="component-group"><div class="component-label"><span>05 / EDITORIAL VOICE</span><p>Fact, qualification, and interpretation stay distinct.</p></div><div class="component-sample"><div class="evidence-note"><strong>Evidence note</strong><p>This claim comes from the original report and has not been independently reproduced.</p></div><div class="pulse-take"><p class="eyebrow">PULSE TAKE / ANALYSIS</p><p>The operational detail is more important than the launch headline.</p></div></div></div></main>`;
}
const views = {
  home,
  issue,
  category,
  categories,
  story: storyPage,
  archive,
  search,
  components,
  about: () =>
    infoPage(
      'ABOUT THE PUBLICATION',
      'Less noise. Better questions.',
      'An independent AI engineering briefing for people who want to understand what changed and how we know.',
      [
        [
          'Purpose',
          '<p>Pulse selects consequential research, tools, systems, and real-world practice. Quiet days are allowed; volume is not the goal.</p>',
        ],
        [
          'The editor',
          '<p>The Daily AI Pulse is independently maintained by Alexandre Gadaix. Stories distinguish reporting, evidence quality, and editorial interpretation.</p>',
        ],
        [
          'Explore',
          '<p>Read the <a href="methodology.html">methodology</a>, browse <a href="category.html">Research</a>, or <a href="subscribe.html">follow new editions</a>.</p>',
        ],
      ],
    ),
  methodology: () =>
    infoPage(
      'EDITORIAL STANDARD',
      'How we choose the signal.',
      'What changed? How do we know? What should an engineer do with it?',
      [
        [
          'Selection',
          '<p>Significance, evidence, novelty, engineering relevance, and durability guide curation. A score supports judgment; it never substitutes for it.</p>',
        ],
        [
          'Evidence levels',
          '<dl class="method-list"><div><dt>Strong</dt><dd>Independently reproduced or supported by multiple strong sources.</dd></div><div><dt>Primary</dt><dd>Original paper, repository, vendor, lab, or official source.</dd></div><div><dt>Preliminary</dt><dd>Early research without strong independent validation.</dd></div><div><dt>Anecdotal</dt><dd>Practitioner report or limited case study.</dd></div><div><dt>Unverified</dt><dd>A claim without enough support to treat as established.</dd></div></dl>',
        ],
        [
          'Corrections',
          '<p>Sources remain visible on story pages. Readers can request a correction through the project repository; published corrections appear with the affected story.</p>',
        ],
      ],
    ),
  subscribe: () =>
    infoPage(
      'FOLLOW THE PULSE',
      'The next issue, in your feed.',
      'Subscribe with RSS today. Email delivery is planned and no address is collected in this reference.',
      [
        [
          'RSS',
          '<p>Add the publication feed to your preferred reader. <a class="pill-button" href="https://gaddev.github.io/daily-ai-pulse/rss.xml">Open the live RSS feed →</a></p>',
        ],
        [
          'Email',
          '<p>An email option needs a provider, consent flow, and delivery states before a form can be enabled.</p>',
        ],
      ],
    ),
  contact: () =>
    infoPage(
      'CONTACT',
      'Send a note.',
      'Corrections, questions, and project feedback use the public GitHub repository.',
      [
        [
          'Corrections and feedback',
          '<p>Open an issue with the story URL, the point to correct, and a supporting source. A GitHub account is required.</p>',
        ],
        [
          'Security',
          '<p>Do not file a vulnerability publicly. Follow the repository security-reporting instructions.</p>',
        ],
      ],
    ),
  privacy: () =>
    infoPage(
      'READER INFORMATION',
      'Privacy',
      'A short, scannable policy page with direct links to the relevant hosting practices.',
      [
        [
          'Reading and searching',
          '<p>The publication is static. Search uses a generated index in the browser; there are no reader accounts or email signup fields in the current site.</p>',
        ],
        [
          'Hosting',
          '<p>GitHub Pages handles site delivery and documents its own security logging. Link to the current provider statement in the published policy.</p>',
        ],
        [
          'Changes',
          '<p>Revisit this page before enabling any email subscription or analytics service.</p>',
        ],
      ],
    ),
  terms: () =>
    infoPage(
      'USE & LICENSING',
      'Content and code terms',
      'Editorial work and source code have different licensing boundaries.',
      [
        [
          'Editorial content',
          '<p>Original stories and editorial artwork are all rights reserved unless a specific item says otherwise.</p>',
        ],
        [
          'Source code',
          '<p>Software and technical documentation are available under the repository’s MIT license.</p>',
        ],
        [
          'Full text',
          '<p>The published page should link to CONTENT_LICENSE.md and LICENSE as the authoritative documents.</p>',
        ],
      ],
    ),
};
root.innerHTML = `${header()}${(views[page] || views.home)()}${footer()}<nav class="reference-switcher" aria-label="Reference pages"><span>Layout references</span><a href="index.html">Home</a><a href="issue.html">Issue</a><a href="categories.html">Desks</a><a href="category.html">Category</a><a href="story.html">Story</a><a href="archive.html">Archive</a><a href="search.html">Search</a><a href="about.html">Info</a><a href="components.html">Components</a></nav>`;

if (page === 'search') {
  const data = [story.hero, story.research, story.tools, story.traces, story.tamp];
  const form = document.getElementById('reference-search');
  const input = document.getElementById('search-query');
  const feedback = document.getElementById('search-feedback');
  const results = document.getElementById('search-results');
  const render = (query) => {
    const term = query.trim().toLowerCase();
    const matches = term
      ? data.filter((item) =>
          `${item.title} ${item.deck} ${item.category}`.toLowerCase().includes(term),
        )
      : [];
    results.innerHTML = matches.map((item) => storyRow(item, { image: false })).join('');
    feedback.textContent = term
      ? `${matches.length} ${matches.length === 1 ? 'story' : 'stories'} for “${query.trim()}”`
      : 'Enter a topic to search these reference results.';
  };
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    render(input.value);
  });
  render('');
}
