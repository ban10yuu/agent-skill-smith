import { access, readFile } from "node:fs/promises";
import path from "node:path";

export type DiagnosticLevel = "error" | "warning";

export interface Diagnostic {
  level: DiagnosticLevel;
  code: string;
  message: string;
}

export interface ValidationResult {
  ok: boolean;
  skillPath: string;
  diagnostics: Diagnostic[];
}

const REQUIRED_SECTIONS = [
  "## When To Use",
  "## Trigger Phrases",
  "## Workflow",
  "## Quality Checklist",
  "## Example Prompts",
];

export async function validateSkillFolder(inputPath: string): Promise<ValidationResult> {
  const skillPath = path.join(path.resolve(inputPath), "SKILL.md");
  const diagnostics: Diagnostic[] = [];

  try {
    await access(skillPath);
  } catch {
    return {
      ok: false,
      skillPath,
      diagnostics: [
        {
          level: "error",
          code: "missing-skill",
          message: "SKILL.md was not found.",
        },
      ],
    };
  }

  const markdown = await readFile(skillPath, "utf8");
  const frontmatter = parseFrontmatter(markdown);

  if (!frontmatter) {
    diagnostics.push({
      level: "error",
      code: "missing-frontmatter",
      message: "SKILL.md must start with YAML frontmatter.",
    });
  } else {
    if (!frontmatter.name) {
      diagnostics.push({
        level: "error",
        code: "missing-name",
        message: "Frontmatter must include a name.",
      });
    }
    if (!frontmatter.description || frontmatter.description.length < 40) {
      diagnostics.push({
        level: "warning",
        code: "weak-description",
        message: "Frontmatter description should clearly explain when to use the skill.",
      });
    }
  }

  for (const section of REQUIRED_SECTIONS) {
    if (!markdown.includes(section)) {
      diagnostics.push({
        level: "error",
        code: "missing-section",
        message: `Missing required section: ${section}`,
      });
    }
  }

  if (!/trigger phrases/i.test(markdown) && !/when to use/i.test(markdown)) {
    diagnostics.push({
      level: "warning",
      code: "unclear-triggers",
      message: "Skill should include explicit trigger guidance.",
    });
  }

  if (!/verify|validate|test|check/i.test(markdown)) {
    diagnostics.push({
      level: "warning",
      code: "missing-verification",
      message: "Skill should include a verification step.",
    });
  }

  return {
    ok: diagnostics.every((diagnostic) => diagnostic.level !== "error"),
    skillPath,
    diagnostics,
  };
}

export function formatDiagnostics(result: ValidationResult): string {
  if (result.diagnostics.length === 0) {
    return `OK ${result.skillPath}`;
  }

  const lines = [result.ok ? `WARN ${result.skillPath}` : `FAIL ${result.skillPath}`];
  for (const diagnostic of result.diagnostics) {
    lines.push(`${diagnostic.level.toUpperCase()} ${diagnostic.code}: ${diagnostic.message}`);
  }
  return lines.join("\n");
}

function parseFrontmatter(markdown: string): Record<string, string> | null {
  if (!markdown.startsWith("---\n")) {
    return null;
  }

  const end = markdown.indexOf("\n---", 4);
  if (end === -1) {
    return null;
  }

  const raw = markdown.slice(4, end).trim();
  const values: Record<string, string> = {};
  for (const line of raw.split("\n")) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) {
      continue;
    }
    const key = match[1];
    const value = match[2].trim().replace(/^"|"$/g, "");
    values[key] = value;
  }
  return values;
}
