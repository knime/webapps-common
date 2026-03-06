import { describe, expect, it } from "vitest";

import { buildLoginPath, buildLogoutPath } from "../shared";

describe("auth utils", () => {
  it("builds login path", () => {
    const wdywtg = "/jdoe/spaces/Public/Co3 sr/current-state";
    const expectedPath =
      "/_/auth/login?wdywtg=%2Fjdoe%2Fspaces%2FPublic%2FCo3%20sr%2Fcurrent-state";
    expect(buildLoginPath({ wdywtg })).toEqual(expectedPath);
  });

  it("builds logout path", () => {
    const wdywtg = "/jdoe/spaces/Public/Co3 sr/current-state";
    const expectedPath =
      "/_/auth/logout?wdywtg=%2Fjdoe%2Fspaces%2FPublic%2FCo3%20sr%2Fcurrent-state";
    expect(buildLogoutPath({ wdywtg })).toEqual(expectedPath);
  });

  it("encodes the wdywtg parameter if not already encoded", () => {
    const wdywtg = "/development team/my space";
    const expectedPath =
      "/_/auth/login?wdywtg=%2Fdevelopment%20team%2Fmy%20space";
    expect(buildLoginPath({ wdywtg })).toEqual(expectedPath);
  });

  it("encodes the wdywtg parameter fully if only partially encoded", () => {
    const wdywtg = "/development%20team/my space";
    const expectedPath =
      "/_/auth/login?wdywtg=%2Fdevelopment%20team%2Fmy%20space";
    expect(buildLoginPath({ wdywtg })).toEqual(expectedPath);
  });

  it("does not encode the wdywtg parameter if already encoded", () => {
    const wdywtg = "%2Fdevelopment%20team%2Fmy%20space";
    const expectedPath =
      "/_/auth/login?wdywtg=%2Fdevelopment%20team%2Fmy%20space";
    expect(buildLoginPath({ wdywtg })).toEqual(expectedPath);
  });
});
