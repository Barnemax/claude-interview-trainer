import { useState } from 'react';
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
  onSubmit: (answer: string) => void;
  disabled: boolean;
  challengeType: string;
  topic: string;
}

function getLanguage(topic: string): Extension[] {
  switch (topic) {
    case 'javascript': return [javascript()];
    case 'typescript': return [javascript({ typescript: true })];
    case 'python': return [python()];
    case 'go': return [go()];
    case 'java': return [java()];
    case 'csharp': return [java()];
    case 'cpp': return [cpp()];
    case 'php':
    case 'laravel':
    case 'symfony':
    case 'wordpress': return [php()];
    case 'sql': return [sql()];
    case 'rust': return [rust()];
    default: return [];
  }
}

const editorTheme = EditorView.theme({
  '&': { background: '#1a1d27', color: '#e2e8f0' },
  '.cm-content': { padding: '0.75rem 1rem', minHeight: '200px', fontFamily: '"JetBrains Mono","Fira Code",Consolas,monospace', fontSize: '0.875rem' },
  '.cm-focused': { outline: 'none' },
  '.cm-gutters': { background: '#252836', borderRight: '1px solid #2e3145', color: '#8892a4', paddingRight: '0.5rem' },
  '.cm-activeLine': { background: '#1e2133' },
  '.cm-activeLineGutter': { background: '#1e2133' },
  '.cm-cursor': { borderLeftColor: '#6366f1' },
  '.cm-selectionBackground, ::selection': { background: '#2e3145 !important' },
  '&.cm-focused .cm-selectionBackground': { background: '#1e1f3a !important' },
  '.cm-lineNumbers .cm-gutterElement': { minWidth: '2.5rem', textAlign: 'right' },
});

export function AnswerInput({ onSubmit, disabled, challengeType, topic }: Props) {
  const [code, setCode] = useState('');
  const [text, setText] = useState('');

  const isCodeChallenge = challengeType === 'fix_bug';

  const handleSubmit = () => {
    if (isCodeChallenge) {
      const combined = [code.trim() && `\`\`\`\n${code.trim()}\n\`\`\``, text.trim()].filter(Boolean).join('\n\n');
      if (!combined) return;
      onSubmit(combined);
    } else {
      if (!text.trim()) return;
      onSubmit(text.trim());
    }
  };

  const canSubmit = isCodeChallenge ? !!(code.trim() || text.trim()) : !!text.trim();

  return (
    <div className="answer-input">
      <label className="picker-label">Your Answer</label>
      {isCodeChallenge && (
        <div className="answer-editor">
          <CodeMirror
            value={code}
            onChange={setCode}
            extensions={[...getLanguage(topic), editorTheme]}
            theme="dark"
            editable={!disabled}
            basicSetup={{ lineNumbers: true, foldGutter: false, highlightActiveLine: true }}
            placeholder="Your fixed code..."
          />
        </div>
      )}
      <textarea
        className="answer-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={isCodeChallenge ? 'Explain your fix...' : 'Write your answer here...'}
        rows={isCodeChallenge ? 4 : 8}
        disabled={disabled}
      />
      <button
        className="btn btn--primary"
        onClick={handleSubmit}
        disabled={disabled || !canSubmit}
      >
        Submit Answer
      </button>
    </div>
  );
}
