import { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-sql';

interface Props {
  code: string;
  lang?: string;
}

const LANG_MAP: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  py: 'python',
  go: 'go',
  rs: 'rust',
  java: 'java',
  cs: 'csharp',
  cpp: 'cpp',
  sql: 'sql',
};

export function CodeBlock({ code, lang = 'text' }: Props) {
  const ref = useRef<HTMLElement>(null);
  const resolvedLang = LANG_MAP[lang] ?? lang;

  useEffect(() => {
    if (ref.current) Prism.highlightElement(ref.current);
  }, [code, resolvedLang]);

  return (
    <pre className="code-block">
      <code ref={ref} className={`language-${resolvedLang}`}>
        {code}
      </code>
    </pre>
  );
}
