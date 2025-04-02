import { beforeEach, describe, expect, it, vi } from "vitest";

import { useVersionsApi } from "../useVersionsApi";

const mockBaseUrl = "http://mock-api.com";

describe("useVersionsApi", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    global.fetch = mockFetch;
    mockFetch.mockReset();
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

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockRepositoryItem),
    });

    const { fetchPermissions } = useVersionsApi({ baseUrl: mockBaseUrl });
    const permissions = await fetchPermissions({ itemId });

    expect(mockFetch).toHaveBeenCalledWith(
      `${mockBaseUrl}/repository/${itemId}`,
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
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const { fetchPermissions } = useVersionsApi({ baseUrl: mockBaseUrl });

    await expect(fetchPermissions({ itemId: "someId" })).rejects.toThrow(
      "Network error",
    );
  });
});
