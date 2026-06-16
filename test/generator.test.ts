import assert from "node:assert/strict";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { createSkillFiles, normalizeSkillName, writeSkillFolder } from "../src/generator.js";

test("normalizeSkillName creates a portable slug", () => {
  assert.equal(normalizeSkillName(" SEO Auditor!! "), "seo-auditor");
  assert.equal(normalizeSkillName("Codex_Skill Smith"), "codex-skill-smith");
});

test("createSkillFiles returns the expected skill files", () => {
  const files = createSkillFiles({ name: "seo-auditor" });
  assert.deepEqual(
    files.map((file) => file.path),
    ["SKILL.md", "README.md", path.join("examples", "usage.md")],
  );
  assert.match(files[0].content, /name: seo-auditor/);
  assert.match(files[0].content, /## Trigger Phrases/);
  assert.match(files[0].content, /## Quality Checklist/);
});

test("writeSkillFolder writes a complete skill folder", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "agent-skill-smith-"));
  try {
    const result = await writeSkillFolder({ name: "seo-auditor", dir: root });
    const skill = await readFile(path.join(result.root, "SKILL.md"), "utf8");
    const example = await readFile(path.join(result.root, "examples", "usage.md"), "utf8");

    assert.equal(result.files.length, 3);
    assert.match(skill, /# SEO Auditor/);
    assert.match(example, /Expected Agent Behavior/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
