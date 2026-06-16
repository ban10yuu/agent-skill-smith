# Agent Skill Smith Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build and publish a small TypeScript CLI that generates and validates reusable AI-agent skill folders.

**Architecture:** A dependency-light Node CLI routes commands to pure generator and validator modules. Generated skills are deterministic Markdown folders, while validation returns structured diagnostics that the CLI formats for humans.

**Tech Stack:** TypeScript, Node.js built-in test runner, npm package scripts, GitHub CLI for public repo creation.

---

### Task 1: Project Scaffold

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `.gitignore`
- Create: `src/cli.ts`
- Create: `src/generator.ts`
- Create: `src/validator.ts`
- Create: `test/generator.test.ts`
- Create: `test/validator.test.ts`

**Step 1: Create package metadata**

Add npm scripts for `build`, `test`, and `check`. Use ESM output and expose `dist/cli.js` as the binary.

**Step 2: Create minimal source files**

Add exports with stubs so TypeScript can compile.

**Step 3: Run build**

Run: `npm run build`

Expected: TypeScript compiles without errors.

**Step 4: Commit**

Run: `git add . && git commit -m "chore: scaffold agent-skill-smith"`

### Task 2: Skill Generator

**Files:**
- Modify: `src/generator.ts`
- Modify: `test/generator.test.ts`

**Step 1: Write generator tests**

Cover slug normalization, default metadata, `SKILL.md` content, README content, and examples.

**Step 2: Implement generator**

Create deterministic functions:

- `normalizeSkillName(input: string): string`
- `createSkillFiles(options): GeneratedFile[]`
- `writeSkillFolder(options): Promise<WriteResult>`

**Step 3: Run tests**

Run: `npm test`

Expected: generator tests pass.

**Step 4: Commit**

Run: `git add src/generator.ts test/generator.test.ts && git commit -m "feat: generate agent skill folders"`

### Task 3: Skill Validator

**Files:**
- Modify: `src/validator.ts`
- Modify: `test/validator.test.ts`

**Step 1: Write validator tests**

Cover valid skill, missing file, invalid frontmatter, weak trigger section, and missing checklist.

**Step 2: Implement validator**

Read `SKILL.md`, parse simple YAML frontmatter, and report diagnostics without throwing for normal validation failures.

**Step 3: Run tests**

Run: `npm test`

Expected: all tests pass.

**Step 4: Commit**

Run: `git add src/validator.ts test/validator.test.ts && git commit -m "feat: validate agent skill folders"`

### Task 4: CLI Commands

**Files:**
- Modify: `src/cli.ts`
- Create: `test/cli.test.ts`

**Step 1: Write CLI smoke tests**

Use child processes against built output for `print`, `init`, and `check`.

**Step 2: Implement commands**

Commands:

- `agent-skill-smith init <name> [--dir <path>] [--force]`
- `agent-skill-smith check <path>`
- `agent-skill-smith print <name>`
- `agent-skill-smith --help`

**Step 3: Run build and tests**

Run: `npm run check`

Expected: TypeScript build and all tests pass.

**Step 4: Commit**

Run: `git add src/cli.ts test/cli.test.ts && git commit -m "feat: add cli commands"`

### Task 5: Public README and GitHub Publish

**Files:**
- Create: `README.md`
- Create: `LICENSE`

**Step 1: Write README**

Lead with the problem, demo, install commands, generated output tree, examples, and validation rules.

**Step 2: Add MIT license**

Add a standard MIT license with the configured git author name.

**Step 3: Final verification**

Run:

```bash
npm run check
node dist/cli.js print seo-auditor
node dist/cli.js init seo-auditor --dir /tmp/agent-skill-smith-demo --force
node dist/cli.js check /tmp/agent-skill-smith-demo/seo-auditor
```

Expected: all commands succeed.

**Step 4: Commit and publish**

Run:

```bash
git add .
git commit -m "docs: prepare public release"
git branch -M main
gh repo create ban10yuu/agent-skill-smith --public --source=. --remote=origin --push --description "Generate and validate portable AI-agent skill folders for Claude Code, Codex, OpenCode, Cursor, and Gemini CLI"
gh repo edit ban10yuu/agent-skill-smith --add-topic ai-agents --add-topic claude-code --add-topic codex --add-topic agent-skills --add-topic cli --add-topic typescript --add-topic model-context-protocol
```

Expected: public GitHub repo exists and reports zero or more stars.
