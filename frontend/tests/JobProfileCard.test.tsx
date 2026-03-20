import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { JobProfileCard } from '../src/components/JobProfileCard';
import type { JobProfile } from '../src/types';

const baseProfile: JobProfile = {
  tech_stack: ['React', 'TypeScript', 'PostgreSQL'],
  seniority: 'senior',
  domain: 'fintech',
  key_themes: ['real-time data', 'API design'],
  interview_tips: ['Expect questions about state management', 'Likely system design round'],
};

describe('JobProfileCard', () => {
  it('renders seniority label', () => {
    render(<JobProfileCard profile={baseProfile} onClear={vi.fn()} />);
    expect(screen.getByText('Senior')).toBeInTheDocument();
  });

  it('renders domain', () => {
    render(<JobProfileCard profile={baseProfile} onClear={vi.fn()} />);
    expect(screen.getByText('fintech')).toBeInTheDocument();
  });

  it('renders all tech stack items', () => {
    render(<JobProfileCard profile={baseProfile} onClear={vi.fn()} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('PostgreSQL')).toBeInTheDocument();
  });

  it('renders all key themes', () => {
    render(<JobProfileCard profile={baseProfile} onClear={vi.fn()} />);
    expect(screen.getByText('real-time data')).toBeInTheDocument();
    expect(screen.getByText('API design')).toBeInTheDocument();
  });

  it('renders all interview tips', () => {
    render(<JobProfileCard profile={baseProfile} onClear={vi.fn()} />);
    expect(screen.getByText('Expect questions about state management')).toBeInTheDocument();
    expect(screen.getByText('Likely system design round')).toBeInTheDocument();
  });

  it('calls onClear when clear button is clicked', async () => {
    const onClear = vi.fn();
    render(<JobProfileCard profile={baseProfile} onClear={onClear} />);
    await userEvent.click(screen.getByTitle('Clear job description'));
    expect(onClear).toHaveBeenCalledOnce();
  });

  it('omits tech stack section when array is empty', () => {
    const profile = { ...baseProfile, tech_stack: [] };
    render(<JobProfileCard profile={profile} onClear={vi.fn()} />);
    expect(screen.queryByText('Tech Stack')).not.toBeInTheDocument();
  });

  it('omits interview tips section when array is empty', () => {
    const profile = { ...baseProfile, interview_tips: [] };
    render(<JobProfileCard profile={profile} onClear={vi.fn()} />);
    expect(screen.queryByText('What to expect')).not.toBeInTheDocument();
  });

  it('maps mid seniority to Mid-level label', () => {
    const profile = { ...baseProfile, seniority: 'mid' as const };
    render(<JobProfileCard profile={profile} onClear={vi.fn()} />);
    expect(screen.getByText('Mid-level')).toBeInTheDocument();
  });
});
