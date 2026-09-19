import { Command } from "commander";
import { select } from "@inquirer/prompts";
import chalk from "chalk";

import {
  boilerplates,
  getBoilerplate,
} from "../boilerplates/registry.js";

import {
  installBoilerplate,
} from "../boilerplates/installer.js";

import {
  detectProject,
} from "../project/detector.js";

import {
  getProjectStackId,
  isBoilerplateCompatible,
} from "../boilerplates/compatibility.js";

export const addCommand = new Command("add")
  .description("Add a boilerplate to the current project")
  .argument(
    "[boilerplate]",
    "Boilerplate to install"
  )
  .action(async (boilerplateId?: string) => {
    console.log();

    console.log(
      chalk.bold.cyan(
        "⚒ Forge Feature Installer"
      )
    );

    console.log();

    const project = await detectProject();

    const projectStack =
      getProjectStackId(project);

    if (projectStack === "unknown") {
      console.error(
        chalk.red(
          "Forge could not identify this project."
        )
      );

      console.log();

      console.log(
        chalk.gray(
          "Run this command inside a supported project."
        )
      );

      process.exitCode = 1;
      return;
    }

    const compatibleBoilerplates =
      boilerplates.filter(
        (boilerplate) =>
          isBoilerplateCompatible(
            boilerplate,
            project
          )
      );

    console.log(
      `${chalk.gray("Detected stack:")} ${chalk.cyan(
        projectStack
      )}`
    );

    console.log();

    let selectedId = boilerplateId;

    if (!selectedId) {
      if (compatibleBoilerplates.length === 0) {
        console.log(
          chalk.yellow(
            "No compatible boilerplates are available for this project."
          )
        );

        return;
      }

      selectedId = await select({
        message: "What would you like to add?",
        choices: compatibleBoilerplates.map(
          (boilerplate) => ({
            name: `${boilerplate.name} — ${boilerplate.description}`,
            value: boilerplate.id,
          })
        ),
      });
    }

    const boilerplate =
      getBoilerplate(selectedId);

    if (!boilerplate) {
      console.error(
        chalk.red(
          `Unknown boilerplate: ${selectedId}`
        )
      );

      console.log();

      console.log(
        chalk.gray(
          "Available boilerplates:"
        )
      );

      for (const item of boilerplates) {
        console.log(
          `  ${chalk.cyan(item.id)}`
        );
      }

      process.exitCode = 1;
      return;
    }

    if (
      !isBoilerplateCompatible(
        boilerplate,
        project
      )
    ) {
      console.error(
        chalk.red(
          `${boilerplate.name} is not compatible with this project.`
        )
      );

      console.log();

      console.log(
        `${chalk.gray(
          "Current stack:"
        )} ${projectStack}`
      );

      console.log(
        `${chalk.gray(
          "Supported:"
        )} ${boilerplate.frameworks.join(
          ", "
        )}`
      );

      process.exitCode = 1;
      return;
    }

    try {
      await installBoilerplate(
        boilerplate
      );
    } catch (error) {
      console.log();

      console.error(
        chalk.red(
          "Failed to install boilerplate."
        )
      );

      if (error instanceof Error) {
        console.error(
          chalk.gray(error.message)
        );
      }

      process.exitCode = 1;
    }
  });