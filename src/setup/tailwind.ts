import fs from "node:fs/promises";
import path from "node:path";
import { execa } from "execa";
import ora from "ora";

export async function setupTailwind(
  projectRoot: string
) {
  const spinner = ora(
    "Setting up Tailwind CSS..."
  ).start();

  try {
    // Install Tailwind + official Vite plugin
    await execa(
      "npm",
      [
        "install",
        "tailwindcss",
        "@tailwindcss/vite",
      ],
      {
        cwd: projectRoot,
        stdio: "pipe",
      }
    );

    spinner.text =
      "Configuring Tailwind CSS...";

    await updateViteConfig(projectRoot);
    await updateGlobalCss(projectRoot);

    spinner.succeed(
      "Tailwind CSS configured."
    );
  } catch (error) {
    spinner.fail(
      "Failed to configure Tailwind CSS."
    );

    throw error;
  }
}

async function updateViteConfig(
  projectRoot: string
) {
  const tsConfig = path.join(
    projectRoot,
    "vite.config.ts"
  );

  const jsConfig = path.join(
    projectRoot,
    "vite.config.js"
  );

  let configPath: string;

  try {
    await fs.access(tsConfig);
    configPath = tsConfig;
  } catch {
    configPath = jsConfig;
  }

  let contents = await fs.readFile(
    configPath,
    "utf8"
  );

  if (
    !contents.includes(
      '@tailwindcss/vite'
    )
  ) {
    contents =
      `import tailwindcss from "@tailwindcss/vite";\n` +
      contents;
  }

  // Default Vite React template:
  // plugins: [react()]
  if (
    !contents.includes(
      "tailwindcss()"
    )
  ) {
    contents = contents.replace(
      /plugins:\s*\[([^\]]*)\]/,
      (_match, plugins) => {
        const existing =
          plugins.trim();

        return `plugins: [${
          existing
            ? `${existing}, `
            : ""
        }tailwindcss()]`;
      }
    );
  }

  await fs.writeFile(
    configPath,
    contents,
    "utf8"
  );
}

async function updateGlobalCss(
  projectRoot: string
) {
  const cssPath = path.join(
    projectRoot,
    "src",
    "index.css"
  );

  const contents =
    await fs.readFile(
      cssPath,
      "utf8"
    );

  if (
    contents.includes(
      '@import "tailwindcss";'
    )
  ) {
    return;
  }

  await fs.writeFile(
    cssPath,
    `@import "tailwindcss";\n\n${contents}`,
    "utf8"
  );
}