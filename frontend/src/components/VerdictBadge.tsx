import type { Verdict } from '../types';

interface Props {
  verdict: Verdict;
}

const VERDICT_CONFIG: Record<Verdict, { label: string; className: string }> = {
  strong:     { label: 'Strong',     className: 'verdict--strong' },
  acceptable: { label: 'Acceptable', className: 'verdict--acceptable' },
  needs_work: { label: 'Needs Work', className: 'verdict--needs-work' },
  off_track:  { label: 'Off Track',  className: 'verdict--off-track' },
};

export function VerdictBadge({ verdict }: Props) {
  const config = VERDICT_CONFIG[verdict];
  return <span className={`verdict-badge ${config.className}`}>{config.label}</span>;
}
