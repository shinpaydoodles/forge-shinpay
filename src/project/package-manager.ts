import fs from "node:fs/promises";
import path from "node:path";

export type PackageManager =
  | "npm"
  | "pnpm"
  | "yarn"
  | "bun";

export function isPackageManager(value: unknown): value is PackageManager {
  return value === "npm" || value === "pnpm" || value === "yarn" || value === "bun";
}

export function getDependencyInstallCommand(
  packageManager: PackageManager,
  dependencies: string[]
): { command: PackageManager; args: string[] } {
  return {
    command: packageManager,
    args: [packageManager === "npm" ? "install" : "add", ...dependencies],
  };
}

export function getProjectInstallCommand(
  packageManager: PackageManager
): { command: PackageManager; args: string[] } {
  return { command: packageManager, args: ["install"] };
}

async function pathExists(
  targetPath: string
) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

export async function detectPackageManager(
  projectRoot: string
): Promise<PackageManager> {
  try {
    const contents = await fs.readFile(path.join(projectRoot, ".forge.json"), "utf8");
    const state: unknown = JSON.parse(contents);
    if (state && typeof state === "object" && "packageManager" in state &&
        isPackageManager(state.packageManager)) {
      return state.packageManager;
    }
  } catch {
    // Existing projects may not have Forge state yet.
  }

  const lockfiles: Array<{
    file: string;
    manager: PackageManager;
  }> = [
    {
      file: "pnpm-lock.yaml",
      manager: "pnpm",
    },
    {
      file: "yarn.lock",
      manager: "yarn",
    },
    {
      file: "bun.lock",
      manager: "bun",
    },
    {
      file: "bun.lockb",
      manager: "bun",
    },
    {
      file: "package-lock.json",
      manager: "npm",
    },
  ];

  for (const lockfile of lockfiles) {
    const lockfilePath = path.join(
      projectRoot,
      lockfile.file
    );

    if (await pathExists(lockfilePath)) {
      return lockfile.manager;
    }
  }

  return "npm";
}
