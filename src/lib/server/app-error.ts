export type AppErrorCode =
  | "BAD_REQUEST"
  | "CONFLICT"
  | "FORBIDDEN"
  | "INTERNAL_SERVER_ERROR"
  | "NOT_FOUND"
  | "UNAUTHORIZED";

export class AppError extends Error {
  readonly code: AppErrorCode;

  constructor(options: { code: AppErrorCode; message: string; cause?: unknown }) {
    super(options.message, { cause: options.cause });
    this.name = "AppError";
    this.code = options.code;
  }
}
