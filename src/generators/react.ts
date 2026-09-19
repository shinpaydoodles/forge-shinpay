import { execa } from "execa";
import ora from "ora";

type ReactTemplate = "react-ts" | "react";

export async function generateReactProject(
  projectName: string,
  template: ReactTemplate
) {
  const spinner = ora(`Creating ${projectName}...`).start();

  try {
    spinner.text = "Creating Vite project...";

    await execa(
      "npm",
      [
        "create",
        "vite@latest",
        projectName,
        "--",
        "--template",
        template,
      ],
      {
        stdio: "pipe",
      }
    );

    spinner.succeed("Vite project created.");

    const installSpinner = ora("Installing dependencies...").start();

    await execa("npm", ["install"], {
      cwd: projectName,
      stdio: "pipe",
    });

    installSpinner.succeed("Dependencies installed.");
  } catch (error) {
    spinner.fail("Failed to create project.");
    throw error;
  }
}