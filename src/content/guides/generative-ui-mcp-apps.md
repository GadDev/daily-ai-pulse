---
title: 'Generative UI, Part 3: The Tool Brings Its Own Interface'
description: 'Trace MCP Apps from tool metadata and ui:// resources to sandboxed rendering, JSON-RPC messages and server-side authorization.'
status: draft
format: review
verification: researched
difficulty: intermediate
author: The Daily AI Pulse
verifiedAt: 2026-11-23
series:
  id: generative-ui-architectures
  title: Generative UI Architectures
  part: 3
image: /images/guides/generative-ui-mcp-apps.webp
imageAlt: 'A miniature terracotta architectural pavilion sits within a larger pale stone enclosure, connected through one narrow opening.'
relatedGuides: []
sources:
  - label: MCP — Apps overview
    url: https://modelcontextprotocol.io/extensions/apps/overview
  - label: MCP Apps — Stable 2026-01-26 specification
    url: https://github.com/modelcontextprotocol/ext-apps/blob/main/specification/2026-01-26/apps.mdx
  - label: MCP — SEP-1865 proposal
    url: https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/seps/1865-mcp-apps-interactive-user-interfaces-for-mcp.mdx
  - label: MCP-UI — Current SDK and legacy support
    url: https://mcpui.dev/
  - label: MCP Apps — SDK overview
    url: https://apps.extensions.modelcontextprotocol.io/api/documents/overview.html
---

The room service has a floor-plan viewer. It knows how to highlight accessible entrances, connect adjacent rooms and show where the projector actually points. Your chat host has none of those components.

You could ask the host team to build and maintain another viewer. Or the room service could deliver its own small application inside the conversation. That is the architectural bargain behind **MCP Apps**: a tool supplies an interactive resource, and a compatible host decides how to embed and mediate it.

**Genre and verification:** researched protocol explainer, reviewed on 23 November 2026. The reference is the stable MCP Apps specification dated 26 January 2026, with current overview and SDK documentation. Examples are constructed, abbreviated protocol fragments; initialization, capability negotiation and error paths are intentionally outside the fragments. We have not run this app in a production host or tested sandbox enforcement.

## MCP support and MCP Apps support are different capabilities

Core MCP connects clients to tools and resources. The UI extension adds a contract for interactive applications. A host can support ordinary tool calls and still have no way to render the associated UI.

[SEP-1865](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/seps/1865-mcp-apps-interactive-user-interfaces-for-mcp.mdx) documents the proposal's lineage. For implementation, use the [versioned extension specification](https://github.com/modelcontextprotocol/ext-apps/blob/main/specification/2026-01-26/apps.mdx) and your target host's supported capabilities, rather than treating an old proposal or legacy MCP-UI example as the current contract.

The [MCP-UI project](https://mcpui.dev/) now describes its packages as implementations of MCP Apps and provides legacy support separately. This is an ecosystem relationship, not a reason to interchange every historical message shape.

## The first payload points to a resource

Here is a hypothetical entry in a `tools/list` response. Its input schema is empty because this teaching tool simply opens the room picker:

```json
{
  "name": "show_rooms",
  "description": "Show available meeting rooms",
  "inputSchema": {
    "type": "object",
    "properties": {},
    "additionalProperties": false
  },
  "_meta": {
    "ui": {
      "resourceUri": "ui://rooms/picker.html"
    }
  }
}
```

`ui://` identifies a resource served through MCP. It is not a public website URL for the browser to navigate to. The host uses MCP resource retrieval; the app's page and its data are distinct objects.

A matching `resources/read` result can contain HTML with the extension's MIME type:

```json
{
  "contents": [
    {
      "uri": "ui://rooms/picker.html",
      "mimeType": "text/html;profile=mcp-app",
      "text": "<!doctype html><html lang='en'><meta charset='utf-8'><title>Rooms</title><body><p>Loading room availability…</p></body></html>"
    }
  ]
}
```

This tiny resource illustrates delivery only. It has no bridge code or working picker. A real app must implement the lifecycle and handlers, normally through an SDK, and provide an accessible loading and failure experience.

The [official overview](https://modelcontextprotocol.io/extensions/apps/overview) describes HTML that can bundle JavaScript and CSS. Allowed external assets are also possible under host-enforced CSP declarations. Therefore “a completely self-contained bundle” is a useful packaging option, not a universal protocol requirement.

## Two communication boundaries

There is a server-to-host MCP connection and a separate embedded-app-to-host bridge. Confusing them makes network traces hard to read.

After the app's handshake and tool-input delivery, the host can forward a tool result with a notification such as this:

```json
{
  "jsonrpc": "2.0",
  "method": "ui/notifications/tool-result",
  "params": {
    "content": [{ "type": "text", "text": "Two rooms are available." }],
    "structuredContent": {
      "rooms": [
        { "id": "room-a", "name": "Atrium", "capacity": 6 },
        { "id": "room-b", "name": "Library", "capacity": 8 }
      ]
    }
  }
}
```

The values are invented. The method and envelope follow the extension specification. Unlike a request, a JSON-RPC notification has no `id`. In a browser, this bridge uses `postMessage`; it is not another HTTP response from the room service.

The app can request a tool call through the host. Local floor-plan panning needs neither the model nor the server. Refreshing availability may call a read tool. Reserving a room invokes a state-changing operation. Those interactions should have different permissions and feedback even though they start inside the same iframe.

## An iframe is one layer of the boundary

The sandbox separates the embedded page from the host page. CSP restricts resource and connection origins. The host mediates supported bridge capabilities. The backend authenticates and authorizes the actual reservation. These are complementary controls.

For our proposed room service, allow only required asset origins, validate messages through the SDK, and restrict exposed tools by identity and purpose. Use the host's supported bridge for external links. Keep service credentials out of the HTML. A sandboxed app that is handed sensitive meeting data can still misuse that data through an allowed channel; isolation does not make every disclosure appropriate.

Booking should use a confirmation flow with the final room and interval visible. On submission, the server checks conflicts again and uses an idempotency key. The tool's response determines whether the reservation succeeded. A green card rendered before that result would be an attractive lie.

These are architectural recommendations, not security findings about the named SDKs.

## Design the fallback before the impressive demo

A text-only host should still receive useful availability and identifiers. A failed resource fetch should leave a readable explanation and a safe way to continue. Unsupported UI should not erase the tool result.

Test loading, cancellation, reload, host refusal of a capability and a resource revision while a conversation remains open. Include the viewer's asset hosting, browser behavior and bridge versions in your compatibility matrix. Measure time to usable interaction, not just time to download the HTML.

The strongest reason to use this architecture is ownership: the publisher can maintain a specialized interface alongside its domain tools. The cost is a second application lifecycle inside the host. If your own component library already expresses the task well, the catalog approach in Part 2 may be simpler. If the model must assemble novel interactions from those components, Part 4 examines the language runtime that makes that possible.
