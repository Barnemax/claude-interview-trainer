import type { Stats } from '../types';

interface Props {
  stats: Stats;
  onClear: () => void;
}

export function SessionStats({ stats, onClear }: Props) {
  if (stats.total === 0) return <span className="session-stats session-stats--empty">No challenges yet</span>;

  return (
    <div className="session-stats">
      <span className="stat-total">{stats.total} done</span>
      {stats.strong > 0 && <span className="stat stat--strong">{stats.strong} strong</span>}
      {stats.acceptable > 0 && <span className="stat stat--acceptable">{stats.acceptable} ok</span>}
      {stats.needs_work > 0 && <span className="stat stat--needs-work">{stats.needs_work} weak</span>}
      {stats.off_track > 0 && <span className="stat stat--off-track">{stats.off_track} off</span>}
      <button className="stat-clear" onClick={onClear} title="Reset stats">×</button>
    </div>
  );
}
