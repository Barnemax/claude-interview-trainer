import json

import anthropic
from fastapi import HTTPException

from app.config import settings
from app.prompts import SYSTEM_PROMPT

client = anthropic.Anthropic(api_key=settings.anthropic_api_key)


def call_claude(user_message: str) -> dict:
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user_message}],
        timeout=30,
    )
    text = "".join(block.text for block in response.content if block.type == "text")
    clean = text.strip().removeprefix("```json").removesuffix("```").strip()
    try:
        return json.loads(clean)
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=502, detail=f"Claude returned invalid JSON: {e}") from e
