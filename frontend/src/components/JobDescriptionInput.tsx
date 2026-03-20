interface Props {
  value: string;
  onChange: (val: string) => void;
  onAnalyze: () => void;
  loading: boolean;
}

export function JobDescriptionInput({ value, onChange, onAnalyze, loading }: Props) {
  return (
    <div className="jd-input">
      <label className="picker-label">Job Description</label>
      <textarea
        className="jd-textarea"
        placeholder="Paste the job description here…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={10}
        disabled={loading}
      />
      <button
        className="btn btn--primary"
        onClick={onAnalyze}
        disabled={loading || value.trim().length < 50}
      >
        {loading ? 'Analyzing…' : 'Analyze Job Description'}
      </button>
    </div>
  );
}
