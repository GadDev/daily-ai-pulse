---
title: "AI agents may make social trends easier to start"
description: "A peer-reviewed study finds lower adoption thresholds across five language-model agents and simulates how even a modest agent share can amplify diffusion."
date: 2026-11-13
category: curious
tags: [ai-culture, human-ai-relationships, agents]
type: deep-dive
difficulty: intermediate
signal: high
evidence: strong
featured: false
companies: []
image: "/images/stories/2026-11-06-artificial-agents-social-contagion.webp"
imageAlt: "A few terracotta artificial nodes lower the threshold of a pale social network and send a wider adoption wave through it"
sources:
  - label: "npj Complexity — The amplifier effect of artificial agents in social contagion"
    url: "https://www.nature.com/articles/s44260-026-00101-2"
---

An AI agent does not need to persuade a human to change society. It can change the count that humans and other agents respond to.

A peer-reviewed study in _npj Complexity_ repeated two human choice experiments with artificial agents powered by five language models. Across the tested domains, the agents adopted at systematically lower social thresholds than human participants. Simulations calibrated with those results produced higher total adoption even when artificial agents made up only a modest share of the network.

The result is not “bots make everything viral.” It is stranger and more useful: delegating decisions changes the population making the decisions.

## What the researchers tested

Social-contagion models often describe adoption with a threshold: the share of other people who must adopt before someone follows. A person may wait for broad evidence because a choice costs money, reputation or attention.

The researchers administered two previously used human choice experiments to agents built on five language models. They estimated the agents' adoption thresholds, compared them with the human results and used the measured differences in diffusion simulations while holding the network structure fixed.

The artificial agents crossed the adoption threshold earlier. In the simulations, that changed the eventual spread of the behavior.

The paper is peer reviewed and open access, with methods and supplementary material. The bounded reporting pass found no independent replication. The simulations are calibrated experiments, not observations of deployed agents changing a real market or community.

## Why agents might be easier to move

Humans pay costs that a model does not experience. We worry about looking foolish, wasting money, losing status or choosing too early. A model can describe those concerns without feeling them.

Language models may also encode abundant text about social proof and majority behavior. When prompted to make a decision, they can overweight the visible signal that others have adopted.

That does not mean every agent is conformist. Thresholds depend on prompts, models, tools, role definitions and the information presented. But if many organizations deploy similar models with similar instructions, their errors may be correlated rather than independent.

## The network can change without the humans changing

Imagine a marketplace where automated purchasing agents recommend a new service. Or a policy forum where institutional agents summarize whether peer organizations have adopted a standard. Or a social platform where agents curate what appears popular.

Even if the human users keep the same preferences, artificial participants can increase the apparent adoption count and trigger thresholds sooner. A recommendation system becomes part of the phenomenon it measures.

This matters for engineering because aggregate behavior can emerge from individually reasonable agents. No agent needs a malicious objective. Each one can follow its local instruction while the network becomes more volatile.

## What teams should test

Before placing decision agents into a system with feedback loops, measure more than individual accuracy.

- Vary the visible adoption signal and estimate the agent's threshold.
- Repeat the test across model versions and prompts.
- Measure whether agents fail independently or move together.
- Simulate different shares of automated participants.
- Separate genuine human adoption from agent-generated activity.
- Add friction when an agent's choice changes the signal shown to others.
- Preserve provenance so downstream systems know whether an action came from a person or an agent.

The goal is not to eliminate automation. It is to stop treating automated participants as neutral copies of humans.

## Pulse take

This is the kind of result the AI industry tends to notice after deployment: the agent performed its task, and the system around it behaved differently.

We talk about agents replacing labor. The subtler change may be agents replacing hesitation.

In a network, hesitation is not merely inefficiency. Sometimes it is stability.
