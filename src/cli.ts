#!/usr/bin/env node
import { realpathSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { createSkillFiles, normalizeSkillName, writeSkillFolder } from "./generator.js";
import { formatDiagnostics, validateSkillFolder } from "./validator.js";

const HELP = `agent-skill-smith

Generate and validate portable AI-agent skill folders.

Usage:
  agent-skill-smith init <name> [--dir <path>] [--force]
  agent-skill-smith check <path>
  agent-skill-smith print <name>
  agent-skill-smith --help
`;

interface ParsedFlags {
  dir?: string;
  force: boolean;
}

export async function main(argv = process.argv.slice(2)): Promise<number> {
  const [command, ...rest] = argv;

  try {
    if (!command || command === "--help" || command === "-h") {
      console.log(HELP);
      return command ? 0 : 1;
    }

    if (command === "print") {
      const name = rest[0];
      if (!name) {
        throw new Error("Missing skill name.");
      }
      const files = createSkillFiles({ name });
      console.log(files.find((file) => file.path === "SKILL.md")?.content.trimEnd());
      return 0;
    }

    if (command === "init") {
      const name = rest[0];
      if (!name) {
        throw new Error("Missing skill name.");
      }
      const flags = parseFlags(rest.slice(1));
      const result = await writeSkillFolder({
        name,
        dir: flags.dir,
        force: flags.force,
      });
      console.log(`Created ${normalizeSkillName(name)} at ${result.root}`);
      for (const file of result.files) {
        console.log(`- ${file}`);
      }
      return 0;
    }

    if (command === "check") {
      const target = rest[0];
      if (!target) {
        throw new Error("Missing skill folder path.");
      }
      const result = await validateSkillFolder(target);
      console.log(formatDiagnostics(result));
      return result.ok ? 0 : 1;
    }

    throw new Error(`Unknown command: ${command}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`agent-skill-smith: ${message}`);
    console.error("Run agent-skill-smith --help for usage.");
    return 1;
  }
}

function parseFlags(args: string[]): ParsedFlags {
  const flags: ParsedFlags = { force: false };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--force") {
      flags.force = true;
      continue;
    }
    if (arg === "--dir") {
      const value = args[index + 1];
      if (!value) {
        throw new Error("--dir requires a path.");
      }
      flags.dir = value;
      index += 1;
      continue;
    }
    throw new Error(`Unknown option: ${arg}`);
  }

  return flags;
}

if (isDirectRun()) {
  const exitCode = await main();
  process.exit(exitCode);
}

function isDirectRun(): boolean {
  if (!process.argv[1]) {
    return false;
  }

  try {
    return realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url));
  } catch {
    return false;
  }
}
