import { toast } from "sonner";
import { z } from "zod";
import { AppError } from "./app-error";

const DEFAULT_ERROR_MESSAGE = "Something went wrong!";

type ServerErrorMatcher = {
  match: string | RegExp;
  message?: string;
};

const SERVER_ERROR_MATCHERS: readonly ServerErrorMatcher[] = [];

const messageTextSchema = z.string().trim().min(1);

const optionalMessageTextSchema = messageTextSchema.optional().catch(undefined);

/** A non-blank message, given directly or as an object's `message`. */
const messageSchema = z
  .union([
    messageTextSchema,
    z.object({ message: messageTextSchema }).transform(({ message }) => message),
  ])
  .optional()
  .catch(undefined);

/** The most specific message a thrown value or failed response carries, if any. */
const serverErrorMessageSchema = z
  .union([
    messageTextSchema,
    z
      .object({
        error: messageSchema,
        cause: messageSchema,
        response: z
          .object({ data: z.object({ title: messageSchema, message: optionalMessageTextSchema }) })
          .optional()
          .catch(undefined),
        message: optionalMessageTextSchema,
      })
      .transform(
        ({ error, cause, response, message }) =>
          error ?? cause ?? response?.data.title ?? response?.data.message ?? message,
      ),
  ])
  .optional()
  .catch(undefined);

function matchesErrorMessage(message: string, match: string | RegExp): boolean {
  if (!(match instanceof RegExp)) return message === match;

  match.lastIndex = 0;
  const matches = match.test(message);
  match.lastIndex = 0;

  return matches;
}

export function getServerErrorMessage(cause: unknown): string {
  if (cause instanceof AppError) {
    return cause.message;
  }

  const errorMessage = serverErrorMessageSchema.parse(cause);

  if (!errorMessage) return DEFAULT_ERROR_MESSAGE;

  const matcher = SERVER_ERROR_MATCHERS.find(({ match }) =>
    matchesErrorMessage(errorMessage, match),
  );

  if (!matcher) return DEFAULT_ERROR_MESSAGE;

  return matcher.message?.trim() || errorMessage;
}

export function handleServerError(cause: unknown, ...otherArgs: unknown[]) {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.error(cause, { context: otherArgs });
  }

  toast.error(getServerErrorMessage(cause));
}
