import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { JobDescriptionInput } from '../src/components/JobDescriptionInput';

describe('JobDescriptionInput', () => {
  it('renders textarea and analyze button', () => {
    render(<JobDescriptionInput value="" onChange={vi.fn()} onAnalyze={vi.fn()} loading={false} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /analyze job description/i })).toBeInTheDocument();
  });

  it('disables analyze button when text is too short', () => {
    render(<JobDescriptionInput value="too short" onChange={vi.fn()} onAnalyze={vi.fn()} loading={false} />);
    expect(screen.getByRole('button', { name: /analyze/i })).toBeDisabled();
  });

  it('enables analyze button when text is 50+ chars', () => {
    const longText = 'a'.repeat(50);
    render(<JobDescriptionInput value={longText} onChange={vi.fn()} onAnalyze={vi.fn()} loading={false} />);
    expect(screen.getByRole('button', { name: /analyze/i })).not.toBeDisabled();
  });

  it('calls onChange when typing in the textarea', async () => {
    const onChange = vi.fn();
    render(<JobDescriptionInput value="" onChange={onChange} onAnalyze={vi.fn()} loading={false} />);
    await userEvent.type(screen.getByRole('textbox'), 'hello');
    expect(onChange).toHaveBeenCalled();
  });

  it('calls onAnalyze when button is clicked', async () => {
    const onAnalyze = vi.fn();
    const longText = 'a'.repeat(50);
    render(<JobDescriptionInput value={longText} onChange={vi.fn()} onAnalyze={onAnalyze} loading={false} />);
    await userEvent.click(screen.getByRole('button', { name: /analyze/i }));
    expect(onAnalyze).toHaveBeenCalledOnce();
  });

  it('shows loading text and disables inputs when loading', () => {
    const longText = 'a'.repeat(50);
    render(<JobDescriptionInput value={longText} onChange={vi.fn()} onAnalyze={vi.fn()} loading={true} />);
    expect(screen.getByRole('button', { name: /analyzing/i })).toBeDisabled();
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});
