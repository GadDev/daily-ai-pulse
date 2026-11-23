---
title: 'Generative UI, Part 2: Let the Agent Compose Your Components'
description: 'Understand A2UI, a2ui_flutter, json-render, Tambo and Hashbrown through a room picker, a concrete JSON payload and the limits of schema validation.'
status: published
publishedAt: 2026-11-23
format: review
verification: researched
difficulty: intermediate
author: The Daily AI Pulse
verifiedAt: 2026-11-23
series:
  id: generative-ui-architectures
  title: Generative UI Architectures
  part: 2
image: /images/guides/generative-ui-component-catalogs.webp
imageAlt: 'A small architectural assembly made from a limited set of fitted stone blocks, with one terracotta piece lifted into place.'
relatedGuides: []
sources:
  - label: json-render — Specs
    url: https://json-render.dev/docs/specs
  - label: json-render — Catalog
    url: https://json-render.dev/docs/catalog
  - label: A2UI — Protocol 1.0
    url: https://github.com/a2ui-project/a2ui/blob/main/specification/v1_0/docs/a2ui_protocol.md
  - label: Flutter — A2UI 1.0 launch
    url: https://flutter.dev/blog/a2ui-launch
  - label: Tambo — Component registration and state patterns
    url: https://docs.tambo.co/
  - label: Hashbrown — UI Kits
    url: https://hashbrown.dev/docs/react/recipes/ui-kits
  - label: Hashbrown — Version 0.8 changes
    url: https://hashbrown.dev/blog/2026-10-22-hashbrown-v-0-8-0
---

Your product already has a good room card. It handles keyboard navigation, capacity labels and unavailable dates. Replacing it with model-written HTML would mean doing that work again, this time while a user waits.

A component catalog takes a more practical route. Tell the agent which pieces it may compose, then render its proposal through implementations your application already owns. Think of a box of building blocks with a parts list. The model can arrange the blocks; it does not manufacture a new booking engine.

**Genre:** practical technical explainer. **Evidence:** documentation reviewed on 23 November 2026; no end-to-end model or SDK execution. The JSON below is a constructed example using json-render's documented React spec shape and an explicitly defined hypothetical catalog. It is not an A2UI payload or a complete application.

## A catalog is a product boundary

For our meeting-room assistant, expose three components: `RoomComparison`, `CapacityFilter` and `ReservationSummary`. Describe what each means, its required properties and the data it accepts. Keep the final reservation action in an application-owned flow.

This is where the design work moves. A generic table gives the model flexibility but little knowledge of your product. A domain component can enforce useful semantics: capacities have units, timestamps have a timezone, and a room's identifier is separate from its display name.

Catalog size is a trade-off. Too few components force awkward answers. Too many overlapping components make selection harder and enlarge the model's instructions. Start with the smallest set that handles a meaningful task, then study where it fails.

## What crosses the network

The [json-render spec documentation](https://json-render.dev/docs/specs) shows a React representation with a root identifier and an element map. With a hypothetical catalog whose `RoomComparison` accepts a `rooms` array, a response could be:

```json
{
  "root": "room-options",
  "elements": {
    "room-options": {
      "type": "RoomComparison",
      "props": {
        "rooms": [
          { "id": "room-a", "name": "Atrium", "capacity": 6 },
          { "id": "room-b", "name": "Library", "capacity": 8 }
        ]
      },
      "children": []
    }
  }
}
```

The room names and capacities are invented teaching data. `RoomComparison` is our component name, not a built-in export. The renderer needs a matching registered implementation and schema. Sending this JSON to an arbitrary frontend will not conjure a room picker.

Crucially, a syntactically valid result could still contain fabricated availability. Our proposed production design fetches room records from an authenticated service and validates any selected identifiers against that result. A schema can check that capacity is a number. It cannot establish that the room is free at 14:00.

## Five projects with different integration contracts

| Project                      | Documented mechanism                                                                       | What to evaluate for this task                                        |
| ---------------------------- | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| A2UI                         | Versioned UI messages separating surface structure and data                                | Catalog negotiation, renderer support and version compatibility       |
| a2ui_flutter, formerly GenUI | Flutter implementation of A2UI                                                             | Widget catalog, supported protocol version and mobile behavior        |
| Vercel json-render           | Schemas, catalogs and registries mapping specs to implementations                          | Chosen schema, renderer package and action integration                |
| Tambo                        | Registered React components with streamed properties; generative and interactable patterns | Thread lifetime, persistent component identity and backend deployment |
| Hashbrown                    | Component/UI Kit schemas and renderers for React and Angular                               | Client/server adapter compatibility and schema ownership              |

The table compares documented responsibilities, not measured reliability. [Tambo](https://docs.tambo.co/) distinguishes components created for a response from existing interactable components updated by identity. [Hashbrown UI Kits](https://hashbrown.dev/docs/react/recipes/ui-kits) package the vocabulary and rendering side together. Its [0.8 release notes](https://hashbrown.dev/blog/2026-10-22-hashbrown-v-0-8-0) identify breaking changes and require coordinated client and adapter updates. Old snippets need version review before reuse.

These libraries can help implement the same product idea while remaining incompatible at the API or payload level. A component called `RoomComparison` in two registries is not proof that either registry understands the other's state model.

## A2UI's surface lifecycle

The [A2UI 1.0 specification](https://github.com/a2ui-project/a2ui/blob/main/specification/v1_0/docs/a2ui_protocol.md) defines messages to create a surface, update components, update its data model and delete the surface. Ordered delivery and clear message framing matter because updates refer to existing state.

For the room assistant, the surface can persist while new availability arrives. A refresh should update the data rather than discard a user's selected room without explanation. Reconnecting requires an application strategy for resynchronization; replaying arbitrary partial messages is not a recovery plan.

The [Flutter launch](https://flutter.dev/blog/a2ui-launch) also documents hierarchy restrictions and the Express inference format. That is a useful warning against an oversimplified taxonomy: catalog control does not require verbose JSON to be the model's only output format.

## Treat an action as a request

Suppose the user selects Atrium and presses Reserve. In our design, the handler sends a room identifier, requested interval and an idempotency key to an authenticated backend. The backend derives the user from the session, checks permission, checks conflicts and returns a durable reservation identifier. The model does not supply trusted identity or the final success message.

State has several owners. The highlighted row may belong to local presentation state. Availability belongs to the room service. A pending reservation belongs to the submission flow. The model's conversational summary is context. Collapsing those into one mutable object makes stale screens and duplicate submissions surprisingly easy.

That reasoning applies even when a library supplies convenient action dispatch. A component allowlist narrows available behavior; it does not authorize an individual booking.

## What to put through a production trial

Try an unknown component, invalid properties, a deleted room and a disconnected stream. Change availability while the user is selecting. Repeat a reservation request after a timeout and confirm that a single booking is created. These are proposed acceptance checks, not results observed for the listed products.

Also inspect the real rendered output with keyboard and screen-reader navigation. Accessibility belongs partly to the underlying components and partly to composition: a perfectly accessible button can still sit under a misleading heading or lose focus after an update.

Keep provider credentials on the backend. Send the model only the room metadata it needs; internal meeting titles and attendee lists are a different data-sharing decision. Budget for schema instructions, generated output and retries, without assuming a smaller JSON document automatically lowers total cost.

Choose this architecture when you want flexible composition with application-owned presentation. If the missing capability is a specialized viewer maintained by an outside tool publisher, Part 3 examines why an embedded micro-app may be a better boundary.
