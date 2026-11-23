// Wrapper for the accuracy check. onnxruntime-node on Intel macOS can abort
// during native teardown even after the report has printed. Treat the printed
// result as the source of truth, and pass real failures through.

import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const inner = resolve(here, "check-assistant.mjs");
const child = spawn(process.execPath, [inner], { stdio: ["ignore", "pipe", "pipe"] });

let output = "";
child.stdout.on("data", (chunk) => {
  output += chunk;
  process.stdout.write(chunk);
});
child.stderr.on("data", (chunk) => {
  const lines = String(chunk)
    .split("\n")
    .filter((line) => !line.includes("libc++abi") && !line.includes("mutex lock failed"))
    .join("\n")
    .trim();
  if (lines) process.stderr.write(`${lines}\n`);
});

child.on("close", (code, signal) => {
  if (output.includes("Accuracy target met.")) process.exit(0);
  if (code && code !== 0) process.exit(code);
  if (signal) {
    console.error(`Accuracy check terminated by ${signal}.`);
    process.exit(1);
  }
  process.exit(0);
});
