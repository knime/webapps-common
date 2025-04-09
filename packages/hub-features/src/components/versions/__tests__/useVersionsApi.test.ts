import { beforeEach, describe, expect, it } from "vitest";

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

    const { fetchPermissions } = useVersionsApi({ baseUrl: mockBaseUrl });
    const permissions = await fetchPermissions({ itemId });

    expect($ofetchMock).toHaveBeenCalledWith(
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
    $ofetchMock.mockRejectedValueOnce(new Error("Network error"));

    const { fetchPermissions } = useVersionsApi({ baseUrl: mockBaseUrl });

    await expect(fetchPermissions({ itemId: "someId" })).rejects.toThrow(
      "Network error",
    );
  });
});
