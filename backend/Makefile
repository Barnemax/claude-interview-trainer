.PHONY: lint lint-fix dev

lint:
	.venv/Scripts/ruff check .

lint-fix:
	.venv/Scripts/ruff check --fix . && .venv/Scripts/ruff format .

dev:
	.venv/Scripts/uvicorn app.main:app --reload
