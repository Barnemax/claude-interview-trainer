import { LEVELS } from '../config/levels';

interface Props {
  value: string;
  onChange: (id: string) => void;
}

export function LevelPicker({ value, onChange }: Props) {
  return (
    <div className="picker">
      <label className="picker-label">Level</label>
      <div className="chip-group">
        {LEVELS.map((l) => (
          <button
            key={l.id}
            className={`chip chip--level ${value === l.id ? 'chip--active' : ''}`}
            onClick={() => onChange(l.id)}
            title={l.desc}
          >
            {l.label}
          </button>
        ))}
      </div>
    </div>
  );
}
