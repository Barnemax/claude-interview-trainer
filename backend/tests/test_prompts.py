from app.models.requests import ChallengeModel
from app.prompts import (
    build_challenge_prompt,
    build_eval_prompt,
    build_full_answer_prompt,
    build_hint_prompt,
    build_jd_analysis_prompt,
)


def make_challenge(**kwargs) -> ChallengeModel:
    defaults = {'title': 'T', 'type': 'concept', 'body': 'B', 'key_concepts': []}
    return ChallengeModel(**{**defaults, **kwargs})


class TestBuildChallengePrompt:
    def test_includes_topic_level_and_type(self):
        prompt = build_challenge_prompt("python", "senior", "fix_bug")
        assert "python" in prompt
        assert "senior" in prompt
        assert "fix_bug" in prompt

    def test_instructs_json_only_response(self):
        prompt = build_challenge_prompt("javascript", "junior", "output")
        assert "JSON" in prompt
        assert "no markdown fences" in prompt

    def test_includes_all_required_json_keys(self):
        prompt = build_challenge_prompt("go", "mid", "concept")
        for key in ("title", "type", "body", "key_concepts", "difficulty_note"):
            assert key in prompt

    def test_includes_job_context_when_provided(self):
        prompt = build_challenge_prompt("react", "senior", "concept", "senior-level fintech role. Tech stack: React, TypeScript.")
        assert "senior-level fintech role" in prompt
        assert "React, TypeScript" in prompt

    def test_no_job_context_block_when_none(self):
        prompt = build_challenge_prompt("python", "mid", "output", None)
        assert "Job context" not in prompt

    def test_no_job_context_block_when_omitted(self):
        prompt = build_challenge_prompt("python", "mid", "output")
        assert "Job context" not in prompt


class TestBuildEvalPrompt:
    def test_includes_challenge_title_and_body(self):
        challenge = make_challenge(title="Closure Test", body="What does this print?", key_concepts=["closure", "hoisting"])
        prompt = build_eval_prompt(challenge, "My answer here")
        assert "Closure Test" in prompt
        assert "What does this print?" in prompt

    def test_includes_user_answer(self):
        challenge = make_challenge()
        prompt = build_eval_prompt(challenge, "The answer is 42")
        assert "The answer is 42" in prompt

    def test_joins_key_concepts(self):
        challenge = make_challenge(key_concepts=["closure", "hoisting"])
        prompt = build_eval_prompt(challenge, "answer")
        assert "closure" in prompt
        assert "hoisting" in prompt

    def test_includes_verdict_options(self):
        challenge = make_challenge()
        prompt = build_eval_prompt(challenge, "answer")
        assert "strong|acceptable|needs_work|off_track" in prompt


class TestBuildHintPrompt:
    def test_includes_hint_level(self):
        challenge = make_challenge()
        for level in (1, 2, 3):
            prompt = build_hint_prompt(challenge, level, [])
            assert str(level) in prompt

    def test_includes_previous_hints_when_provided(self):
        challenge = make_challenge()
        prompt = build_hint_prompt(challenge, 2, ["Think about closures."])
        assert "Think about closures." in prompt

    def test_no_previous_hints_section_when_empty(self):
        challenge = make_challenge()
        prompt = build_hint_prompt(challenge, 1, [])
        assert "PREVIOUS HINTS" not in prompt


class TestBuildJdAnalysisPrompt:
    def test_includes_job_description_text(self):
        prompt = build_jd_analysis_prompt("We need a React developer with 5+ years experience.")
        assert "We need a React developer with 5+ years experience." in prompt

    def test_instructs_json_only_response(self):
        prompt = build_jd_analysis_prompt("Some JD text")
        assert "JSON" in prompt
        assert "no markdown fences" in prompt

    def test_includes_all_required_json_keys(self):
        prompt = build_jd_analysis_prompt("Some JD text")
        for key in ("tech_stack", "seniority", "domain", "key_themes", "interview_tips"):
            assert key in prompt

    def test_includes_seniority_options(self):
        prompt = build_jd_analysis_prompt("Some JD text")
        assert "junior|mid|senior" in prompt

    def test_instructs_concrete_technologies_only(self):
        prompt = build_jd_analysis_prompt("Some JD text")
        assert "concrete technologies" in prompt

    def test_instructs_specific_actionable_tips(self):
        prompt = build_jd_analysis_prompt("Some JD text")
        assert "specific and actionable" in prompt


class TestBuildFullAnswerPrompt:
    def test_includes_challenge_title_and_body(self):
        challenge = make_challenge(title="Closure", body="Explain this.", key_concepts=["closure"])
        prompt = build_full_answer_prompt(challenge)
        assert "Closure" in prompt
        assert "Explain this." in prompt

    def test_includes_key_concepts(self):
        challenge = make_challenge(key_concepts=["closure", "event loop"])
        prompt = build_full_answer_prompt(challenge)
        assert "closure" in prompt
        assert "event loop" in prompt
