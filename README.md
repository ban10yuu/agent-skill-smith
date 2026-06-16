# agent-skill-smith

Generate and validate portable AI-agent skill folders for Claude Code, Codex, OpenCode, Cursor, Gemini CLI, and similar coding agents.

If you keep repeating the same long prompt, turn it into a reusable `SKILL.md` folder.

```bash
npx agent-skill-smith init seo-auditor
npx agent-skill-smith check seo-auditor
```

No API key. No telemetry. No framework.

## Why this exists

Agent skills are becoming the easiest way to package repeatable AI workflows:

- how to review a codebase
- how to write a launch plan
- how to audit SEO
- how to run a project-specific verification loop
- how to keep an agent from skipping important steps

The hard part is not writing Markdown. The hard part is remembering the shape that makes a skill useful: triggers, workflow, examples, and verification.

`agent-skill-smith` gives you that shape in one command.

## Install

Use it directly:

```bash
npx agent-skill-smith --help
```

Before the npm package is published, run it from GitHub:

```bash
npx github:ban10yuu/agent-skill-smith --help
```

Or install globally:

```bash
npm install -g agent-skill-smith
```

## Quick demo

```bash
agent-skill-smith init launch-reviewer
```

Creates:

```text
launch-reviewer/
  SKILL.md
  README.md
  examples/
    usage.md
```

Preview a skill without writing files:

```bash
agent-skill-smith print launch-reviewer
```

Validate a skill folder:

```bash
agent-skill-smith check launch-reviewer
```

Expected output:

```text
OK /path/to/launch-reviewer/SKILL.md
```

## Commands

### `init`

Create a new skill folder.

```bash
agent-skill-smith init seo-auditor
agent-skill-smith init seo-auditor --dir ./skills
agent-skill-smith init seo-auditor --dir ./skills --force
```

`--force` overwrites generated files.

### `check`

Validate an existing skill folder.

```bash
agent-skill-smith check ./skills/seo-auditor
```

It checks:

- YAML frontmatter starts the file.
- `name` is present.
- `description` explains when to use the skill.
- Required sections exist.
- The skill includes trigger guidance.
- The skill includes a verification step.

### `print`

Print the generated `SKILL.md` to stdout.

```bash
agent-skill-smith print seo-auditor
```

Useful when you want to pipe or inspect the template first.

## Generated SKILL.md shape

```markdown
---
name: seo-auditor
description: "Use when a user needs a repeatable SEO Auditor workflow for AI coding agents."
---

# SEO Auditor

## When To Use

## Trigger Phrases

## Workflow

## Quality Checklist

## Example Prompts
```

## Who should use it

- You build with Claude Code, Codex, Cursor, OpenCode, Gemini CLI, or other coding agents.
- You want reusable workflows instead of one-off prompts.
- You maintain an agent-ready repo and want skill folders that look consistent.

## Development

```bash
npm install
npm run check
```

Run a local smoke test:

```bash
npm run build
node dist/src/cli.js init seo-auditor --dir /tmp/agent-skill-smith-demo --force
node dist/src/cli.js check /tmp/agent-skill-smith-demo/seo-auditor
```

## Roadmap

- `pack` command for sharing a skill folder.
- `doctor` command for stronger wording suggestions.
- Presets for common skills: code review, SEO audit, design review, launch checklist.
- Compatibility notes for more agent surfaces.

## License

MIT
