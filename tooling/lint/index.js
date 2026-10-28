import destructureQueryResult from "./rules/destructure-query-result.js";

export default {
  meta: { name: "starter-custom-rules" },
  rules: {
    "destructure-query-result": destructureQueryResult,
  },
};
