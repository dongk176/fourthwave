import fs from "fs";
import path from "path";
import { spawn } from "child_process";

const cwd = process.cwd();

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, "utf8");
  const result = {};

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eqIndex = line.indexOf("=");
    if (eqIndex <= 0) continue;

    const key = line.slice(0, eqIndex).trim();
    let value = line.slice(eqIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    result[key] = value;
  }

  return result;
}

const envFromDotEnv = parseEnvFile(path.join(cwd, ".env"));
const envFromDotEnvLocal = parseEnvFile(path.join(cwd, ".env.local"));
const mergedEnv = {
  ...process.env,
  ...envFromDotEnv,
  ...envFromDotEnvLocal,
};

if (!mergedEnv.DATABASE_URL) {
  console.error(
    "[db] DATABASE_URL is missing. Add it to .env.local (recommended) or .env.",
  );
  process.exit(1);
}

const prismaArgs = process.argv.slice(2);
if (prismaArgs.length === 0) {
  console.error("[db] Missing prisma arguments.");
  process.exit(1);
}

const command = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
const child = spawn(command, ["exec", "prisma", ...prismaArgs], {
  cwd,
  env: mergedEnv,
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 1);
});
