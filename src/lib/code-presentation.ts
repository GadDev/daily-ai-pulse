import { pluginFramesTexts, type AstroExpressiveCodeOptions } from 'astro-expressive-code';
import { h, select } from 'astro-expressive-code/hast';

pluginFramesTexts.addLocale('fr', {
  terminalWindowFallbackTitle: 'Terminal',
  copyButtonTooltip: 'Copier dans le presse-papiers',
  copyButtonCopied: 'Copié !',
});

export const codePresentation: AstroExpressiveCodeOptions = {
  themes: ['github-light-high-contrast'],
  // Do not rewrite tabs or strip Markdown headings inside shell heredocs.
  tabWidth: 0,
  frames: {
    extractFileNameFromCode: false,
    removeCommentsWhenCopyingTerminalFrames: false,
  },
  getBlockLocale: ({ file }) =>
    /\/(?:story-translations\/)?fr\//.test(file.url?.pathname ?? file.path) ? 'fr' : 'en',
  styleOverrides: {
    borderColor: '#d9cfc0',
    borderRadius: '0.25rem',
    codeBackground: '#f8f3ea',
    codeFontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
    codeFontSize: '0.9375rem',
    codeLineHeight: '1.6',
    focusBorder: '#8a4b35',
    frames: {
      frameBoxShadowCssValue: 'none',
      editorBackground: '#f8f3ea',
      editorTabBarBackground: '#eee4d5',
      editorTabBarBorderBottomColor: '#d9cfc0',
      editorActiveTabBackground: '#eee4d5',
      editorActiveTabForeground: '#171715',
      editorActiveTabIndicatorTopColor: 'transparent',
      terminalTitlebarBackground: '#eee4d5',
      terminalBackground: '#f8f3ea',
      terminalTitlebarForeground: '#171715',
      terminalTitlebarBorderBottomColor: '#d9cfc0',
      terminalTitlebarDotsOpacity: '0',
    },
  },
  plugins: [
    {
      name: 'Pulse code labels',
      hooks: {
        preprocessCode: ({ codeBlock }) => {
          codeBlock.props.title ??= codeBlock.language || 'Code';
        },
        postprocessRenderedBlock: ({ codeBlock, renderData, locale }) => {
          const title = codeBlock.props.title;
          const pre = select('pre', renderData.blockAst);
          if (pre) {
            pre.properties.ariaLabel = title;
            pre.properties.tabIndex = 0;
          }
          const button = select('.copy button', renderData.blockAst);
          if (button) {
            const copy = locale === 'fr' ? 'Copier' : 'Copy';
            button.properties.ariaLabel = `${copy} — ${title}`;
            button.children.push(h('span', { className: 'pulse-copy-label' }, copy));
          }
        },
      },
    },
  ],
};
