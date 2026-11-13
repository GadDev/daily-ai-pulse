---
title: "Google's agent monitor catches most executed attacks—and misses poisoned memory"
description: "A 1,774-session evaluation gives Agent Anomaly Detection useful public-benchmark evidence, false-alarm ranges and a sharp warning about post-execution security."
date: 2026-11-13
category: engineering
tags: [agent-security, observability, prompt-injection, evals]
type: deep-dive
difficulty: advanced
signal: high
evidence: primary
featured: false
companies: [Google]
image: "/images/stories/2026-11-12-google-agent-anomaly-detection-benchmarks.webp"
imageAlt: "A dark monitoring ring catches terracotta traces leaving an agent path while a faint memory route slips beneath it"
sources:
  - label: "Google Developers — Agent Anomaly Detection benchmark results"
    url: "https://developers.googleblog.com/en/how-agent-anomaly-detection-scores-on-benchmarks-we-didnt-write/"
---

Security products usually arrive with a perfect demo and a missing denominator. Google has now supplied some denominators for Agent Anomaly Detection.

The private-preview system reads agent traces and logs asynchronously, looking for sessions in which an agent acts outside its intended boundaries. Google tested it on 1,774 sessions from five public, non-Google security benchmarks. Of the harmful instructions that agents actually carried out, the monitor flagged 87%.

That headline is useful. The misses are more useful.

## What changed

When Google introduced Agent Anomaly Detection in September, it described an out-of-band oversight layer for the Gemini Enterprise Agent Platform. The new report adds an evaluation against AgentDojo, InjecAgent, Agent Security Bench, AgentDyn and AgentHarm.

Each benchmark case ran through an ADK agent using Gemini 2.5 Flash in simulated applications. Deterministic benchmark code inspected the final application state and decided whether harm occurred. The anomaly detector saw the same traces and logs but did not control the benchmark label.

Google reports:

- 87% of carried-out harmful instructions were flagged overall;
- benign-session alert rates ranged from 2% to 16%, depending on tool use;
- detection improved after the system had several hundred ordinary sessions for a baseline;
- only 4 of 18 harmful sessions caused by poisoned long-term memory were caught;
- about 6% of submitted sessions returned no detection result.

The evaluation is still first-party. Google selected the configuration, ran the product and reported the results. But the public benchmark set, deterministic outcome checks and disclosed weaknesses make this substantially better evidence than a launch claim.

## Detection after execution is incident response

Agent Anomaly Detection does not block the harmful tool call. It reports what happened after the system acted.

That can be valuable. A fast alert can contain damage, preserve evidence and expose attacks that preventive filters missed. It is not permission enforcement.

If an agent can move money, publish data or modify production, “we detected it later” is not a sufficient control. Consequential actions still need pre-execution policy, least-privilege credentials and approval where the cost of a mistake is high.

The architecture should be layered:

- screen untrusted prompts and tool output;
- validate proposed tool calls against the user's request and explicit policy;
- restrict tools and credentials by task;
- require approval for irreversible or external actions;
- record complete traces for post-execution monitoring;
- route high-severity findings to an incident process.

## Poisoned memory is the uncomfortable result

The monitor struggled when a malicious instruction was planted in long-term memory.

That makes sense. An instruction retrieved from memory may look like ordinary context rather than an external attack. If the agent consistently follows it, behavioral baselining can normalize the compromise.

Teams should treat memory as an input supply chain. Record who or what wrote each item, preserve source and timestamp, separate facts from instructions, expire stale entries and require stronger review before persistent memory can influence high-impact tools.

An anomaly detector cannot reliably tell whether the agent is departing from policy if corrupted memory has quietly become the policy it sees.

## What teams should test

Replay your own traces before requesting the private preview. Public benchmarks are useful, but production tools and normal behavior determine the false-alarm burden.

Test direct harm, indirect prompt injection, small suspicious actions, poisoned memory, new agents with little history and ordinary use of high-impact tools. Count missing detector results as failures, not as absent data.

Measure time to finding, analyst workload, false positives by tool and the percentage of harmful actions stopped before execution versus merely reported afterward.

## Pulse take

Google deserves credit for publishing the weak spots. “87% detected” sounds reassuring until you ask whether the transfer already happened.

Out-of-band monitoring is an important layer. It is also the layer that tells you your other boundaries failed.

Use it. Just do not let a dashboard badge impersonate authorization.
