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

  try {
    const contents =
      await fs.readFile(
        statePath,
        "utf8"
      );

    const parsed =
      JSON.parse(contents) as ForgeProjectState;

    return {
      version:
        parsed.version ??
        DEFAULT_STATE.version,

      ...(isPackageManager(parsed.packageManager)
        ? { packageManager: parsed.packageManager }
        : {}),

      installed:
        Array.isArray(parsed.installed)
          ? parsed.installed
          : [],
    };
  } catch {
    return {
      ...DEFAULT_STATE,
      installed: [],
    };
  }
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
