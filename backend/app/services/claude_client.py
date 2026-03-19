import json
import re

import anthropic
from fastapi import HTTPException

from app.config import settings
from app.prompts import SYSTEM_PROMPT

client = anthropic.Anthropic(api_key=settings.anthropic_api_key)


def _extract_json(text: str) -> str:
    """Strip markdown fences and trailing commas from a JSON string."""
    # Remove ```json ... ``` or ``` ... ``` wrappers
    text = re.sub(r'^```(?:json)?\s*', '', text.strip())
    text = re.sub(r'\s*```$', '', text).strip()
    # Remove trailing commas before } or ] (LLMs sometimes emit these)
    text = re.sub(r',\s*([}\]])', r'\1', text)
    return text


def call_claude_text(user_message: str, max_tokens: int = 2048) -> str:
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=max_tokens,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_message}],
        timeout=60,
    )
    return "".join(block.text for block in response.content if block.type == "text").strip()


def call_claude(user_message: str, max_tokens: int = 1024) -> dict:
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=max_tokens,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_message}],
        timeout=30,
    )
    text = "".join(block.text for block in response.content if block.type == "text")
    clean = _extract_json(text)
    try:
        return json.loads(clean)
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=502, detail=f"Claude returned invalid JSON: {e}") from e
