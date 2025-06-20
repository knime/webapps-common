import { describe, expect, it, vi } from "vitest";

import { getFetchClient } from "../ofetchClient";

const { create } = vi.hoisted(() => ({ create: vi.fn() }));

vi.unmock("../ofetchClient");
vi.mock("ofetch", () => ({
  ofetch: { create },
}));

describe("getFetchClient", () => {
  it("uses default baseURL", () => {
    getFetchClient();

    expect(create).toHaveBeenCalledWith({
      baseURL: "/_/api",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json; application/problem+json",
      },
    });
  });

  it("uses overrides default baseURL based on supplied options", () => {
    getFetchClient({ baseURL: "http://myapi.com" });

    expect(create).toHaveBeenCalledWith({
      baseURL: "http://myapi.com",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json; application/problem+json",
      },
    });
  });
});
