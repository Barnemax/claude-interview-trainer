from app.models.requests import ChallengeModel

SYSTEM_PROMPT = """You are a technical interview trainer. You generate challenges and evaluate answers.

RULES:
- Be precise and technical
- When evaluating, be honest and critical — don't inflate scores
- For code challenges, use realistic interview-style code
- Adjust difficulty to the specified level
- Keep challenges focused — one concept per question"""


def build_challenge_prompt(topic: str, level: str, challenge_type: str) -> str:
    return f"""Generate a {level}-level technical interview challenge about {topic}.
Challenge type: {challenge_type}

Respond ONLY in this JSON format, no markdown fences:
{{
  "title": "Short title",
  "type": "{challenge_type}",
  "body": "The challenge. For code, include code blocks with backticks.",
  "key_concepts": ["concept1", "concept2", "concept3", "concept4", "concept5"],
  "difficulty_note": "What makes this {level}-level"
}}"""


def build_eval_prompt(challenge: 'ChallengeModel', answer: str) -> str:
    key_concepts = ", ".join(challenge.key_concepts)
    return f"""Evaluate this interview answer.

CHALLENGE:
{challenge.title}
{challenge.body}

KEY CONCEPTS TO COVER: {key_concepts}

CANDIDATE'S ANSWER:
{answer}

Respond ONLY in this JSON format, no markdown fences:
{{
  "covered_concepts": ["concepts addressed well"],
  "missing_concepts": ["concepts not addressed or poorly addressed"],
  "coverage_percent": <0-100>,
  "feedback": "2-3 sentences. Be direct.",
  "strengths": "1 sentence on what was good",
  "verdict": "strong|acceptable|needs_work|off_track"
}}"""


def build_hint_prompt(challenge: 'ChallengeModel', hint_level: int, previous_hints: list[str]) -> str:
    prev = ""
    if previous_hints:
        prev = "\nPREVIOUS HINTS:\n" + "\n".join(f"- {h}" for h in previous_hints)

    return f"""The candidate needs a level {hint_level} hint.

CHALLENGE:
{challenge.title}
{challenge.body}
{prev}

Level 1: Conceptual — point toward the right area. One sentence.
Level 2: Specific — name the mechanism or concept. Two sentences max.
Level 3: Near-answer — almost give it away. Three sentences max.

Respond ONLY in JSON: {{ "hint": "..." }}"""


def build_full_answer_prompt(challenge: 'ChallengeModel') -> str:
    key_concepts = ", ".join(challenge.key_concepts)
    return f"""Give the complete ideal answer.

CHALLENGE:
{challenge.title}
{challenge.body}

KEY CONCEPTS: {key_concepts}

Respond ONLY in JSON: {{ "answer": "Full structured answer covering all key concepts." }}"""
