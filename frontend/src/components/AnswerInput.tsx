import { useState } from 'react';

interface Props {
  onSubmit: (answer: string) => void;
  disabled: boolean;
}

export function AnswerInput({ onSubmit, disabled }: Props) {
  const [answer, setAnswer] = useState('');

  const handleSubmit = () => {
    if (!answer.trim()) return;
    onSubmit(answer.trim());
  };

  return (
    <div className="answer-input">
      <label className="picker-label">Your Answer</label>
      <textarea
        className="answer-textarea"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Write your answer here..."
        rows={8}
        disabled={disabled}
      />
      <button
        className="btn btn--primary"
        onClick={handleSubmit}
        disabled={disabled || !answer.trim()}
      >
        Submit Answer
      </button>
    </div>
  );
}
