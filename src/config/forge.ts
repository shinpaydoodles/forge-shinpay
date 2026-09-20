import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

export interface ForgeConfig {
  forgeHome: string;
  builtinBoilerplatesRoot: string;
  customBoilerplatesRoot: string;
}

export function getForgeConfig(): ForgeConfig {
  const forgeHome = path.join(
    os.homedir(),
    ".forge"
  );

  const currentFile = fileURLToPath(
    import.meta.url
  );

  const currentDirectory =
    path.dirname(currentFile);

  const builtinBoilerplatesRoot =
    path.resolve(
      currentDirectory,
      "../../boilerplates"
    );

  return {
    forgeHome,

    builtinBoilerplatesRoot,

    customBoilerplatesRoot: path.join(
      forgeHome,
      "boilerplates"
    ),
  };
}