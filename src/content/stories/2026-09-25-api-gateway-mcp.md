---
title: "Google Cloud API Gateway can expose existing REST APIs as MCP tools"
description: "Teams can annotate an OpenAPI spec and let API Gateway act as a remote MCP server without standing up a separate agent-facing service."
date: 2026-09-25
category: tools
tags: [mcp, api-gateway, openapi, google-cloud]
type: briefing
difficulty: intermediate
signal: high
evidence: primary
featured: false
companies: [Google]
image: "/images/stories/2026-09-25-api-gateway-mcp.webp"
imageAlt: "REST API endpoints passing through a gateway and becoming MCP tools"
sources:
  - label: "Google Developers — Turn your REST APIs into MCP tools with API Gateway"
    url: "https://developers.googleblog.com/en/turn-your-rest-apis-into-mcp-tools-with-google-cloud-api-gateway/"
---

Google Cloud API Gateway can now act as a remote MCP server. Existing REST operations become agent-callable tools by annotating the OpenAPI definition instead of recreating routing, authentication, and quota logic in a new MCP service.

## Why it matters

MCP adoption gets much easier when **existing API governance becomes the agent boundary**. Enterprises can expose capabilities without duplicating infrastructure and security policy.
