interface Props {
  concept: string;
  covered: boolean;
}

export function ConceptPill({ concept, covered }: Props) {
  return (
    <span className={`concept-pill ${covered ? 'concept-pill--covered' : 'concept-pill--missing'}`}>
      {concept}
    </span>
  );
}
