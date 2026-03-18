export interface BodyPart {
  type: 'text' | 'code';
  content: string;
  lang?: string;
}

export function parseBody(body: string): BodyPart[] {
  const parts: BodyPart[] = [];
  const regex = /```([\w+#-]*)\n?([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(body)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', content: body.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'code', lang: match[1] || 'text', content: match[2] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < body.length) {
    parts.push({ type: 'text', content: body.slice(lastIndex) });
  }

  return parts;
}

export function isCovered(concept: string, coveredConcepts: string[]): boolean {
  return coveredConcepts.some(
    (cc) =>
      cc.toLowerCase().includes(concept.toLowerCase()) ||
      concept.toLowerCase().includes(cc.toLowerCase())
  );
}
