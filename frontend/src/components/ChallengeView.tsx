import Markdown from 'react-markdown';
import { CodeBlock } from './CodeBlock';
import { parseBody } from '../utils';
import type { Challenge } from '../types';

interface Props {
  challenge: Challenge;
}

export function ChallengeView({ challenge }: Props) {
  const parts = parseBody(challenge.body);

  return (
    <div className="challenge-view">
      <div className="challenge-header">
        <h2 className="challenge-title">{challenge.title}</h2>
        <span className="challenge-note">{challenge.difficulty_note}</span>
      </div>
      <div className="challenge-body">
        {parts.map((part, i) =>
          part.type === 'code' ? (
            <CodeBlock key={i} code={part.content.trimEnd()} lang={part.lang} />
          ) : (
            <div key={i} className="challenge-text"><Markdown>{part.content.trim()}</Markdown></div>
          )
        )}
      </div>
    </div>
  );
}
