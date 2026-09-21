import fs from "node:fs/promises";
import path from "node:path";
import chalk from "chalk";

import {
  detectProject,
} from "../project/detector.js";

import {
  readProjectState,
} from "../project/state.js";

interface CheckResult {
  name: string;
  status: "pass" | "warn" | "fail";
  message: string;
}

async function exists(
  targetPath: string
) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function checkSupabase(
  projectRoot: string,
  installed: string[]
): Promise<CheckResult[]> {
  if (!installed.includes("supabase")) {
    return [];
  }

  const results: CheckResult[] = [];

  const clientPath = path.join(
    projectRoot,
    "src",
    "lib",
    "supabase.ts"
  );

  const envExamplePath = path.join(
    projectRoot,
    ".env.example"
  );

  results.push({
    name: "Supabase client",
    status:
      (await exists(clientPath))
        ? "pass"
        : "fail",
    message:
      (await exists(clientPath))
        ? "Supabase client found."
        : "src/lib/supabase.ts is missing.",
  });

  results.push({
    name: "Supabase environment",
    status:
      (await exists(envExamplePath))
        ? "pass"
        : "warn",
    message:
      (await exists(envExamplePath))
        ? ".env.example found."
        : ".env.example is missing.",
  });

  return results;
}

async function checkSupabaseAuth(
  projectRoot: string,
  installed: string[]
): Promise<CheckResult[]> {
  if (
    !installed.includes(
      "supabase-auth"
    )
  ) {
    return [];
  }

  const results: CheckResult[] = [];

  if (!installed.includes("supabase")) {
    results.push({
      name: "Supabase Auth dependency",
      status: "fail",
      message:
        "Supabase Auth requires the Supabase boilerplate.",
    });
  }

  const authFiles = [
    "auth.ts",
    "AuthProvider.tsx",
    "useAuth.ts",
  ];

  for (const file of authFiles) {
    const filePath = path.join(
      projectRoot,
      "src",
      "auth",
      file
    );

    results.push({
      name: `Auth ${file}`,
      status:
        (await exists(filePath))
          ? "pass"
          : "fail",
      message:
        (await exists(filePath))
          ? `${file} found.`
          : `src/auth/${file} is missing.`,
    });
  }

  return results;
}

async function checkTanStackQuery(
  projectRoot: string,
  installed: string[]
): Promise<CheckResult[]> {
  if (
    !installed.includes(
      "tanstack-query"
    )
  ) {
    return [];
  }

  const results: CheckResult[] = [];

  const queryClientPath = path.join(
    projectRoot,
    "src",
    "query",
    "queryClient.ts"
  );

  const providerPath = path.join(
    projectRoot,
    "src",
    "query",
    "QueryProvider.tsx"
  );

  results.push({
    name: "Query client",
    status:
      (await exists(queryClientPath))
        ? "pass"
        : "fail",
    message:
      (await exists(queryClientPath))
        ? "Query client found."
        : "src/query/queryClient.ts is missing.",
  });

  results.push({
    name: "Query provider",
    status:
      (await exists(providerPath))
        ? "pass"
        : "fail",
    message:
      (await exists(providerPath))
        ? "Query provider found."
        : "src/query/QueryProvider.tsx is missing.",
  });

  return results;
}

async function checkZustand(
  projectRoot: string,
  installed: string[]
): Promise<CheckResult[]> {
  if (!installed.includes("zustand")) {
    return [];
  }

  const storePath = path.join(
    projectRoot,
    "src",
    "store",
    "exampleStore.ts"
  );

  return [
    {
      name: "Zustand store",
      status:
        (await exists(storePath))
          ? "pass"
          : "warn",
      message:
        (await exists(storePath))
          ? "Example store found."
          : "Example store not found. It may have been replaced by application stores.",
    },
  ];
}

function printResult(
  result: CheckResult
) {
  if (result.status === "pass") {
    console.log(
      `${chalk.green("✓")} ${result.message}`
    );
    return;
  }

  if (result.status === "warn") {
    console.log(
      `${chalk.yellow("!")} ${result.message}`
    );
    return;
  }

  console.log(
    `${chalk.red("✗")} ${result.message}`
  );
}

export async function doctorCommand() {
  const projectRoot = process.cwd();

  console.log();
  console.log(
    chalk.bold("⚒ Forge Doctor")
  );
  console.log();

  const detected =
    await detectProject(projectRoot);

  if (detected.framework === "unknown") {
    console.log(
      chalk.red(
        "Forge could not detect a supported project."
      )
    );

    return;
  }

  console.log(
    chalk.gray(
      `Detected: ${detected.framework} / ${detected.language}`
    )
  );

  console.log();

  const state =
    await readProjectState(
      projectRoot
    );

  if (state.installed.length === 0) {
    console.log(
      chalk.yellow(
        "No Forge-managed features are recorded."
      )
    );

    return;
  }

  console.log(
    `Installed: ${state.installed.join(
      ", "
    )}`
  );

  console.log();

  const results: CheckResult[] = [];

  results.push(
    ...(await checkSupabase(
      projectRoot,
      state.installed
    ))
  );

  results.push(
    ...(await checkSupabaseAuth(
      projectRoot,
      state.installed
    ))
  );

  results.push(
    ...(await checkTanStackQuery(
      projectRoot,
      state.installed
    ))
  );

  results.push(
    ...(await checkZustand(
      projectRoot,
      state.installed
    ))
  );

  for (const result of results) {
    printResult(result);
  }

  const failures =
    results.filter(
      (result) =>
        result.status === "fail"
    ).length;

  const warnings =
    results.filter(
      (result) =>
        result.status === "warn"
    ).length;

  console.log();

  if (failures > 0) {
    console.log(
      chalk.red.bold(
        `${failures} problem(s) found.`
      )
    );
  } else if (warnings > 0) {
    console.log(
      chalk.yellow.bold(
        `Project passed with ${warnings} warning(s).`
      )
    );
  } else {
    console.log(
      chalk.green.bold(
        "✓ Project looks healthy."
      )
    );
  }

  console.log();
}