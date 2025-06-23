import { beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import { flushPromises } from "@vue/test-utils";

import {
  type UseDownloadArtifactOptions,
  useDownloadArtifact,
} from "../useDownloadArtifact";

const defaultItemId = "some-item-id";
const defaultDownloadId = "some-download-id";
const defaultDownloadUrl = "https://some-download-url";

const initialResponseReady = {
  downloadUrl: defaultDownloadUrl,
};

const initialResponseNotReady = {
  downloadId: defaultDownloadId,
};

const downloadReadyResponse = {
  status: "READY",
  downloadUrl: defaultDownloadUrl,
};

const downloadInProgressResponse = {
  status: "IN_PROGRESS",
};

const downloadFailedResponse = {
  status: "FAILED",
  statusMessage: "Oopsie",
};

const defaultItemName = "top-secret-file";

describe("useDownloadArtifact", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.useFakeTimers();
    vi.clearAllTimers();
  });

  const setUp = ({
    initialCall = "not_ready",
    retriesUntilDownloadIsReady = 0,
    downloadSucceeds = true,
    options = {},
  }: {
    initialCall?: "ready" | "not_ready" | "error";
    retriesUntilDownloadIsReady?: number;
    downloadSucceeds?: boolean;
    options?: UseDownloadArtifactOptions;
  } = {}) => {
    if (initialCall === "ready") {
      $ofetchMock.mockResolvedValueOnce(initialResponseReady);
    } else if (initialCall === "not_ready") {
      $ofetchMock.mockResolvedValueOnce(initialResponseNotReady);
    } else {
      $ofetchMock.mockRejectedValueOnce(new Error("Oh no!"));
    }

    for (let i = 0; i < retriesUntilDownloadIsReady; i++) {
      $ofetchMock.mockResolvedValueOnce(downloadInProgressResponse);
    }

    if (downloadSucceeds) {
      $ofetchMock.mockResolvedValueOnce(downloadReadyResponse);
    } else {
      $ofetchMock.mockResolvedValueOnce(downloadFailedResponse);
    }

    return useDownloadArtifact(options);
  };

  const setupDownloadMock = () => {
    const a = document.createElement("a");
    const clickSpy = vi.spyOn(a, "click");
    vi.spyOn(document, "createElement").mockImplementation(() => a);
    return {
      a,
      clickSpy,
    };
  };

  it("downloads item that is ready immediately", async () => {
    const { a, clickSpy } = setupDownloadMock();
    const { start } = setUp({ initialCall: "ready" });
    await start({ itemId: defaultItemId, name: defaultItemName });
    expect($ofetchMock).toHaveBeenCalledWith(
      `/repository/${defaultItemId}/artifact`,
      {
        method: "GET",
        query: { version: undefined },
      },
    );

    expect($ofetchMock).toHaveBeenCalledTimes(1);

    expect(a.href).toBe(`${defaultDownloadUrl}/`);
    expect(a.target).toBe("_blank");
    expect(a.style.display).toBe("none");
    expect(clickSpy).toHaveBeenCalled();

    vi.restoreAllMocks();
  });

  it("downloads item after polling", async () => {
    const { a, clickSpy } = setupDownloadMock();
    const { start, downloadItems, totalItemsBeingZipped } = setUp({
      retriesUntilDownloadIsReady: 3,
    });
    start({ itemId: defaultItemId, name: defaultItemName });
    await flushPromises(); // initial call

    expect(downloadItems.value.length).toBe(1);
    const downloadItem = downloadItems.value[0];
    expect(downloadItem).toStrictEqual({
      status: "IN_PROGRESS",
      downloadId: defaultDownloadId,
      itemId: defaultItemId,
      name: defaultItemName,
    });
    expect(totalItemsBeingZipped.value).toBe(1);

    vi.runAllTimers(); // polling the first time
    await flushPromises();
    vi.runAllTimers(); // polling the second time
    await flushPromises();
    vi.runAllTimers(); // polling the third time
    await flushPromises();
    vi.runAllTimers(); // receive the ready response
    await flushPromises();

    expect($ofetchMock).toHaveBeenCalledTimes(5);

    expect(downloadItem).toStrictEqual({
      status: "READY",
      downloadId: defaultDownloadId,
      downloadUrl: defaultDownloadUrl,
      itemId: defaultItemId,
      name: defaultItemName,
    });
    expect(totalItemsBeingZipped.value).toBe(0);

    expect(clickSpy).toHaveBeenCalled();
    expect(a.href).toBe(`${defaultDownloadUrl}/`);
    vi.restoreAllMocks();
  });

  it("cancels ongoing download", async () => {
    const { start, cancel, downloadItems } = setUp({
      retriesUntilDownloadIsReady: 3,
    });
    start({ itemId: defaultItemId, name: defaultItemName });
    await flushPromises(); // initial call

    cancel(defaultDownloadId);
    vi.runAllTimers();
    await flushPromises();

    expect(downloadItems.value.length).toBe(1);
    expect(downloadItems.value[0]).toStrictEqual({
      status: "CANCELLED",
      downloadId: defaultDownloadId,
      itemId: defaultItemId,
      failureDetails: "Download was cancelled manually",
      name: defaultItemName,
    });
  });

  it("removes download item", async () => {
    const { start, removeItem, downloadItems } = setUp({
      retriesUntilDownloadIsReady: 1,
    });
    start({ itemId: defaultItemId, name: defaultItemName });
    await flushPromises(); // initial call

    vi.runAllTimers(); // poll once
    await flushPromises();
    vi.runAllTimers(); // receive ready response
    await flushPromises();

    expect(downloadItems.value.length).toBe(1);
    expect(downloadItems.value[0]).toStrictEqual({
      status: "READY",
      downloadId: defaultDownloadId,
      itemId: defaultItemId,
      name: defaultItemName,
      downloadUrl: defaultDownloadUrl,
    });

    removeItem(defaultDownloadId);
    await nextTick();

    expect(downloadItems.value.length).toBe(0);
  });

  it("fails download after max retries", async () => {
    consola.mockTypes(() => vi.fn());
    const { start, downloadItems } = setUp({
      retriesUntilDownloadIsReady: 10,
      options: { maxRetries: 3 },
    });

    start({ itemId: defaultItemId, name: defaultItemName });
    await flushPromises(); // initial two calls

    expect(downloadItems.value.length).toBe(1);
    const downloadItem = downloadItems.value[0];
    expect(downloadItem).toStrictEqual({
      status: "IN_PROGRESS",
      downloadId: defaultDownloadId,
      itemId: defaultItemId,
      name: defaultItemName,
    });

    vi.runAllTimers(); // polling the first time
    await flushPromises();
    vi.runAllTimers(); // polling the second time
    await flushPromises();
    vi.runAllTimers(); // polling the third time
    await flushPromises();

    expect(downloadItem).toStrictEqual({
      status: "FAILED",
      downloadId: defaultDownloadId,
      itemId: defaultItemId,
      failureDetails: "Download timed out",
      name: defaultItemName,
    });
  });

  it("resets composable state", async () => {
    const { start, resetState, downloadItems } = setUp({
      retriesUntilDownloadIsReady: 1,
    });
    start({ itemId: defaultItemId, name: defaultItemName });
    await flushPromises(); // initial two call

    vi.runAllTimers(); // poll once
    await flushPromises();
    vi.runAllTimers(); // receive ready response
    await flushPromises();

    expect(downloadItems.value.length).toBe(1);
    expect(downloadItems.value[0]).toStrictEqual({
      status: "READY",
      downloadId: defaultDownloadId,
      itemId: defaultItemId,
      downloadUrl: defaultDownloadUrl,
      name: defaultItemName,
    });

    resetState();
    await nextTick();
    expect(downloadItems.value.length).toBe(0);
  });

  it("rethrows error if initial calls fail", async () => {
    const { start, downloadItems } = setUp({
      initialCall: "error",
    });

    await expect(() =>
      start({ itemId: defaultItemId, name: defaultItemName }),
    ).rejects.toThrowError();
    expect(downloadItems.value.length).toBe(0);
  });

  it("updates failure info when polling request fails, but does not throw", async () => {
    const { start, downloadItems } = setUp({
      downloadSucceeds: false,
      retriesUntilDownloadIsReady: 1,
    });

    start({ itemId: defaultItemId, name: defaultItemName });
    await flushPromises(); // initial call

    vi.runAllTimers(); // poll once
    await flushPromises();
    vi.runAllTimers(); // receive failure response
    await flushPromises();

    expect(downloadItems.value.length).toBe(1);
    expect(downloadItems.value[0]).toStrictEqual({
      status: "FAILED",
      downloadId: defaultDownloadId,
      itemId: defaultItemId,
      name: defaultItemName,
      failureDetails: `Download failed: ${downloadFailedResponse.statusMessage}`,
    });
  });
});
