import { useState } from 'react';
import { useChallenge } from './hooks/useChallenge';
import { analyzeJobDescription } from './api/claude';
import { SessionStats } from './components/SessionStats';
import { TopicPicker } from './components/TopicPicker';
import { LevelPicker } from './components/LevelPicker';
import { ChallengeTypePicker } from './components/ChallengeTypePicker';
import { ChallengeView } from './components/ChallengeView';
import { AnswerInput } from './components/AnswerInput';
import { HintPanel } from './components/HintPanel';
import { FullAnswer } from './components/FullAnswer';
import { EvaluationResult } from './components/EvaluationResult';
import { JobDescriptionInput } from './components/JobDescriptionInput';
import { JobProfileCard } from './components/JobProfileCard';
import type { JobProfile } from './types';

type Mode = 'standard' | 'job';

export default function App() {
  const [mode, setMode] = useState<Mode>('standard');
  const [topic, setTopic] = useState('javascript');
  const [customTopic, setCustomTopic] = useState('');
  const [level, setLevel] = useState('junior');
  const [challengeType, setChallengeType] = useState('output');

  const [jdText, setJdText] = useState('');
  const [jdLoading, setJdLoading] = useState(false);
  const [jdError, setJdError] = useState<string | null>(null);
  const [jobProfile, setJobProfile] = useState<JobProfile | null>(null);

  const {
    phase, challenge, evaluation, hints, hintLevel, fullAnswer, fullAnswerLoading, hintLoading, error, stats,
    generate, evaluate, requestHint, requestFullAnswer, reset, clearStats,
  } = useChallenge();

  const buildJobContext = (profile: JobProfile): string => {
    const parts = [
      `${profile.seniority}-level ${profile.domain} role`,
      profile.tech_stack.length ? `Tech stack: ${profile.tech_stack.join(', ')}` : null,
      profile.key_themes.length ? `Key themes: ${profile.key_themes.join(', ')}` : null,
    ].filter(Boolean);
    return parts.join('. ') + '.';
  };

  const handleAnalyze = async () => {
    setJdLoading(true);
    setJdError(null);
    try {
      const profile = await analyzeJobDescription(jdText);
      setJobProfile(profile);
      setLevel(profile.seniority);
      if (profile.tech_stack.length > 0) {
        setCustomTopic(profile.tech_stack[0]);
        setTopic('');
      }
    } catch (e) {
      setJdError((e as Error).message);
    } finally {
      setJdLoading(false);
    }
  };

  const handleGenerate = () => {
    const resolvedTopic = customTopic.trim() || topic;
    const jobContext = mode === 'job' && jobProfile ? buildJobContext(jobProfile) : undefined;
    generate(resolvedTopic, level, challengeType, jobContext);
  };

  const handleClearProfile = () => {
    setJobProfile(null);
    setJdText('');
  };

  const handleModeSwitch = (newMode: Mode) => {
    setMode(newMode);
    if (newMode === 'standard') {
      handleClearProfile();
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Interview Trainer</h1>
        <SessionStats stats={stats} onClear={clearStats} />
      </header>

      <main className="app-main">
        {(error || jdError) && <div className="error-banner">{error ?? jdError}</div>}

        {phase === 'setup' && (
          <div className="setup-panel">
            <div className="mode-toggle">
              <button
                className={`mode-btn ${mode === 'standard' ? 'mode-btn--active' : ''}`}
                onClick={() => handleModeSwitch('standard')}
              >
                Standard
              </button>
              <button
                className={`mode-btn ${mode === 'job' ? 'mode-btn--active' : ''}`}
                onClick={() => handleModeSwitch('job')}
              >
                From Job Description
              </button>
            </div>

            {mode === 'job' && (
              jobProfile ? (
                <JobProfileCard profile={jobProfile} onClear={handleClearProfile} />
              ) : (
                <JobDescriptionInput
                  value={jdText}
                  onChange={setJdText}
                  onAnalyze={handleAnalyze}
                  loading={jdLoading}
                />
              )
            )}

            <TopicPicker value={topic} onChange={setTopic} customTopic={customTopic} onCustomChange={setCustomTopic} />
            <LevelPicker value={level} onChange={setLevel} />
            <ChallengeTypePicker value={challengeType} onChange={setChallengeType} />
            <button
              className="btn btn--primary btn--generate"
              onClick={handleGenerate}
              disabled={mode === 'job' && !jobProfile}
            >
              Generate Challenge
            </button>
          </div>
        )}

        {phase === 'loading' && (
          <div className="spinner-wrap">
            <div className="spinner" />
            <p>Generating challenge...</p>
          </div>
        )}

        {(phase === 'challenge' || phase === 'evaluating') && challenge && (
          <div className="challenge-panel">
            <ChallengeView challenge={challenge} />
            <AnswerInput onSubmit={evaluate} disabled={phase === 'evaluating'} challengeType={challenge.type} topic={customTopic.trim() || topic} />
            {phase === 'evaluating' && (
              <div className="spinner-wrap">
                <div className="spinner" />
                <p>Evaluating...</p>
              </div>
            )}
            <div className="challenge-actions">
              <HintPanel
                hints={hints}
                hintLevel={hintLevel}
                onRequestHint={requestHint}
                loading={hintLoading}
              />
              <FullAnswer
                answer={fullAnswer}
                onRequest={requestFullAnswer}
                loading={fullAnswerLoading}
              />
            </div>
          </div>
        )}

        {phase === 'results' && challenge && evaluation && (
          <div className="results-panel">
            <ChallengeView challenge={challenge} />
            <EvaluationResult
              challenge={challenge}
              evaluation={evaluation}
              onNext={reset}
            />
            <FullAnswer answer={fullAnswer} onRequest={requestFullAnswer} loading={fullAnswerLoading} />
          </div>
        )}
      </main>
    </div>
  );
}
