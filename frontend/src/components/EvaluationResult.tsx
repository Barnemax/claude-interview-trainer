import Markdown from 'react-markdown';
import { VerdictBadge } from './VerdictBadge';
import { ConceptPill } from './ConceptPill';
import { isCovered } from '../utils';
import type { Challenge, Evaluation } from '../types';

interface Props {
  challenge: Challenge;
  evaluation: Evaluation;
  onNext: () => void;
}

export function EvaluationResult({ challenge, evaluation, onNext }: Props) {
  return (
    <div className="eval-result">
      <div className="eval-score-row">
        <div className="eval-score">
          <span className="eval-percent">{evaluation.coverage_percent}%</span>
          <div className="eval-bar">
            <div
              className="eval-bar-fill"
              style={{ width: `${evaluation.coverage_percent}%` }}
            />
          </div>
        </div>
        <VerdictBadge verdict={evaluation.verdict} />
      </div>

      <div className="eval-concepts">
        <div className="eval-section-label">Concept Coverage</div>
        <div className="concept-pills">
          {challenge.key_concepts.map((concept) => (
            <ConceptPill
              key={concept}
              concept={concept}
              covered={isCovered(concept, evaluation.covered_concepts)}
            />
          ))}
        </div>
      </div>

      {evaluation.strengths && (
        <div className="eval-strengths">
          <div className="eval-section-label">Strengths</div>
          <Markdown>{evaluation.strengths}</Markdown>
        </div>
      )}

      <div className="eval-feedback">
        <div className="eval-section-label">Feedback</div>
        <Markdown>{evaluation.feedback}</Markdown>
      </div>

      <button className="btn btn--primary" onClick={onNext}>
        Next Challenge
      </button>
    </div>
  );
}
