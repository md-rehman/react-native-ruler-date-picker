import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';

/**
 * Patch Prism's JSX / TSX grammar to support deeply nested braces (up to 10 levels).
 * By default, Prism's JSX tag pattern only permits 3 levels of nested braces ({ ... })
 * inside attribute expressions (e.g. ticks={[ { condition: { dayOfMonth: 1 } } ]}),
 * which caused complex JSX snippets to fail tag matching and lose syntax highlighting.
 */
function patchPrismJsxBraces() {
  if (!Prism.languages.jsx || !Prism.languages.jsx.tag) return;

  let s = '[^{}]*';
  for (let i = 0; i < 10; i++) {
    s = '(?:[^{}]|\\{' + s + '\\})*';
  }
  const deepBraces = '\\{' + s + '\\}';
  const threeLevel = '(?:\\\\{(?:\\\\{(?:\\\\{[^{}]*\\\\}|[^{}])*\\\\}|[^{}])*\\\\})';

  const origTag = Prism.languages.jsx.tag.pattern?.source;
  if (origTag && origTag.includes(threeLevel)) {
    const newTag = origTag.split(threeLevel).join(deepBraces);
    Prism.languages.jsx.tag.pattern = new RegExp(newTag);
    if (Prism.languages.tsx?.tag) {
      Prism.languages.tsx.tag.pattern = new RegExp(newTag);
    }
  }

  if (Prism.languages.jsx.tag.inside?.script) {
    Prism.languages.jsx.tag.inside.script.pattern = new RegExp('=' + deepBraces);
  }
  if (Prism.languages.tsx?.tag?.inside?.script) {
    Prism.languages.tsx.tag.inside.script.pattern = new RegExp('=' + deepBraces);
  }

  // Ensure property keys in object literals (e.g. { condition: ..., height: ... }) are recognized and highlighted
  const propRule = {
    pattern: /(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/,
    alias: 'property',
  };

  try {
    Prism.languages.insertBefore('javascript', 'operator', { property: propRule });
    Prism.languages.insertBefore('typescript', 'operator', { property: propRule });
    Prism.languages.insertBefore('jsx', 'operator', { property: propRule });
    Prism.languages.insertBefore('tsx', 'operator', { property: propRule });
  } catch {
    // Already defined or safely ignored
  }
}

patchPrismJsxBraces();

export function highlightCode(code: string, language: string = 'tsx'): string {
  if (!code) return '';
  const langKey = language.toLowerCase().trim();
  let grammar = Prism.languages[langKey];

  if (!grammar) {
    if (['bash', 'sh', 'shell', 'zsh', 'terminal'].includes(langKey)) {
      grammar = Prism.languages.bash;
    } else if (['ts', 'typescript'].includes(langKey)) {
      grammar = Prism.languages.typescript;
    } else if (['js', 'javascript'].includes(langKey)) {
      grammar = Prism.languages.javascript;
    } else if (langKey === 'jsx') {
      grammar = Prism.languages.jsx;
    } else if (langKey === 'json') {
      grammar = Prism.languages.json;
    } else {
      grammar = Prism.languages.tsx || Prism.languages.jsx || Prism.languages.javascript;
    }
  }

  if (!grammar) {
    return code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  try {
    return Prism.highlight(code, grammar, langKey);
  } catch {
    return code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }
}
