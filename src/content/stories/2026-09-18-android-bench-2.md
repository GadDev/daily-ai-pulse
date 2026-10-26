---
title: "Android Bench 2.0 tests coding agents on work that can take days"
description: "Google's September release adds longer tasks and partial-completion scoring. Its reported 28% and 91% pass rates refer to different task sets."
date: 2026-09-18
updatedAt: 2026-10-26
category: research
tags: [android, coding-agents, benchmarks, long-horizon]
type: briefing
difficulty: intermediate
signal: high
evidence: primary
featured: true
companies: [Google]
image: "/images/stories/2026-09-18-android-bench-2.webp"
imageAlt: "A long engineering path crossing several Android development checkpoints"
corrections:
  - date: 2026-10-26
    note: "Clarified that the roughly 28% and 91% pass rates refer to different task sets, and that the multi-day estimates describe human engineering work rather than agent runtime."
sources:
  - label: "Android Developers — Android Bench 2.0"
    url: "https://android-developers.googleblog.com/2026/09/android-bench-2-long-horizon-tasks.html"
---

Google has added Android development tasks that it says can take a human engineer several days or a week: dependency upgrades, migrations and building apps from scratch. Android Bench 2.0's September 17 release tests agents on that broader work; the time estimate does not mean the agents themselves ran for a week.

Google reports a best pass rate of about 28% on the new long tasks, compared with roughly 91% on the original tasks. Those are different task sets, not evidence that a model became worse on an unchanged test.

## Passing and partial completion answer different questions

The release adds continuous completion scoring based on functionality, visual fidelity and regressions, with penalties for breaking instructions or structural constraints. A completion score can show partial progress on a migration that still fails the full task.

Google also evaluates models together with coding agents from their providers. Read each result as a tested model-and-agent pairing under a particular task set and scoring method. For your own Android evaluation, keep full success, partial completion, regressions and cost visible separately.
