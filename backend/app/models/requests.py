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
    job_context: str | None = None


class JobDescriptionRequest(BaseModel):
    text: str


class JobProfile(BaseModel):
    tech_stack: list[str]
    seniority: str
    domain: str
    key_themes: list[str]
    interview_tips: list[str]


class EvalRequest(BaseModel):
    challenge: ChallengeModel
    answer: str


class HintRequest(BaseModel):
    challenge: ChallengeModel
    hint_level: Annotated[int, Field(ge=1, le=3)]
    previous_hints: list[str] = []


class FullAnswerRequest(BaseModel):
    challenge: ChallengeModel
