import { Command } from "commander";
import chalk from "chalk";
import path from "node:path";

import {
  detectProject,
} from "../project/detector.js";

import {
  getForgeConfig,
} from "../config/forge.js";

export const infoCommand = new Command("info")
  .description(
    "Show information about the current project"
  )
  .action(async () => {
    console.log();

    console.log(
      chalk.bold.cyan("⚒ Forge Project Info")
    );

    console.log();

    const project =
      await detectProject();

    const config =
      getForgeConfig();

    console.log(
      `${chalk.gray("Project:")} ${path.basename(
        project.root
      )}`
    );

    console.log(
      `${chalk.gray("Framework:")} ${project.framework}`
    );

    console.log(
      `${chalk.gray("Language:")} ${project.language}`
    );

    console.log(
      `${chalk.gray("Styling:")} ${project.styling}`
    );

    console.log(
      `${chalk.gray(
        "Package Manager:"
      )} ${project.packageManager}`
    );

    console.log();

    console.log(
      chalk.bold("Forge Configuration")
    );

    console.log(
      chalk.gray(
        "────────────────────────"
      )
    );

    console.log(
      `${chalk.gray(
        "Forge Home:"
      )} ${config.forgeHome}`
    );

    console.log(
      `${chalk.gray("Built-in Boilerplates:")} ${
        config.builtinBoilerplatesRoot
      }`
    );

    console.log(
      `${chalk.gray("Custom Boilerplates:")} ${
        config.customBoilerplatesRoot
      }`
    );

    console.log();
  });