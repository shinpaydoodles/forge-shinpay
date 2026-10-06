import { execa } from "execa";
import ora from "ora";

import type {
  PackageManager,
} from "../project/package-manager.js";

function getExpoCreateCommand(
  packageManager: PackageManager,
  projectName: string
) {
  switch (packageManager) {
    case "pnpm":
      return {
        command: "pnpm",
        args: [
          "create",
          "expo-app",
          projectName,
          "--yes",
        ],
      };

    case "yarn":
      return {
        command: "yarn",
        args: [
          "create",
          "expo-app",
          projectName,
          "--yes",
        ],
      };

    case "bun":
      return {
        command: "bun",
        args: [
          "create",
          "expo",
          projectName,
          "--yes",
        ],
      };

    case "npm":
    default:
      return {
        command: "npx",
        args: [
          "create-expo-app@latest",
          projectName,
          "--yes",
        ],
      };
  }
}

export async function generateExpoProject(
  projectName: string,
  packageManager: PackageManager
) {
  const spinner = ora(
    `Creating ${projectName}...`
  ).start();

  try {
    spinner.text =
      `Creating Expo project with ${packageManager}...`;

    const createCommand =
      getExpoCreateCommand(
        packageManager,
        projectName
      );

    await execa(
      createCommand.command,
      createCommand.args,
      {
        stdio: "pipe",
      }
    );

    spinner.succeed(
      "Expo project created."
    );
  } catch (error) {
    spinner.fail(
      "Failed to create Expo project."
    );

    throw error;
  }
}