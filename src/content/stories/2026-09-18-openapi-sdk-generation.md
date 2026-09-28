---
title: 'Google and Speakeasy push SDK generation toward an open toolchain'
description: 'A new collaboration argues that client SDK generation should be driven from OpenAPI contracts with reproducible, inspectable tooling rather than hand-maintained wrappers.'
date: 2026-09-18
category: tools
tags: [openapi, sdk, developer-tools, automation]
type: pulse
difficulty: intermediate
signal: medium
evidence: primary
featured: false
companies: [Google, Speakeasy]
image: '/images/stories/2026-09-18-openapi-sdk-generation.svg'
imageAlt: 'One API contract fanning out into several generated SDK packages'
sources:
  - label: 'Google Developers — Why client SDK generation belongs in the open'
    url: 'https://developers.googleblog.com/why-client-sdk-generation-belongs-in-the-open/'
---

Google and Speakeasy make the case for treating OpenAPI descriptions as executable product infrastructure: one contract can drive consistent SDK generation across languages instead of leaving teams to maintain wrappers by hand.

## Why it matters

As agents increasingly consume APIs directly, **machine-readable contracts and reproducible client generation** become more valuable. Better SDK automation helps both human developers and tool-using agents work against the same canonical interface.
