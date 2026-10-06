import { execa } from "execa";
import ora from "ora";

import {
  getProjectInstallCommand,
  type PackageManager,
} from "../project/package-manager.js";

type ReactTemplate =
  | "react-ts"
  | "react";

function getCreateCommand(
  packageManager: PackageManager,
  projectName: string,
  template: ReactTemplate
) {
  switch (packageManager) {
    case "pnpm":
      return {
        command: "pnpm",
        args: [
          "create",
          "vite",
          projectName,
          "--template",
          template,
        ],
      };

    case "yarn":
      return {
        command: "yarn",
        args: [
          "create",
          "vite",
          projectName,
          "--template",
          template,
        ],
      };

    case "bun":
      return {
        command: "bun",
        args: [
          "create",
          "vite",
          projectName,
          "--template",
          template,
        ],
      };

    case "npm":
    default:
      return {
        command: "npm",
        args: [
          "create",
          "vite@latest",
          projectName,
          "--",
          "--template",
          template,
        ],
      };
  }
}

export async function generateReactProject(
  projectName: string,
  template: ReactTemplate,
  packageManager: PackageManager
) {
  const spinner = ora(
    `Creating ${projectName}...`
  ).start();

  try {
    spinner.text =
      `Creating Vite project with ${packageManager}...`;

    const createCommand =
      getCreateCommand(
        packageManager,
        projectName,
        template
      );

    await execa(
      createCommand.command,
      createCommand.args,
      {
        stdio: "pipe",
      }
    );

    spinner.succeed(
      "Vite project created."
    );

    const installSpinner = ora(
      `Installing dependencies with ${packageManager}...`
    ).start();

    const installCommand =
      getProjectInstallCommand(
        packageManager
      );

    await execa(
      installCommand.command,
      installCommand.args,
      {
        cwd: projectName,
        stdio: "pipe",
      }
    );

    installSpinner.succeed(
      "Dependencies installed."
    );
  } catch (error) {
    spinner.fail(
      "Failed to create project."
    );

    throw error;
  }
}
