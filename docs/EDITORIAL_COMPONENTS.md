# Editorial MDX components

Pulse uses explicit MDX components when a passage carries editorial meaning beyond ordinary prose.

This avoids overloading Markdown syntax. In particular, a Markdown blockquote (`>`) is always treated as a quotation and is never automatically labeled as Pulse opinion.

## Available components

### `PulseTake`

Use for clearly separated editorial interpretation or opinion.

```mdx
<PulseTake>
The benchmark headline is less important than the runtime architecture behind it.
</PulseTake>
```

### `Evidence`

Use for a compact evidence note, qualification, or verification detail.

```mdx
<Evidence>
The performance number is vendor-reported and has not yet been independently reproduced.
</Evidence>
```

### `TryThis`

Use for a concrete engineering experiment or action readers can take.

```mdx
<TryThis>
Measure P95 agent completion time with and without prefix-cache affinity before changing serving architecture.
</TryThis>
```

### `EditorialQuote`

Use when a quotation needs an explicit citation label inside the article body.

```mdx
<EditorialQuote cite="Research paper">
Verification should steer the reasoning loop, not merely score it afterward.
</EditorialQuote>
```

For ordinary quotations, standard Markdown remains correct:

```md
> This is a normal quoted passage and is not a Pulse Take.
```

## Authoring rules

- Use `.mdx` when a story needs any of these components.
- Keep factual claims and editorial interpretation distinct.
- Do not use `PulseTake` as decoration; reserve it for interpretation.
- `Evidence` supplements, but does not replace, frontmatter evidence level and source metadata.
- `TryThis` should describe a bounded, practical experiment rather than a generic recommendation.
- Use `EditorialQuote` only for quotations whose source is clear from the surrounding story or the `cite` label.

The story renderer provides these components automatically, so individual MDX stories do not need to import them.
