import { h } from 'astro-expressive-code/hast';
import type { HastPluginEntry, PluginFactoryContext } from 'satteri';

/** Add static, keyboard-accessible table containers to guides at build time. */
export function guideTables({ fileURL }: PluginFactoryContext): HastPluginEntry {
  if (!fileURL?.pathname.includes('/src/content/guides/')) return;

  let heading = 'Comparison';
  let tableIndex = 0;

  return {
    name: 'pulse-guide-tables',
    element: {
      filter: ['h2', 'h3', 'table', 'th'],
      visit(node, ctx) {
        if (node.tagName === 'h2' || node.tagName === 'h3') {
          heading = ctx.textContent(node);
          return;
        }
        if (node.tagName === 'th') {
          // Preserve explicit author-supplied scope and Markdown alignment.
          const row = ctx.parent(node);
          const group = row && ctx.parent(row);
          if (group?.type === 'element' && group.tagName === 'thead' && !node.properties.scope) {
            ctx.setProperty(node, 'scope', 'col');
          }
          return;
        }

        const head = node.children.find(
          (child) => child.type === 'element' && child.tagName === 'thead',
        );
        const row =
          head?.type === 'element'
            ? head.children.find((child) => child.type === 'element' && child.tagName === 'tr')
            : undefined;
        const columns =
          row?.type === 'element'
            ? row.children.filter((child) => child.type === 'element').length
            : 1;
        const helpId = `guide-table-help-${++tableIndex}`;

        const classes = node.properties.className ?? [];
        ctx.setProperty(node, 'className', [
          ...(Array.isArray(classes) ? classes : [classes]),
          'guide-table',
        ]);
        ctx.setProperty(
          node,
          'style',
          `${node.properties.style ? `${node.properties.style}; ` : ''}--table-min-width: ${columns * 14}rem`,
        );
        if (!node.properties.ariaLabel && !node.properties.ariaLabelledBy) {
          ctx.setProperty(node, 'ariaLabel', heading);
        }
        ctx.insertBefore(
          node,
          h('p', { className: 'guide-table-help', id: helpId }, [
            `${columns} columns. Scroll horizontally if needed. Keyboard: focus the table, then use ← and →.`,
          ]),
        );
        ctx.wrapNode(
          node,
          h('div', {
            className: 'guide-table-scroll',
            role: 'region',
            tabIndex: 0,
            ariaLabel: `${heading} — table`,
            ariaDescribedBy: helpId,
          }),
        );
      },
    },
  };
}
