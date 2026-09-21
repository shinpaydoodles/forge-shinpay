import { Command } from "commander";
import {
  input,
  select,
  confirm,
  checkbox,
} from "@inquirer/prompts";
import chalk from "chalk";
import path from "node:path";

import {
  generateReactProject,
} from "../generators/react.js";

import {
  generateExpoProject,
} from "../generators/expo.js";

import {
  setupTailwind,
} from "../setup/tailwind.js";

import {
  getBoilerplate,
} from "../boilerplates/registry.js";

import {
  installBoilerplate,
} from "../boilerplates/installer.js";

export const newCommand = new Command("new")
  .description("Create a new project")
  .action(async () => {
    console.log();
    console.log(
      chalk.bold.cyan(
        "⚒ Forge Project Creator"
      )
    );
    console.log();

    // Project name
    const projectName = await input({
      message: "Project name:",

      validate: (value) => {
        if (!value.trim()) {
          return "Project name is required.";
        }

        if (
          !/^[a-zA-Z0-9-_]+$/.test(
            value
          )
        ) {
          return "Use only letters, numbers, hyphens, and underscores.";
        }

        return true;
      },
    });

    //Project type
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
    let useTailwind = false;
    let selectedFeatures: string[] = [];

    // web configuration

    if (projectType === "web") {
      stack = await select({
        message: "Choose your stack:",

        choices: [
          {
            name:
              "React + Vite + TypeScript",
            value: "react-vite-ts",
          },
          {
            name:
              "React + Vite + JavaScript",
            value: "react-vite-js",
          },
        ],
      });

      useTailwind = await confirm({
        message:
          "Configure Tailwind CSS for this project?",
        default: true,
      });

      // feature selection for React + Vite + TypeScript
      if (stack === "react-vite-ts") {
        selectedFeatures =
          await checkbox({
            message:
              "Select features to include:",

            choices: [
              {
                name: "Supabase",
                value: "supabase",
              },
              {
                name: "Supabase Auth",
                value: "supabase-auth",
              },
              {
                name: "TanStack Query",
                value:
                  "tanstack-query",
              },
              {
                name: "Zustand",
                value: "zustand",
              },
            ],
          });

          // Ensure that Supabase is included if Supabase Auth is selected
        if (
          selectedFeatures.includes(
            "supabase-auth"
          ) &&
          !selectedFeatures.includes(
            "supabase"
          )
        ) {
          selectedFeatures.unshift(
            "supabase"
          );
        }
      }
    }

    // mobile configuration
    if (projectType === "mobile") {
      stack = "expo-ts";

      console.log(
        chalk.gray(
          "Using React Native + Expo + TypeScript"
        )
      );
    }

    // laravel configuration
    if (projectType === "laravel") {
      stack = "laravel";
    }

    // show project configuration
    console.log();

    console.log(
      chalk.bold(
        "Project Configuration"
      )
    );

    console.log(
      chalk.gray(
        "────────────────────────"
      )
    );

    console.log(
      `Name:     ${projectName}`
    );

    console.log(
      `Stack:    ${stack}`
    );

    if (
      stack === "react-vite-ts" ||
      stack === "react-vite-js"
    ) {
      console.log(
        `Tailwind: ${
          useTailwind
            ? "Yes"
            : "No"
        }`
      );
    }

    console.log(
      `Features: ${
        selectedFeatures.length > 0
          ? selectedFeatures.join(
              ", "
            )
          : "None"
      }`
    );

    console.log();

    // create project
    const shouldCreate =
      await confirm({
        message:
          "Create project?",
        default: true,
      });

    if (!shouldCreate) {
      console.log(
        chalk.yellow(
          "Creation cancelled."
        )
      );

      return;
    }

    console.log();

    try {
      //step 1: generate base project
      switch (stack) {
        case "react-vite-ts":
          await generateReactProject(
            projectName,
            "react-ts"
          );

          break;

        case "react-vite-js":
          await generateReactProject(
            projectName,
            "react"
          );

          break;

        case "expo-ts":
          await generateExpoProject(
            projectName
          );

          break;

        case "laravel":
          console.log(
            chalk.yellow(
              "Laravel generator is not implemented yet."
            )
          );

          return;

        default:
          throw new Error(
            `Unsupported stack: ${stack}`
          );
      }

      // get project path
      const projectPath =
        path.resolve(
          process.cwd(),
          projectName
        );
//    // step 2: setup Tailwind if selected
      if (
        useTailwind &&
        (
          stack ===
            "react-vite-ts" ||
          stack ===
            "react-vite-js"
        )
      ) {
        await setupTailwind(
          projectPath
        );
      }
      // step 3: install selected features
      for (
        const featureId of
        selectedFeatures
      ) {
        const boilerplate =
          getBoilerplate(
            featureId
          );

        if (!boilerplate) {
          throw new Error(
            `Boilerplate not found: ${featureId}`
          );
        }

        await installBoilerplate(
          boilerplate,
          projectPath
        );
      }

      // step 4: complete
      console.log();

      console.log(
        chalk.bold.green(
          "✓ Project created successfully!"
        )
      );

      console.log();

      console.log(
        chalk.gray(
          "Next steps:"
        )
      );

      console.log();

      console.log(
        `  cd ${projectName}`
      );

      if (
        stack ===
          "react-vite-ts" ||
        stack ===
          "react-vite-js"
      ) {
        console.log(
          "  npm run dev"
        );
      }

      if (
        stack === "expo-ts"
      ) {
        console.log(
          "  npx expo start"
        );
      }

      console.log();
    } catch (error) {
      console.log();

      console.error(
        chalk.red(
          "Forge was unable to create the project."
        )
      );

      if (
        error instanceof Error
      ) {
        console.error(
          chalk.gray(
            error.message
          )
        );
      }

      process.exitCode = 1;
    }
  });