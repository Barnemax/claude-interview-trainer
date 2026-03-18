from fastapi import APIRouter

from app.models.requests import ChallengeRequest, EvalRequest, FullAnswerRequest, HintRequest
from app.prompts import (
    build_challenge_prompt,
    build_eval_prompt,
    build_full_answer_prompt,
    build_hint_prompt,
)
from app.services.claude_client import call_claude

router = APIRouter()


@router.post("/challenge")
async def generate_challenge(req: ChallengeRequest):
    prompt = build_challenge_prompt(req.topic, req.level, req.challenge_type)
    return call_claude(prompt)


@router.post("/evaluate")
async def evaluate_answer(req: EvalRequest):
    prompt = build_eval_prompt(req.challenge, req.answer)
    return call_claude(prompt)


@router.post("/hint")
async def get_hint(req: HintRequest):
    prompt = build_hint_prompt(req.challenge, req.hint_level, req.previous_hints)
    return call_claude(prompt)


@router.post("/answer")
async def get_full_answer(req: FullAnswerRequest):
    prompt = build_full_answer_prompt(req.challenge)
    return call_claude(prompt)
