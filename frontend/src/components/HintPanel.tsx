interface Props {
  hints: string[];
  hintLevel: number;
  onRequestHint: () => void;
  loading: boolean;
}

export function HintPanel({ hints, hintLevel, onRequestHint, loading }: Props) {
  return (
    <div className="hint-panel">
      {hints.map((hint, i) => (
        <div key={i} className="hint">
          <span className="hint-label">Hint {i + 1}</span>
          <p>{hint}</p>
        </div>
      ))}
      {hintLevel < 3 && (
        <button
          className="btn btn--secondary"
          onClick={onRequestHint}
          disabled={loading}
        >
          {hintLevel === 0 ? 'Get a hint' : `Hint ${hintLevel + 1} of 3`}
        </button>
      )}
      {hintLevel >= 3 && <p className="hint-exhausted">No more hints available.</p>}
    </div>
  );
}
