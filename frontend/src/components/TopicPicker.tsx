import { TOPICS } from '../config/topics';

interface Props {
  value: string;
  onChange: (id: string) => void;
  customTopic: string;
  onCustomChange: (val: string) => void;
}

export function TopicPicker({ value, onChange, customTopic, onCustomChange }: Props) {
  return (
    <div className="picker">
      <label className="picker-label">Topic</label>
      <div className="chip-group">
        {TOPICS.map((t) => (
          <button
            key={t.id}
            className={`chip ${value === t.id && !customTopic ? 'chip--active' : ''}`}
            onClick={() => { onChange(t.id); onCustomChange(''); }}
          >
            <span className="chip-icon">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>
      <input
        className={`custom-topic-input ${customTopic ? 'custom-topic-input--active' : ''}`}
        type="text"
        placeholder="Or type your own topic… (e.g. React hooks, OAuth2, Kubernetes)"
        value={customTopic}
        onChange={(e) => onCustomChange(e.target.value)}
      />
    </div>
  );
}
