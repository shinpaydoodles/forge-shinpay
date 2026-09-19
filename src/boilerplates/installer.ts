import fs from "node:fs/promises";
import path from "node:path";
import { confirm } from "@inquirer/prompts";
import chalk from "chalk";
import ora from "ora";

import type { Boilerplate } from "./registry.js";

import { getForgeConfig } from "../config/forge.js";

interface TemplateManifest {
  id: string;
  name: string;
  description?: string;
  category?: string;

  frameworks: string[];

  dependencies?: string[];

  files: {
    source: string;
    destination: string;
  };
}

async function pathExists(targetPath: string) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function copyDirectory(
  source: string,
  destination: string
) {
  await fs.mkdir(destination, {
    recursive: true,
  });

  const entries = await fs.readdir(source, {
    withFileTypes: true,
  });

  for (const entry of entries) {
    const sourcePath = path.join(
      source,
      entry.name
    );

    const destinationPath = path.join(
      destination,
      entry.name
    );

    if (entry.isDirectory()) {
      await copyDirectory(
        sourcePath,
        destinationPath
      );

      continue;
    }

    if (await pathExists(destinationPath)) {
      const overwrite = await confirm({
        message: `${entry.name} already exists. Overwrite?`,
        default: false,
      });

      if (!overwrite) {
        console.log(
          chalk.yellow(
            `Skipped ${entry.name}`
          )
        );

        continue;
      }
    }

    await fs.copyFile(
      sourcePath,
      destinationPath
    );

    console.log(
      chalk.green(`✓ ${entry.name}`)
    );
  }
}

export async function installBoilerplate(
  boilerplate: Boilerplate
) {
  const projectRoot = process.cwd();

    const config = getForgeConfig();

    const boilerplatesRoot =
    config.boilerplatesRoot;

  const boilerplateRoot = path.join(
    boilerplatesRoot,
    boilerplate.path
  );

  const manifestPath = path.join(
    boilerplateRoot,
    "template.json"
  );

  if (!(await pathExists(manifestPath))) {
    throw new Error(
      `Missing template.json for ${boilerplate.id}`
    );
  }

  const manifestContents =
    await fs.readFile(
      manifestPath,
      "utf8"
    );

  const manifest =
    JSON.parse(
      manifestContents
    ) as TemplateManifest;

  const source = path.resolve(
    boilerplateRoot,
    manifest.files.source
  );

  const destination = path.resolve(
    projectRoot,
    manifest.files.destination
  );

  if (!(await pathExists(source))) {
    throw new Error(
      `Boilerplate source directory not found: ${source}`
    );
  }

  const spinner = ora(
    `Installing ${manifest.name}...`
  ).start();

  await fs.mkdir(destination, {
    recursive: true,
  });

  spinner.stop();

  await copyDirectory(
    source,
    destination
  );

  console.log();

  console.log(
    chalk.bold.green(
      `✓ ${manifest.name} installed successfully.`
    )
  );

  console.log(
    chalk.gray(
      `Installed to: ${path.relative(
        projectRoot,
        destination
      )}`
    )
  );
}