import assert from "node:assert/strict";
import { mkdir, mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { writeSkillFolder } from "../src/generator.js";
import { formatDiagnostics, validateSkillFolder } from "../src/validator.js";

test("validateSkillFolder accepts a generated skill", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "agent-skill-smith-"));
  try {
    const result = await writeSkillFolder({ name: "seo-auditor", dir: root });
    const validation = await validateSkillFolder(result.root);

    assert.equal(validation.ok, true);
    assert.deepEqual(validation.diagnostics, []);
    assert.match(formatDiagnostics(validation), /^OK /);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("validateSkillFolder reports a missing SKILL.md", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "agent-skill-smith-"));
  try {
    const validation = await validateSkillFolder(root);

    assert.equal(validation.ok, false);
    assert.equal(validation.diagnostics[0].code, "missing-skill");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("validateSkillFolder reports missing required sections", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "agent-skill-smith-"));
  try {
    const skillRoot = path.join(root, "weak-skill");
    await mkdir(skillRoot);
    await writeFile(
      path.join(skillRoot, "SKILL.md"),
      `---
name: weak-skill
description: "short"
---

# Weak Skill
`,
    );

    const validation = await validateSkillFolder(skillRoot);

    assert.equal(validation.ok, false);
    assert(validation.diagnostics.some((diagnostic) => diagnostic.code === "missing-section"));
    assert(validation.diagnostics.some((diagnostic) => diagnostic.code === "weak-description"));
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
