import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { test } from "node:test";

const execFileAsync = promisify(execFile);
const cliPath = path.resolve("dist", "src", "cli.js");

test("print writes a complete SKILL.md to stdout", async () => {
  const { stdout } = await execFileAsync("node", [cliPath, "print", "seo-auditor"]);

  assert.match(stdout, /name: seo-auditor/);
  assert.match(stdout, /## Workflow/);
});

test("cli runs through a package-manager style symlink", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "agent-skill-smith-bin-"));
  try {
    const binPath = path.join(root, "agent-skill-smith");
    await symlink(cliPath, binPath);
    const { stdout } = await execFileAsync("node", [binPath, "--help"]);

    assert.match(stdout, /Generate and validate portable AI-agent skill folders/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("init and check work together", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "agent-skill-smith-cli-"));
  try {
    const init = await execFileAsync("node", [cliPath, "init", "seo-auditor", "--dir", root]);
    assert.match(init.stdout, /Created seo-auditor/);

    const check = await execFileAsync("node", [cliPath, "check", path.join(root, "seo-auditor")]);
    assert.match(check.stdout, /^OK /);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("check exits non-zero for invalid folders", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "agent-skill-smith-cli-"));
  try {
    await assert.rejects(
      execFileAsync("node", [cliPath, "check", root]),
      (error: unknown) => {
        assert(error instanceof Error);
        const childError = error as Error & { stdout?: string };
        assert.match(childError.stdout ?? "", /FAIL /);
        return true;
      },
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
