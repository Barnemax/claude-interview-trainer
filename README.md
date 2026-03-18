# Interview Trainer

Training for technical interview based on Claude

## Requirements

- Node.js and pnpm
- Python
- Anthropic API key

## Setup

```bash
# Install frontend deps
cd frontend && pnpm install

# Install backend deps
cd backend
python -m venv .venv
.venv/Scripts/pip install -r requirements.txt -r requirements-dev.txt
```

Create `backend/.env.local`:
```
ANTHROPIC_API_KEY=sk-ant-...
```

## Run

```bash
pnpm dev  # starts both frontend (localhost:5173) and backend (localhost:8000)
```
