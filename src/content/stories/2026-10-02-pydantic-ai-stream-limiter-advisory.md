---
title: "Pydantic AI warns that streamed requests can exhaust shared model capacity"
description: "An October 2 advisory identifies a streaming slot leak in model-level concurrency limiters; version 2.53.0 contains the fix."
date: 2026-10-02
category: engineering
tags:
  - agents
  - frameworks
  - security
  - inference
  - serving
type: pulse
difficulty: intermediate
signal: high
evidence: primary
featured: false
companies:
  - Pydantic
image: "/images/stories/2026-10-02-pydantic-ai-stream-limiter-advisory.webp"
imageAlt: "A mechanical capacity rack holding terracotta blocks while its release lever remains disconnected"
sources:
  - label: "Pydantic AI maintainers — dated primary source"
    url: "https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-6fqq-452j-qhrp"
---

*Catch-up edition prepared October 6, using evidence dated no later than 2026-10-02, 23:59 Luxembourg time. Source pages were retrieved retrospectively; an original day-end snapshot is unavailable.*

Pydantic AI published [GHSA-6fqq-452j-qhrp](https://github.com/pydantic/pydantic-ai/security/advisories/GHSA-6fqq-452j-qhrp) on October 2. It affects `pydantic-ai` and `pydantic-ai-slim` versions **2.10.0 through versions below 2.53.0**; **2.53.0** is patched.

The defect concerns `ConcurrencyLimitedModel` and `limit_model_concurrency`. A streamed request can acquire a slot in one task and attempt release in another. The underlying limiter rejects that cleanup, leaving shared capacity occupied.

Repeated client disconnects can therefore exhaust a long-lived limiter on a network-facing streaming endpoint. Fully consumed `stream_text()` requests using default debouncing can also reach the faulty path. Completion alone does not establish safety.

The maintainers distinguish **agent-level `max_concurrency` and non-streaming model calls**, which are unaffected. Their mitigation is to upgrade, use agent-level concurrency control temporarily, or avoid streaming through the affected model-level limiter.

For service owners, the first operational question is where capacity is enforced. Inventory wrappers around shared models, then monitor occupied slots alongside active requests. A widening gap is a useful investigation signal, rather than proof of this specific defect.

The affected range and mitigation are maintainer-reported. This edition did not reproduce the exploit or validate the patch.
