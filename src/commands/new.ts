import { Command } from "commander";
import { input, select, confirm } from "@inquirer/prompts";
import chalk from "chalk";
import { generateReactProject } from "../generators/react.js";
import { generateExpoProject } from "../generators/expo.js";

export const newCommand = new Command("new")
  .description("Create a new project")
  .action(async () => {
    console.log();
    console.log(chalk.bold.cyan("⚒ Forge Project Creator"));
    console.log();

    const projectName = await input({
      message: "Project name:",
      validate: (value) => {
        if (!value.trim()) {
          return "Project name is required.";
        }

        if (!/^[a-zA-Z0-9-_]+$/.test(value)) {
          return "Use only letters, numbers, hyphens, and underscores.";
        }

        return true;
      },
    });

    const projectType = await select({
      message: "What are you building?",
      choices: [
        {
          name: "Web Application",
          value: "web",
        },
        {
          name: "Mobile Application",
          value: "mobile",
        },
        {
          name: "Laravel Application",
          value: "laravel",
        },
      ],
    });

    let stack = "";

    if (projectType === "web") {
      stack = await select({
        message: "Choose your stack:",
        choices: [
          {
            name: "React + Vite + TypeScript",
            value: "react-vite-ts",
          },
          {
            name: "React + Vite + JavaScript",
            value: "react-vite-js",
          },
        ],
      });
    }

    if (projectType === "mobile") {
      stack = "expo-ts";

      console.log(
        chalk.gray(
          "Using React Native + Expo + TypeScript"
        )
      );
    }

    if (projectType === "laravel") {
      stack = "laravel";
    }

    console.log();

    console.log(chalk.bold("Project Configuration"));
    console.log(chalk.gray("────────────────────────"));

    console.log(`Name:  ${projectName}`);
    console.log(`Stack: ${stack}`);

    console.log();

    const shouldCreate = await confirm({
      message: "Create project?",
      default: true,
    });

    if (!shouldCreate) {
      console.log(chalk.yellow("Creation cancelled."));
      return;
    }

    console.log();

    try {
      switch (stack) {
        case "react-vite-ts":
          await generateReactProject(projectName, "react-ts");
          break;

        case "react-vite-js":
          await generateReactProject(projectName, "react");
          break;

        case "expo-ts":
          await generateExpoProject(projectName);
          break;

        case "laravel":
          console.log(
            chalk.yellow(
              "Laravel generator is coming next."
            )
          );
          return;
      }

      console.log();
      console.log(
        chalk.bold.green("✓ Project created successfully!")
      );

      console.log();
      console.log(chalk.gray("Next steps:"));
      console.log();
      console.log(`  cd ${projectName}`);
      console.log("  npm run dev");
      console.log();
    } catch (error) {
      console.log();
      console.error(
        chalk.red("Forge was unable to create the project.")
      );

      if (error instanceof Error) {
        console.error(chalk.gray(error.message));
      }

      process.exitCode = 1;
    }
  });