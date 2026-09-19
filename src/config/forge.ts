import path from "node:path";
import os from "node:os";

export interface ForgeConfig {
  forgeHome: string;
  boilerplatesRoot: string;
}

export function getForgeConfig(): ForgeConfig {
  const forgeHome = path.join(
    os.homedir(),
    ".forge"
  );

  return {
    forgeHome,

    boilerplatesRoot: path.join(
      forgeHome,
      "boilerplates"
    ),
  };
}