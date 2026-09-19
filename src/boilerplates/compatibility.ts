import type {
  ProjectInfo,
} from "../project/detector.js";

import type {
  Boilerplate,
} from "./registry.js";

export function getProjectStackId(
  project: ProjectInfo
): string {
  if (
    project.framework === "react-vite" &&
    project.language === "typescript"
  ) {
    return "react-vite-ts";
  }

  if (
    project.framework === "react-vite" &&
    project.language === "javascript"
  ) {
    return "react-vite-js";
  }

  if (
    project.framework === "expo" &&
    project.language === "typescript"
  ) {
    return "expo-ts";
  }

  if (
    project.framework === "laravel"
  ) {
    return "laravel";
  }

  return "unknown";
}

export function isBoilerplateCompatible(
  boilerplate: Boilerplate,
  project: ProjectInfo
): boolean {
  const stack =
    getProjectStackId(project);

  return boilerplate.frameworks.includes(
    stack
  );
}