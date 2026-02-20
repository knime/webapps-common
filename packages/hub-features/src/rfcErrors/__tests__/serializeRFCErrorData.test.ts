import { describe, expect, it } from "vitest";

import { serializeErrorForClipboard } from "../serializeRFCErrorData";

describe("serializeErrorForClipboard", () => {
  const formatDate = (date: Date) => `formatted:${date.toISOString()}`;

  it("serializes headline, title, and details", () => {
    const output = serializeErrorForClipboard(
      {
        title: "There was an error",
        details: ["Here", "are", "the", "deets"],
      },
      "Toast headline",
      formatDate,
    );

    expect(output).toContain("Toast headline\n\n");
    expect(output).toContain("There was an error\n\n");
    expect(output).toContain("Details: \n• Here\n• are\n• the\n• deets\n\n");
  });

  it("serializes a single detail without bullet list", () => {
    const output = serializeErrorForClipboard(
      {
        title: "There was an error",
        details: ["Single detail"],
      },
      "Toast headline",
      formatDate,
    );

    expect(output).toContain("Details: Single detail\n\n");
  });

  it("serializes metadata and stacktrace", () => {
    const output = serializeErrorForClipboard(
      {
        title: "There was an error",
        status: 500,
        date: new Date("2024-01-01T12:00:00.000Z"),
        requestId: "123456789",
        errorId: "extremely-fatal-error",
        stacktrace: "boom\nboom",
      },
      "Toast headline",
      formatDate,
    );

    expect(output).toContain("Status: 500\n");
    expect(output).toContain("Date: formatted:2024-01-01T12:00:00.000Z\n");
    expect(output).toContain("Request Id: 123456789\n");
    expect(output).toContain("Error Id: extremely-fatal-error\n");
    expect(output).toContain("------\nStacktrace:\n\nboom\nboom\n");
  });
});
