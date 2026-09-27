export interface BoilerplateFile {
  source: string;
  destination: string;
}

export interface BoilerplateManifest {
  id: string;
  name: string;
  description?: string;
  category?: string;
  frameworks: string[];
  requires?: string[];
  dependencies?: string[];
  files: BoilerplateFile[];
}

export class ManifestValidationError extends Error {
  readonly issues: string[];

  constructor(issues: string[]) {
    super(
      [
        "Invalid boilerplate manifest:",
        ...issues.map(
          (issue) => `- ${issue}`
        ),
      ].join("\n")
    );

    this.name =
      "ManifestValidationError";

    this.issues = issues;
  }
}

function isObject(
  value: unknown
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

function isNonEmptyString(
  value: unknown
): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0
  );
}

function validateStringArray(
  value: unknown,
  field: string,
  issues: string[],
  required: boolean
) {
  if (value === undefined) {
    if (required) {
      issues.push(
        `Missing required field: ${field}`
      );
    }

    return;
  }

  if (!Array.isArray(value)) {
    issues.push(
      `"${field}" must be an array.`
    );

    return;
  }

  value.forEach(
    (item, index) => {
      if (!isNonEmptyString(item)) {
        issues.push(
          `"${field}[${index}]" must be a non-empty string.`
        );
      }
    }
  );
}

export function parseManifest(
  contents: string
): BoilerplateManifest {
  let data: unknown;


  try {
    data = JSON.parse(contents);
  } catch {
    throw new ManifestValidationError([
      "template.json contains invalid JSON.",
    ]);
  }

  if (!isObject(data)) {
    throw new ManifestValidationError([
      "Manifest root must be a JSON object.",
    ]);
  }

  const issues: string[] = [];


  if (!isNonEmptyString(data.id)) {
    issues.push(
      'Missing or invalid required field: "id".'
    );
  }

  if (!isNonEmptyString(data.name)) {
    issues.push(
      'Missing or invalid required field: "name".'
    );
  }


  if (
    data.description !== undefined &&
    !isNonEmptyString(
      data.description
    )
  ) {
    issues.push(
      '"description" must be a non-empty string when provided.'
    );
  }

  if (
    data.category !== undefined &&
    !isNonEmptyString(
      data.category
    )
  ) {
    issues.push(
      '"category" must be a non-empty string when provided.'
    );
  }

  validateStringArray(
    data.frameworks,
    "frameworks",
    issues,
    true
  );

  validateStringArray(
    data.requires,
    "requires",
    issues,
    false
  );

  validateStringArray(
    data.dependencies,
    "dependencies",
    issues,
    false
  );


  //files
  if (data.files === undefined) {
    issues.push(
      'Missing required field: "files".'
    );
  } else if (!Array.isArray(data.files)) {
    issues.push(
      '"files" must be an array.'
    );
  } else {
    data.files.forEach(
      (file, index) => {
        if (!isObject(file)) {
          issues.push(
            `"files[${index}]" must be an object.`
          );

          return;
        }

        if (
          !isNonEmptyString(
            file.source
          )
        ) {
          issues.push(
            `"files[${index}].source" must be a non-empty string.`
          );
        }

        if (
          !isNonEmptyString(
            file.destination
          )
        ) {
          issues.push(
            `"files[${index}].destination" must be a non-empty string.`
          );
        }
      }
    );
  }

  if (issues.length > 0) {
    throw new ManifestValidationError(
      issues
    );
  }

  return data as unknown as BoilerplateManifest;
}