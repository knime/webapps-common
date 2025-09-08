import { beforeEach, describe, expect, it } from "vitest";
import { FetchError, Headers } from "ofetch";

import { RFCError } from "../../../../rfcErrors/types";
import { useVersionsApi } from "../useVersionsApi";

const mockBaseUrl = "http://mock-api.test";

describe("useVersionsApi", () => {
  beforeEach(() => {
    globalThis.$ofetchMock.mockRestore();
  });

  it("should fetch permissions for a given itemId", async () => {
    const itemId = "mockItemId";
    const mockRepositoryItem = {
      "@controls": {
        "knime:delete": {},
        edit: {},
        "knime:configuration": {},
        "knime:move": {},
        "knime:copy": {},
        unrelatedControl: {},
      },
    };

    $ofetchMock.mockResolvedValueOnce(mockRepositoryItem);

    const { fetchPermissions } = useVersionsApi({
      customFetchClientOptions: { baseURL: mockBaseUrl },
    });
    const permissions = await fetchPermissions({ itemId });

    expect($ofetchMock).toHaveBeenCalledWith(
      `/repository/${itemId}`,
      expect.any(Object),
    );

    expect(permissions).toEqual([
      "DELETE",
      "EDIT",
      "CONFIGURATION",
      "MOVE",
      "COPY",
    ]);
  });

  it("should throw an error if the fetch fails", async () => {
    $ofetchMock.mockRejectedValueOnce(new Error("Network error"));

    const { fetchPermissions } = useVersionsApi({
      customFetchClientOptions: { baseURL: mockBaseUrl },
    });

    await expect(fetchPermissions({ itemId: "someId" })).rejects.toThrow(
      "Network error",
    );
  });

  it("should parse an error into an RFCError", async () => {
    const mockFetchError = new FetchError("message");
    // @ts-expect-error
    mockFetchError.response = {
      headers: new Headers({ date: new Date("2025-03-10").toISOString() }),
      status: 404,
    };
    mockFetchError.data = {
      title: "",
      details: [],
    };
    $ofetchMock.mockRejectedValueOnce(mockFetchError);

    const { fetchPermissions } = useVersionsApi({
      customFetchClientOptions: { baseURL: mockBaseUrl },
    });

    await expect(fetchPermissions({ itemId: "someId" })).rejects.toThrowError(
      RFCError,
    );
  });

  it("should fetch version limit", async () => {
    const limitMock = { limit: 123, currentUsage: 42 };
    $ofetchMock.mockResolvedValue(limitMock);

    const { fetchVersionLimit } = useVersionsApi({
      customFetchClientOptions: { baseURL: mockBaseUrl },
    });

    await expect(fetchVersionLimit({ itemId: "someId" })).resolves.toBe(
      limitMock,
    );

    expect($ofetchMock).toHaveBeenCalledWith(
      "/repository/limits/someId/item-versions",
      {
        method: "GET",
      },
    );
  });
});
