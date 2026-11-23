---
title: 'Generative UI, Part 4: A Small Language Between the Model and the Screen'
description: 'Explore OpenUI Lang, reactive state and streaming compilation, while separating documented OpenAI Intelligent UI behavior from reverse-engineered DIL details.'
status: draft
format: review
verification: researched
difficulty: intermediate
author: The Daily AI Pulse
verifiedAt: 2026-11-23
series:
  id: generative-ui-architectures
  title: Generative UI Architectures
  part: 4
image: /images/guides/generative-ui-streaming-languages.webp
imageAlt: 'A narrow folded paper strip passes through a substantial ink-colored printing mechanism and opens into a structured paper relief.'
relatedGuides: []
sources:
  - label: OpenAI — GPT-6 and Intelligent UI
    url: https://openai.com/index/gpt-6-for-everyone/
  - label: OpenAI — Intelligent UI help
    url: https://help.openai.com/en/articles/20001598-intelligent-ui-in-chatgpt
  - label: Thesys — Original Intelligent UI teardown
    url: https://www.openui.com/blog/how-chatgpt-intelligent-ui-works
  - label: OpenUI — Language introduction
    url: https://www.openui.com/docs/openui-lang
  - label: OpenUI — Reactive state
    url: https://www.openui.com/docs/openui-lang/reactive-state
  - label: OpenUI — Architecture
    url: https://www.openui.com/docs/openui-lang/architecture
  - label: Thesys — Open Intelligent UI source
    url: https://github.com/thesysdev/open-intelligent-ui
  - label: Flutter — A2UI Express format
    url: https://flutter.dev/blog/a2ui-launch
---

A room comparison becomes much more useful when changing the capacity filter updates the options immediately. Sending every click back to a language model is a costly way to implement a dropdown.

One answer is to let the model describe the interaction once, using a small language the application understands. A renderer then manages state and calls approved tools as the user interacts. The model authors the wiring; deterministic software runs the interaction.

**Genre:** practical technical explainer. **Evidence:** primary product documentation and Thesys's first-party account of its reverse engineering, reviewed on 23 November 2026. OpenUI examples below are illustrative and unexecuted. We have not reproduced the DIL teardown, benchmarked formats or verified cross-platform equivalence. Internal behavior is attributed rather than presented as a public OpenAI contract.

## What OpenAI actually documents

[OpenAI's Intelligent UI announcement](https://openai.com/index/gpt-6-for-everyone/) describes native streamable components and a compiler that processes interfaces during generation. Its [help page](https://help.openai.com/en/articles/20001598-intelligent-ui-in-chatgpt) describes interactive responses within ChatGPT. That supports a product-level account of progressive interface composition.

It does not provide a public DIL language specification. The name **DIL**, details of compiled JavaScript and the sandbox execution pipeline come from [Thesys's October teardown](https://www.openui.com/blog/how-chatgpt-intelligent-ui-works). The authors report inspecting conversations, streams and publicly served client code. Their work is original observational evidence, with a scope limited to the web client they examined. Thesys also builds a competing implementation.

That distinction changes an engineering decision. You can study a teardown for ideas. You should not build a production integration around internal field names and assume OpenAI has promised to preserve them. OpenAI's native Intelligent UI and tool-delivered MCP Apps also have different ownership paths, even when both appear inside ChatGPT.

## OpenUI Lang is a public implementation you can inspect

[OpenUI Lang](https://www.openui.com/docs/openui-lang) uses compact statements that refer to registered components. The client renderer parses the output and resolves it against the application's library. “Streaming compiler” is a useful family description, but not every implementation shares DIL's reported server-compilation path.

Here is a small constructed program using component signatures from OpenUI's documented `openuiLibrary`. It could be sent as text chunks in a stream:

```text
$capacity = "6"
filter = Select("capacity", [SelectItem("6", "6 people"), SelectItem("8", "8 people")], null, null, $capacity)
summary = TextContent("Minimum capacity: " + $capacity)
root = Stack([filter, summary])
```

This is OpenUI Lang, not JavaScript to pass to `eval`, not DIL and not HTML. It assumes the corresponding library and renderer. It does not fetch rooms or reserve one. The example's expected behavior is a capacity selector whose summary follows the selected value; that behavior has not been executed here.

The `$capacity` variable is reactive. As described in the [state documentation](https://www.openui.com/docs/openui-lang/reactive-state), a compatible input can update it and dependent expressions can recompute without another model call. Positional signatures are library-specific: a similarly named `Select` in another catalog may take different arguments.

## Local interaction can still call a remote service

Extend the design with a documented `Query` expression:

```text
rooms = Query("list_rooms", {minimumCapacity: $capacity}, {rows: []})
```

This is a fragment, not a complete room-list UI. It requires the host to provide an authenticated `list_rooms` tool returning a `rows` array. OpenUI's [architecture documentation](https://www.openui.com/docs/openui-lang/architecture) describes a browser-side tool provider that can call application API routes or connect to MCP.

Changing capacity can therefore requery the server without invoking an LLM. The state update is local; the availability lookup is remote. Persistence, latency and authorization still depend on the service. “No extra model turn” does not mean “offline.”

Keep the reservation operation separate from the read query. An input update must not accidentally create a booking. In our recommended design, selection prepares a draft and an explicit confirmation submits it to a server that checks identity, interval and availability.

## Why smaller syntax is only part of the streaming problem

OpenUI advertises token savings against JSON in its own benchmark. A2UI 1.0 also introduced [Express](https://flutter.dev/blog/a2ui-launch), a compact format for a catalog-based system. These examples undermine a neat product chart that treats catalog composition and DSLs as exclusive categories.

Treat efficiency figures as workload-specific vendor claims. Measure your actual tokenizer, component library, prompt instructions, retries and transport updates. A shorter model response may still produce large compiled messages. A fast first card may remain unusable until its data and handlers arrive.

The more revealing production questions concern incomplete input. Can the renderer show a valid partial structure? What happens when the final chunk never arrives? Can an invalid statement fail without erasing a valid neighboring section? Does a patch preserve a user's edited values and keyboard focus?

Define stable identities and ownership rules before allowing generated revisions. If the user chooses eight people while the model is finishing its answer, a late default of six should not silently overwrite that choice. This is a synchronization problem, not a typography problem.

## Put Open Intelligent UI in the right column

Thesys's [Open Intelligent UI repository](https://github.com/thesysdev/open-intelligent-ui) describes an independent implementation built on OpenUI Lang 1.0 and a primitive component library. Its main path belongs in the language-and-renderer family. It is not inherently an MCP server delivering every answer as a `ui://` HTML bundle.

The demo also includes an `HtmlView` escape hatch that embeds HTML in a sandboxed iframe. That is a hybrid: a language-driven interface can contain an embedded micro-app. Classify the boundary actually used by a feature, rather than assigning a permanent architecture to its brand name.

## Evaluate the runtime, not just the grammar

A controlled language can narrow what a model expresses, but safety depends on the functions, components and tools exposed by the runtime. Bound resource usage, validate arguments and keep credentials out of generated programs. A permitted query can still request data the user should not see unless the server enforces access.

For a production trial, capture generated source, runtime/library versions and privacy-conscious diagnostics. Exercise malformed statements, missing tools, tool failures, interrupted streams and updates while a form is dirty. Pair interactivity with a useful textual fallback; avoid declaring success from a screenshot alone. These are evaluation criteria, not reported test passes.

Choose the language runtime when its composition and reactive behavior solve a real product problem. For the meeting-room assistant, the decisive result is modest: a user changes capacity, sees current options and books once with a trustworthy confirmation. The format has earned its complexity only if that journey becomes easier to understand and operate.
