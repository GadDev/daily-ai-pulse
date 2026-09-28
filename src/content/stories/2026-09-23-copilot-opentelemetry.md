---
title: 'GitHub Copilot exports agent traces through OpenTelemetry'
description: 'Enterprise admins can send model and tool spans from Copilot agent sessions into existing observability systems through managed settings.'
date: 2026-09-23
category: tools
tags: [github-copilot, opentelemetry, observability, agents]
type: pulse
difficulty: intermediate
signal: high
evidence: primary
featured: false
companies: [GitHub]
image: '/images/stories/2026-09-23-copilot-opentelemetry.svg'
imageAlt: 'Agent model and tool spans flowing into a telemetry trace'
sources:
  - label: 'GitHub — OpenTelemetry in the GitHub Copilot app'
    url: 'https://github.blog/changelog/2026-09-22-opentelemetry-in-the-github-copilot-app/'
---

GitHub Copilot now supports OpenTelemetry export configured through enterprise-managed settings. Teams can trace agent sessions, model requests, and tool interactions inside their existing monitoring stack.

Prompt and response content is excluded by default unless content capture is explicitly enabled.

## Why it matters

Agent observability is converging on standard infrastructure instead of bespoke dashboards. That makes traces easier to correlate with application, security, and cost telemetry.
