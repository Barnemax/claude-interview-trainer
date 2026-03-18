import { CHALLENGE_TYPES } from '../config/levels';

interface Props {
  value: string;
  onChange: (id: string) => void;
}

export function ChallengeTypePicker({ value, onChange }: Props) {
  return (
    <div className="picker">
      <label className="picker-label">Challenge Type</label>
      <div className="chip-group">
        {CHALLENGE_TYPES.map((ct) => (
          <button
            key={ct.id}
            className={`chip ${value === ct.id ? 'chip--active' : ''}`}
            onClick={() => onChange(ct.id)}
          >
            {ct.label}
          </button>
        ))}
      </div>
    </div>
  );
}
