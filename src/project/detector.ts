import fs from "node:fs/promises";
import path from "node:path";
import { detectPackageManager, type PackageManager } from "./package-manager.js";

export type Framework =
  | "react-vite"
  | "expo"
  | "laravel"
  | "unknown";

export type Language =
  | "typescript"
  | "javascript"
  | "php"
  | "unknown";

export type Styling =
  | "tailwind"
  | "nativewind"
  | "css"
  | "unknown";

export interface ProjectInfo {
  root: string;
  framework: Framework;
  language: Language;
  styling: Styling;
  packageManager: PackageManager | "composer";
}

async function exists(filePath: string) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readPackageJson(
  projectRoot: string
): Promise<Record<string, any> | null> {
  const packagePath = path.join(
    projectRoot,
    "package.json"
  );

  if (!(await exists(packagePath))) {
    return null;
  }

  try {
    const contents = await fs.readFile(
      packagePath,
      "utf8"
    );

    return JSON.parse(contents);
  } catch {
    return null;
  }
}

function hasDependency(
  packageJson: Record<string, any> | null,
  dependency: string
) {
  if (!packageJson) {
    return false;
  }

  return Boolean(
    packageJson.dependencies?.[dependency] ||
      packageJson.devDependencies?.[dependency]
  );
}

export async function detectProject(
  projectRoot = process.cwd()
): Promise<ProjectInfo> {
  const packageJson =
    await readPackageJson(projectRoot);

  let framework: Framework = "unknown";
  let language: Language = "unknown";
  let styling: Styling = "unknown";

  // Expo
  if (
    hasDependency(packageJson, "expo")
  ) {
    framework = "expo";
  }

  // React + Vite
  else if (
    hasDependency(packageJson, "react") &&
    hasDependency(packageJson, "vite")
  ) {
    framework = "react-vite";
  }

  // Laravel
  else if (
    await exists(
      path.join(projectRoot, "artisan")
    )
  ) {
    framework = "laravel";
  }

  // Language
  if (
    await exists(
      path.join(projectRoot, "tsconfig.json")
    )
  ) {
    language = "typescript";
  } else if (framework === "laravel") {
    language = "php";
  } else if (packageJson) {
    language = "javascript";
  }

  // NativeWind
  if (
    hasDependency(packageJson, "nativewind")
  ) {
    styling = "nativewind";
  }

  // Tailwind
  else if (
    hasDependency(packageJson, "tailwindcss")
  ) {
    styling = "tailwind";
  }

  // Basic Vite CSS
  else if (
    await exists(
      path.join(projectRoot, "src", "index.css")
    )
  ) {
    styling = "css";
  }

  const packageManager = framework === "laravel" &&
    (await exists(path.join(projectRoot, "composer.lock")))
      ? "composer"
      : await detectPackageManager(projectRoot);

  return {
    root: projectRoot,
    framework,
    language,
    styling,
    packageManager,
  };
}
