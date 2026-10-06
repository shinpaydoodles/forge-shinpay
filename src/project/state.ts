import fs from "node:fs/promises";
import path from "node:path";
import { isPackageManager, type PackageManager } from "./package-manager.js";

export interface ForgeProjectState {
  version: number;
  installed: string[];
  packageManager?: PackageManager;
}

const DEFAULT_STATE: ForgeProjectState = {
  version: 1,
  installed: [],
};

function invalidState(statePath: string, reason: string): Error {
  return new Error(
    `Invalid Forge state at ${statePath}: ${reason}. Fix the file or move it aside to start with fresh state.`
  );
}

function normalizeProjectState(
  value: unknown,
  statePath: string
): ForgeProjectState {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw invalidState(statePath, "expected a JSON object");
  }

  const state = value as Record<string, unknown>;
  const version = state.version === undefined
    ? DEFAULT_STATE.version
    : state.version;
  const installed = state.installed === undefined
    ? []
    : state.installed;

  if (!Number.isSafeInteger(version) || (version as number) < 1) {
    throw invalidState(statePath, '"version" must be a positive integer');
  }
  if (!Array.isArray(installed) || !installed.every((id) => typeof id === "string")) {
    throw invalidState(statePath, '"installed" must be an array of strings');
  }
  if (state.packageManager !== undefined && !isPackageManager(state.packageManager)) {
    throw invalidState(statePath, '"packageManager" must be npm, pnpm, yarn, or bun');
  }

  return {
    version: version as number,
    installed,
    ...(state.packageManager === undefined
      ? {}
      : { packageManager: state.packageManager as PackageManager }),
  };
}

function getStatePath(
  projectRoot: string
) {
  return path.join(
    projectRoot,
    ".forge.json"
  );
}

export async function readProjectState(
  projectRoot: string
): Promise<ForgeProjectState> {
  const statePath =
    getStatePath(projectRoot);

  let contents: string;
  try {
    contents = await fs.readFile(statePath, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return { ...DEFAULT_STATE, installed: [] };
    }
    throw error;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(contents);
  } catch {
    throw invalidState(statePath, "malformed JSON");
  }

  return normalizeProjectState(parsed, statePath);
}

export async function writeProjectState(
  projectRoot: string,
  state: ForgeProjectState
) {
  const statePath =
    getStatePath(projectRoot);

  await fs.writeFile(
    statePath,
    JSON.stringify(
      state,
      null,
      2
    ) + "\n",
    "utf8"
  );
}

export async function markInstalled(
  projectRoot: string,
  boilerplateId: string
) {
  const state =
    await readProjectState(
      projectRoot
    );

  if (
    !state.installed.includes(
      boilerplateId
    )
  ) {
    state.installed.push(
      boilerplateId
    );
  }

  await writeProjectState(
    projectRoot,
    state
  );
}

export async function isInstalled(
  projectRoot: string,
  boilerplateId: string
) {
  const state =
    await readProjectState(
      projectRoot
    );

  return state.installed.includes(
    boilerplateId
  );
}

export async function setPackageManager(
  projectRoot: string,
  packageManager: PackageManager
) {
  const state = await readProjectState(projectRoot);
  await writeProjectState(projectRoot, {
    version: state.version,
    packageManager,
    installed: state.installed,
  });
}
