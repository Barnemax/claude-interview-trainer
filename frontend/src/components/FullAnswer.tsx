import { useState } from 'react';
import Markdown from 'react-markdown';

interface Props {
  answer: string | null;
  onRequest: () => void;
  loading: boolean;
}

export function FullAnswer({ answer, onRequest, loading }: Props) {
  const [revealed, setRevealed] = useState(false);

  if (answer) {
    return (
      <div className="full-answer">
        <div className="full-answer-header">Full Answer</div>
        <div className="full-answer-text"><Markdown>{answer}</Markdown></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="full-answer-loading">
        <div className="spinner" />
        <span>Loading answer...</span>
      </div>
    );
  }

  if (!revealed) {
    return (
      <button className="btn btn--ghost" onClick={() => setRevealed(true)}>
        Show full answer
      </button>
    );
  }

  return (
    <button className="btn btn--ghost" onClick={onRequest}>
      Confirm — show full answer
    </button>
  );
}
