from typing import Annotated

from pydantic import BaseModel, Field


class ChallengeModel(BaseModel):
    title: str
    type: str
    body: str
    key_concepts: list[str]
    difficulty_note: str = ''


class ChallengeRequest(BaseModel):
    topic: str
    level: str
    challenge_type: str


class EvalRequest(BaseModel):
    challenge: ChallengeModel
    answer: str


class HintRequest(BaseModel):
    challenge: ChallengeModel
    hint_level: Annotated[int, Field(ge=1, le=3)]
    previous_hints: list[str] = []


class FullAnswerRequest(BaseModel):
    challenge: ChallengeModel
