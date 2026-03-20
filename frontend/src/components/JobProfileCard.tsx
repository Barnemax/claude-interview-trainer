import type { JobProfile } from '../types';

interface Props {
  profile: JobProfile;
  onClear: () => void;
}

const SENIORITY_LABEL: Record<string, string> = {
  junior: 'Junior',
  mid: 'Mid-level',
  senior: 'Senior',
};

export function JobProfileCard({ profile, onClear }: Props) {
  return (
    <div className="jd-profile">
      <div className="jd-profile-header">
        <div className="jd-profile-meta">
          <span className="jd-seniority">{SENIORITY_LABEL[profile.seniority] ?? profile.seniority}</span>
          {profile.domain && <span className="jd-domain">{profile.domain}</span>}
        </div>
        <button className="stat-clear" onClick={onClear} title="Clear job description">✕</button>
      </div>

      {profile.tech_stack.length > 0 && (
        <div className="jd-section">
          <div className="jd-section-label">Tech Stack</div>
          <div className="chip-group">
            {profile.tech_stack.map((tech) => (
              <span key={tech} className="jd-tech-pill">{tech}</span>
            ))}
          </div>
        </div>
      )}

      {profile.key_themes.length > 0 && (
        <div className="jd-section">
          <div className="jd-section-label">Key Themes</div>
          <div className="chip-group">
            {profile.key_themes.map((theme) => (
              <span key={theme} className="jd-theme-pill">{theme}</span>
            ))}
          </div>
        </div>
      )}

      {profile.interview_tips.length > 0 && (
        <div className="jd-section">
          <div className="jd-section-label">What to expect</div>
          <ul className="jd-tips">
            {profile.interview_tips.map((tip, i) => (
              <li key={i} className="jd-tip">{tip}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
