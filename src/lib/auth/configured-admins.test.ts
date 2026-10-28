import { describe, expect, it } from "vite-plus/test";
import { parseAdminEmails } from "./configured-admin-emails";

describe("parseAdminEmails", () => {
  it("normalizes, filters, and deduplicates configured emails", () => {
    expect(
      parseAdminEmails(" Admin@Example.com, editor@example.com, admin@example.com,  "),
    ).toEqual(["admin@example.com", "editor@example.com"]);
  });

  it("returns no emails when the setting is absent", () => {
    expect(parseAdminEmails(undefined)).toEqual([]);
  });
});
