import CodeMirror from '@uiw/react-codemirror';
import { EditorView } from '@codemirror/view';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { go } from '@codemirror/lang-go';
import { java } from '@codemirror/lang-java';
import { sql } from '@codemirror/lang-sql';
import { rust } from '@codemirror/lang-rust';
import { cpp } from '@codemirror/lang-cpp';
import { php } from '@codemirror/lang-php';
import type { Extension } from '@codemirror/state';

interface Props {
  code: string;
  lang?: string;
}

const ALIASES: Record<string, string> = {
  js: 'javascript', ts: 'typescript', py: 'python', rs: 'rust', cs: 'csharp',
};

function getLanguage(lang: string): Extension[] {
  const resolved = ALIASES[lang] ?? lang;
  switch (resolved) {
    case 'javascript': return [javascript()];
    case 'typescript': return [javascript({ typescript: true })];
    case 'python': return [python()];
    case 'go': return [go()];
    case 'java': return [java()];
    case 'csharp': return [java()];
    case 'cpp': return [cpp()];
    case 'php': return [php()];
    case 'sql': return [sql()];
    case 'rust': return [rust()];
    default: return [];
  }
}

const displayTheme = EditorView.theme({
  '&': { background: '#0a0c12', color: '#e2e8f0' },
  '.cm-content': { padding: '1rem 1.25rem', fontFamily: '"JetBrains Mono","Fira Code",Consolas,monospace', fontSize: '0.85rem', lineHeight: '1.6' },
  '.cm-gutters': { background: '#0a0c12', borderRight: '1px solid #2e3145', color: '#8892a4', paddingRight: '0.5rem' },
  '.cm-activeLine': { background: 'transparent' },
  '.cm-cursor': { display: 'none' },
  '.cm-selectionBackground, ::selection': { background: '#2e3145 !important' },
});

export function CodeBlock({ code, lang = 'text' }: Props) {
  return (
    <div className="code-block code-block--cm">
      <CodeMirror
        value={code.trimEnd()}
        extensions={[...getLanguage(lang), displayTheme, EditorView.lineWrapping]}
        theme="dark"
        editable={false}
        basicSetup={{ lineNumbers: true, foldGutter: false, highlightActiveLine: false, highlightActiveLineGutter: false }}
      />
    </div>
  );
}
