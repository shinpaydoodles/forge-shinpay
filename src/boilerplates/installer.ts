import fs from "node:fs/promises";
import path from "node:path";
import { confirm } from "@inquirer/prompts";
import chalk from "chalk";
import ora from "ora";
import { execa } from "execa";

import type {
  Boilerplate,
} from "./registry.js";

import {
  getForgeConfig,
} from "../config/forge.js";

interface BoilerplateFile {
  source: string;
  destination: string;
}

interface BoilerplateManifest {
  id: string;
  name: string;
  description?: string;
  category?: string;
  frameworks: string[];
  dependencies?: string[];
  files: BoilerplateFile[];
}

async function pathExists(
  targetPath: string
) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function installDependencies(
  dependencies: string[],
  projectRoot: string
) {
  if (dependencies.length === 0) {
    return;
  }

  const spinner = ora(
    "Installing dependencies..."
  ).start();

  try {
    await execa(
      "npm",
      [
        "install",
        ...dependencies,
      ],
      {
        cwd: projectRoot,
        stdio: "pipe",
      }
    );

    spinner.succeed(
      "Dependencies installed."
    );
  } catch (error) {
    spinner.fail(
      "Failed to install dependencies."
    );

    throw error;
  }
}

async function copyFile(
  source: string,
  destination: string
) {
  await fs.mkdir(
    path.dirname(destination),
    {
      recursive: true,
    }
  );

  if (await pathExists(destination)) {
    const overwrite = await confirm({
      message: `${path.basename(
        destination
      )} already exists. Overwrite?`,
      default: false,
    });

    if (!overwrite) {
      console.log(
        chalk.yellow(
          `Skipped ${path.basename(
            destination
          )}`
        )
      );

      return;
    }
  }

  await fs.copyFile(
    source,
    destination
  );

  console.log(
    chalk.green(
      `✓ ${path.relative(
        process.cwd(),
        destination
      )}`
    )
  );
}

async function copyDirectory(
  source: string,
  destination: string
) {
  await fs.mkdir(destination, {
    recursive: true,
  });

  const entries = await fs.readdir(
    source,
    {
      withFileTypes: true,
    }
  );

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

    await copyFile(
      sourcePath,
      destinationPath
    );
  }
}

async function installFileEntry(
  boilerplateRoot: string,
  projectRoot: string,
  file: BoilerplateFile
) {
  const source = path.resolve(
    boilerplateRoot,
    file.source
  );

  const destination = path.resolve(
    projectRoot,
    file.destination
  );

  if (!(await pathExists(source))) {
    throw new Error(
      `Boilerplate source not found: ${source}`
    );
  }

  const sourceStats =
    await fs.stat(source);

  if (sourceStats.isDirectory()) {
    await copyDirectory(
      source,
      destination
    );

    return;
  }

  await copyFile(
    source,
    destination
  );
}

export async function installBoilerplate(
  boilerplate: Boilerplate,
  projectRoot = process.cwd()

) {

  const config = getForgeConfig();

  const boilerplatesRoot =
    config.builtinBoilerplatesRoot;

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
    ) as BoilerplateManifest;

  await installDependencies(
    manifest.dependencies ?? [],
    projectRoot
  );

  const spinner = ora(
    `Installing ${manifest.name}...`
  ).start();

  spinner.stop();

  for (const file of manifest.files) {
    await installFileEntry(
      boilerplateRoot,
      projectRoot,
      file
    );
  }

  console.log();

  console.log(
    chalk.bold.green(
      `✓ ${manifest.name} installed successfully.`
    )
  );
}