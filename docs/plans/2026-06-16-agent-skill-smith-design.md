# Agent Skill Smith Design

## Goal

Build a small public CLI that helps developers create, validate, and share agent skills for Claude Code, Codex, OpenCode, Cursor, Gemini CLI, and similar coding agents.

The project should be easy to understand in under 30 seconds, useful without an API key, and polished enough to deserve stars from developers exploring agent skill workflows.

## Audience

- Developers who want to create reusable `SKILL.md` workflows.
- AI-agent power users who keep repeating the same prompts and want a portable skill folder.
- OSS maintainers who want a quick template for documenting agent behavior.

## Recommended Approach

Create `agent-skill-smith`, a TypeScript CLI with three core commands:

- `init <name>` creates a complete skill folder with `SKILL.md`, `README.md`, and `examples/usage.md`.
- `check <path>` validates frontmatter, required sections, trigger wording, and example coverage.
- `print <name>` previews a generated `SKILL.md` to stdout.

This is small enough to ship quickly, but timely because GitHub trends show strong attention around AI agent skills, token-saving workflows, and Claude/Codex ecosystem tooling.

## Architecture

The CLI is intentionally dependency-light:

- `src/cli.ts` handles argument parsing and command routing.
- `src/generator.ts` turns options into deterministic Markdown files.
- `src/validator.ts` checks existing skill folders and returns structured diagnostics.
- `test/*.test.ts` uses Node's built-in test runner against temporary directories.

No network calls, no API keys, no telemetry.

## User Experience

The README should lead with a concrete demo:

```bash
npx agent-skill-smith init seo-auditor
npx agent-skill-smith check seo-auditor
```

The generated skill should look credible, not toy-like. It should include:

- Clear frontmatter.
- Trigger rules.
- Workflow steps.
- Quality checklist.
- Example prompts.

## Error Handling

- Missing command prints concise help and exits non-zero.
- Existing output folder is not overwritten unless `--force` is passed.
- Invalid skill names are normalized where safe and rejected where ambiguous.
- `check` reports all diagnostics in one pass so users can fix them together.

## Testing

Use Node's built-in test runner and TypeScript compilation:

- Generator tests verify expected files and frontmatter.
- Validator tests cover valid folders, missing `SKILL.md`, missing sections, and bad frontmatter.
- CLI smoke tests verify `init`, `check`, and `print`.

## Release Shape

Publish to GitHub first as `ban10yuu/agent-skill-smith`.

Set topics:

- `ai-agents`
- `claude-code`
- `codex`
- `agent-skills`
- `cli`
- `typescript`
- `model-context-protocol`

NPM publication can come later. The repo should still be npm-ready.
