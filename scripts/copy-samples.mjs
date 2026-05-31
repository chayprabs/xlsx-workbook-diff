import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "samples");
const dest = join(root, "apps/web/public/samples");

if (!existsSync(join(src, "invoice_before.xlsx"))) {
  spawnSync("python3", [join(src, "generate_samples.py")], { stdio: "inherit", cwd: root });
}

mkdirSync(dest, { recursive: true });
for (const name of readdirSync(src)) {
  if (name.endsWith(".xlsx")) {
    copyFileSync(join(src, name), join(dest, name));
  }
}
