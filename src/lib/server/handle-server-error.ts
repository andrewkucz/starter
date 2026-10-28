import { toast } from "sonner";
import { AppError } from "./app-error";

const DEFAULT_ERROR_MESSAGE = "Something went wrong!";

type ServerErrorMatcher = {
  match: string | RegExp;
  message?: string;
};

const SERVER_ERROR_MATCHERS: readonly ServerErrorMatcher[] = [];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getMessage(value: unknown): string | undefined {
  if (typeof value === "string") {
    const message = value.trim();
    return message || undefined;
  }

  if (!isRecord(value) || typeof value.message !== "string") return undefined;

  const message = value.message.trim();
  return message || undefined;
}

function getResponseMessage(error: Record<string, unknown>): string | undefined {
  if (!isRecord(error.response) || !isRecord(error.response.data)) return undefined;

  return getMessage(error.response.data.title) ?? getMessage(error.response.data);
}

function getErrorMessage(error: unknown): string | undefined {
  if (!isRecord(error)) return getMessage(error);

  return (
    getMessage(error.error) ??
    getMessage(error.cause) ??
    getResponseMessage(error) ??
    getMessage(error)
  );
}

function matchesErrorMessage(message: string, match: string | RegExp): boolean {
  if (typeof match === "string") return message === match;

  match.lastIndex = 0;
  const matches = match.test(message);
  match.lastIndex = 0;
  return matches;
}

export function getServerErrorMessage(error: unknown): string {
  if (error && error instanceof AppError) {
    return error.message;
  }

  const errorMessage = getErrorMessage(error);
  if (!errorMessage) return DEFAULT_ERROR_MESSAGE;

  const matcher = SERVER_ERROR_MATCHERS.find(({ match }) =>
    matchesErrorMessage(errorMessage, match),
  );
  if (!matcher) return DEFAULT_ERROR_MESSAGE;

  return getMessage(matcher.message) ?? errorMessage;
}

export function handleServerError(error: unknown, ...otherArgs: unknown[]) {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.error(error, { context: otherArgs });
  }

  toast.error(getServerErrorMessage(error));
}
