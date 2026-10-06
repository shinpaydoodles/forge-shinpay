export type InstallerErrorCode =
  | "MANIFEST_NOT_FOUND"
  | "MANIFEST_INVALID"
  | "SOURCE_NOT_FOUND"
  | "DEPENDENCY_INSTALL_FAILED"
  | "FILE_COPY_FAILED"
  | "MISSING_REQUIREMENTS"
  | "UNKNOWN";

export class InstallerError extends Error {
  constructor(
    message: string,
    public readonly code: InstallerErrorCode,
    public readonly cause?: unknown
  ) {
    super(message);

    this.name = "InstallerError";
  }
}