---
title: 'Generative UI, Part 1: Three Architectures Behind the Same Chat Window'
description: 'Compare component catalogs, sandboxed MCP Apps and streaming UI languages by what crosses the network, who renders it and who authorizes actions.'
status: draft
format: review
verification: researched
difficulty: intermediate
author: The Daily AI Pulse
verifiedAt: 2026-11-23
series:
  id: generative-ui-architectures
  title: Generative UI Architectures
  part: 1
image: /images/guides/generative-ui-architecture-map.webp
imageAlt: 'A sculptural architectural junction with three differently constructed passages through one pale stone structure.'
relatedGuides: []
sources:
  - label: A2UI — Protocol 1.0
    url: https://github.com/a2ui-project/a2ui/blob/main/specification/v1_0/docs/a2ui_protocol.md
  - label: Flutter — A2UI 1.0 and a2ui_flutter
    url: https://flutter.dev/blog/a2ui-launch
  - label: MCP — Apps overview
    url: https://modelcontextprotocol.io/extensions/apps/overview
  - label: AG-UI — Protocol overview
    url: https://docs.ag-ui.com/introduction
  - label: A2A — Specification
    url: https://a2a-protocol.org/latest/specification/
  - label: OpenUI — Language introduction
    url: https://www.openui.com/docs/openui-lang
---

A colleague asks an assistant to find a meeting room for six people, compare the available options and reserve one. A paragraph can explain availability. It is a miserable place to operate a room picker.

Traditional applications already solve this with forms and filters. The opportunity for **generative UI** is to choose and assemble the relevant controls from a request, especially when the request combines constraints the original screen designer did not anticipate. The form does not need to disappear. The assistant needs a better way to hand it to you.

This series uses that meeting-room request to examine three architectural patterns. Our classification is an engineering lens, not a standard declaring that exactly three kinds of GenUI exist. The patterns overlap, and an application can combine them.

**Scope and evidence:** a researched architecture comparison for developers familiar with HTTP and frontend components, checked on 23 November 2026. Product integrations, security boundaries and performance have not been independently exercised. Payloads in later parts are educational examples, not captured production traffic. We compare documented mechanisms rather than rank products by unmeasured speed.

## Start with the thing that travels

The useful question is what your application receives and what it permits that object to do.

| Pattern                  | Typical payload                                                                   | Who supplies the visible implementation?                | Where the difficult work lands                               |
| ------------------------ | --------------------------------------------------------------------------------- | ------------------------------------------------------- | ------------------------------------------------------------ |
| Component catalog        | Structured component descriptions, properties and state updates                   | The host application's registered components            | Catalog design, semantic validation and state reconciliation |
| Tool-served micro-app    | HTML resource, associated assets, data and bridge messages                        | The tool publisher's app, embedded by the host          | Isolation, capability mediation and host compatibility       |
| Intermediate UI language | Compact expressions or statements; possibly compiled output on a later connection | A renderer mapping the language to a controlled library | Parsing, reactive execution and incremental updates          |

These are different contracts even when all three display an identical room comparison. A screenshot cannot tell you which one you have bought.

<figure class="guide-technical-diagram">
  <picture>
    <source media="(max-width: 600px)" srcset="/images/guides/generative-ui-decision-tree-mobile.svg" />
    <img src="/images/guides/generative-ui-decision-tree.svg" alt="Decision tree: use deterministic UI for a fixed workflow; otherwise choose a tool-served micro-app when the publisher must deliver its own interface, or choose a host component renderer with either structured descriptions or a compact language. All paths require server-side authorization." width="820" height="820" loading="lazy" decoding="async" />
  </picture>
  <figcaption>Choose the ownership boundary first. Representation and transport are separate decisions.</figcaption>
</figure>

## Pattern one: the agent arranges your furniture

In a catalog architecture, the application exposes a vocabulary: a room comparison, capacity filter and reservation summary, for example. The model selects those components and proposes their properties. The renderer supplies the actual implementation.

[A2UI](https://github.com/a2ui-project/a2ui/blob/main/specification/v1_0/docs/a2ui_protocol.md) separates component structure from data and supports progressive updates. Its Flutter implementation renders widgets within the application. The package previously called GenUI was renamed **a2ui_flutter** with the [17 November A2UI 1.0 launch](https://flutter.dev/blog/a2ui-launch).

Vercel json-render, Tambo and Hashbrown also let applications constrain generated UI through components and schemas, using different APIs and runtime models. They are related approaches, not interchangeable A2UI implementations. Part 2 compares their integration boundaries.

For our room picker, this is attractive when the product team already owns accessible room cards and a dependable booking workflow. The model gets composition freedom; it does not need permission to rewrite the reservation system.

## Pattern two: the tool brings its own room

[MCP Apps](https://modelcontextprotocol.io/extensions/apps/overview) lets a tool declare an interactive resource. The host retrieves HTML and renders the app in a controlled environment, with a message bridge for data and actions. In browser hosts, the boundary is a sandboxed iframe.

The room service can therefore supply a specialized floor-plan viewer without requiring every host to implement that viewer. The application is often ordinary developer-written software. The model may only choose the tool and its inputs: serving an interface does not imply generating its source code on every request.

This moves ownership of presentation toward the tool publisher. It also creates a real integration obligation: the host must implement the extension, enforce its policies and handle the app's lifecycle. Supporting core MCP alone does not establish UI support. Part 3 follows that boundary through actual message shapes.

## Pattern three: the model writes a small interface language

[OpenUI Lang](https://www.openui.com/docs/openui-lang) describes interfaces in compact statements that a renderer resolves against the application's component library. This can encode layout, data dependencies and interactions together. Part 4 separates that public implementation from claims about OpenAI's internal DIL machinery.

Our room comparison might declare a capacity variable, an input bound to it and a query using the variable. Changing capacity can trigger a deterministic query without another model turn. That saves a conversation round trip; it does not make the database call local.

The overlap matters. Catalog systems also support interactivity, and A2UI 1.0 introduced **Express**, a compact inference format. A DSL is a representation choice, while a catalog is a control boundary. Treating JSON and DSL as opposing security models confuses syntax with authority.

## Four protocol names, four different jobs

| Name  | Primary relationship                                          | What it does not establish by itself                         |
| ----- | ------------------------------------------------------------- | ------------------------------------------------------------ |
| MCP   | Agent/client to tools and resources                           | A universal component renderer or automatic MCP Apps support |
| A2A   | Independent agents exchanging work and results                | The appearance or accessibility of the final UI              |
| AG-UI | Agent backend to user-facing application through typed events | A single required UI description language                    |
| A2UI  | Agent-produced UI descriptions to a compatible renderer       | A mandatory transport or business authorization policy       |

[AG-UI's documentation](https://docs.ag-ui.com/introduction) distinguishes the application event connection from the UI description. [A2A's specification](https://a2a-protocol.org/latest/specification/) addresses collaboration among independent agents. A2UI can travel through supported bindings; there is no requirement to install all four protocols to show a room card.

## A decision you can take to a design review

Begin with the existing deterministic booking form. If it handles the task clearly, keep it. Add generation where it earns its place: selecting useful comparisons or adapting a view to an unusual combination of constraints.

Choose a catalog when your team needs to own presentation and behavior across the product. Evaluate a micro-app when an external publisher needs to deliver a specialized experience inside compatible hosts. Evaluate a compact UI language when generated composition and reactive dependencies justify an additional language runtime. Test that choice against your actual components and failure cases.

For every option, ask what happens after the room fills up while the user is reading. The booking service must recheck availability and authority at submission. An elegantly generated interface remains a client of that service. It cannot make yesterday's availability true.

The remaining parts own different questions: Part 2 examines catalog contracts, Part 3 follows the tool-to-host boundary, and Part 4 studies streaming languages and reactive state. Read them as alternative implementations of the same task, not a migration ladder.
