const AUTH_ERROR_MESSAGES = new Map(
  Object.entries({
    invalid_callback_request:
      "The authentication callback request was invalid. Try signing in again.",
    invalid_code: "The authentication code was invalid. Try signing in again.",
    internal_server_error:
      "The authentication provider returned an internal error. Try again later.",
    state_not_found: "The authentication session could not be resumed. Try signing in again.",
    state_invalid: "The authentication session was invalid. Try signing in again.",
    state_mismatch: "The authentication session did not match your request. Try signing in again.",
    no_code: "The authentication provider did not return a code. Try signing in again.",
    no_callback_url: "The authentication callback URL was missing. Try signing in again.",
    oauth_provider_not_found: "The requested authentication provider is not available.",
    email_not_found:
      "The authentication provider did not return an email address for this account.",
    "email_doesn't_match":
      "The email returned by the authentication provider did not match your account.",
    unable_to_get_user_info:
      "We could not retrieve your account details from the authentication provider.",
    unable_to_link_account:
      "We could not link that authentication account. Try again or use a different account.",
    unable_to_create_user: "We could not create your account. Try again later or contact support.",
    unable_to_create_session: "We could not create your session. Try signing in again.",
    account_not_linked: "That authentication account is not linked to a user in this app.",
    account_already_linked_to_different_user:
      "That authentication account is already linked to a different user.",
  }),
);

const FALLBACK_AUTH_ERROR_MESSAGE =
  "There was a problem while attempting to sign in. Try again later or contact support if the problem persists.";

export function getAuthErrorMessage(errorCode?: string | null) {
  if (!errorCode) {
    return FALLBACK_AUTH_ERROR_MESSAGE;
  }

  return AUTH_ERROR_MESSAGES.get(errorCode) ?? FALLBACK_AUTH_ERROR_MESSAGE;
}
