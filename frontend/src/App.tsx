import { useState } from 'react';
import { useChallenge } from './hooks/useChallenge';
import { SessionStats } from './components/SessionStats';
import { TopicPicker } from './components/TopicPicker';
import { LevelPicker } from './components/LevelPicker';
import { ChallengeTypePicker } from './components/ChallengeTypePicker';
import { ChallengeView } from './components/ChallengeView';
import { AnswerInput } from './components/AnswerInput';
import { HintPanel } from './components/HintPanel';
import { FullAnswer } from './components/FullAnswer';
import { EvaluationResult } from './components/EvaluationResult';

export default function App() {
  const [topic, setTopic] = useState('javascript');
  const [customTopic, setCustomTopic] = useState('');
  const [level, setLevel] = useState('junior');
  const [challengeType, setChallengeType] = useState('output');

  const {
    phase, challenge, evaluation, hints, hintLevel, fullAnswer, fullAnswerLoading, hintLoading, error, stats,
    generate, evaluate, requestHint, requestFullAnswer, reset, clearStats,
  } = useChallenge();

  const handleGenerate = () => generate(customTopic.trim() || topic, level, challengeType);

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Interview Trainer</h1>
        <SessionStats stats={stats} onClear={clearStats} />
      </header>

      <main className="app-main">
        {error && <div className="error-banner">{error}</div>}

        {phase === 'setup' && (
          <div className="setup-panel">
            <TopicPicker value={topic} onChange={setTopic} customTopic={customTopic} onCustomChange={setCustomTopic} />
            <LevelPicker value={level} onChange={setLevel} />
            <ChallengeTypePicker value={challengeType} onChange={setChallengeType} />
            <button className="btn btn--primary btn--generate" onClick={handleGenerate}>
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
            <AnswerInput onSubmit={evaluate} disabled={phase === 'evaluating'} />
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
