import { execa } from "execa";
import ora from "ora";

export async function generateExpoProject(projectName: string) {
  const spinner = ora(`Creating ${projectName}...`).start();

  try {
    spinner.text = "Creating Expo project...";

    await execa(
      "npx",
      [
        "create-expo-app@latest",
        projectName,
        "--yes",
      ],
      {
        stdio: "pipe",
      }
    );

    spinner.succeed("Expo project created.");
  } catch (error) {
    spinner.fail("Failed to create Expo project.");
    throw error;
  }
}