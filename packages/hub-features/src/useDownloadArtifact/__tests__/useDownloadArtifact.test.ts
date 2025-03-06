import { beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";
import { flushPromises } from "@vue/test-utils";

import {
  type UseDownloadArtifactOptions,
  useDownloadArtifact,
} from "../useDownloadArtifact";

const windowMock = {
  open: vi.fn(),
};

vi.stubGlobal("window", windowMock);

const defaultItemId = "some-item-id";
const defaultDownloadId = "some-download-id";
const defaultDownloadUrl = "some-download-url";

const downloadResponse = {
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

const baseURL = "/_/api";

describe("useDownloadArtifact", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.useFakeTimers();
    vi.clearAllTimers();
  });

  const setUp = ({
    initialCallSucceeds = true,
    retriesUntilDownloadIsReady = 0,
    downloadSucceeds = true,
    options = { customFetchClientOptions: { baseURL } },
  }: {
    initialCallSucceeds?: boolean;
    retriesUntilDownloadIsReady?: number;
    downloadSucceeds?: boolean;
    options?: UseDownloadArtifactOptions;
  } = {}) => {
    if (initialCallSucceeds) {
      $ofetchMock.mockResolvedValueOnce(downloadResponse);
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

  it("downloads item that is ready immediately", async () => {
    const { start } = setUp();
    await start({ itemId: defaultItemId });
    expect($ofetchMock).toHaveBeenNthCalledWith(
      1,
      `${baseURL}/repository/${defaultItemId}/artifact`,
      {
        method: "GET",
        query: { version: undefined },
      },
    );
    expect($ofetchMock).toHaveBeenNthCalledWith(
      2,
      `${baseURL}/downloads/${defaultDownloadId}/status`,
      {
        method: "GET",
        signal: undefined,
      },
    );

    expect($ofetchMock).toHaveBeenCalledTimes(2);

    expect(windowMock.open).toHaveBeenCalledWith(defaultDownloadUrl, "_parent");
  });

  it("downloads item after polling", async () => {
    const { start, downloadItems, totalItemsBeingZipped } = setUp({
      retriesUntilDownloadIsReady: 3,
    });
    start({ itemId: defaultItemId });
    await flushPromises(); // initial two calls

    expect(downloadItems.value.length).toBe(1);
    const downloadItem = downloadItems.value[0];
    expect(downloadItem).toStrictEqual({
      status: "IN_PROGRESS",
      downloadId: defaultDownloadId,
      itemId: defaultItemId,
    });
    expect(totalItemsBeingZipped.value).toBe(1);

    vi.runAllTimers(); // polling the first time
    await flushPromises();
    vi.runAllTimers(); // polling the second time
    await flushPromises();
    vi.runAllTimers(); // polling the third time
    await flushPromises();

    expect($ofetchMock).toHaveBeenCalledTimes(5);
    expect(windowMock.open).toHaveBeenCalledWith(defaultDownloadUrl, "_parent");

    expect(downloadItem).toStrictEqual({
      status: "READY",
      downloadId: defaultDownloadId,
      downloadUrl: defaultDownloadUrl,
      itemId: defaultItemId,
    });
    expect(totalItemsBeingZipped.value).toBe(0);
  });

  it("cancels ongoing download", async () => {
    const { start, cancel, downloadItems } = setUp({
      retriesUntilDownloadIsReady: 3,
    });
    start({ itemId: defaultItemId });
    await flushPromises(); // initial two calls

    cancel(defaultDownloadId);
    vi.runAllTimers();
    await flushPromises();

    expect(downloadItems.value.length).toBe(1);
    expect(downloadItems.value[0]).toStrictEqual({
      status: "CANCELLED",
      downloadId: defaultDownloadId,
      itemId: defaultItemId,
      failureDetails: "Download was cancelled manually",
    });
  });

  it("removes download item", async () => {
    const { start, removeItem, downloadItems } = setUp({
      retriesUntilDownloadIsReady: 1,
    });
    start({ itemId: defaultItemId });
    await flushPromises(); // initial two calls

    vi.runAllTimers(); // poll once
    await flushPromises();

    expect(downloadItems.value.length).toBe(1);
    expect(downloadItems.value[0]).toStrictEqual({
      status: "READY",
      downloadId: defaultDownloadId,
      itemId: defaultItemId,
      downloadUrl: defaultDownloadUrl,
    });

    removeItem(defaultDownloadId);
    await nextTick();

    expect(downloadItems.value.length).toBe(0);
  });

  it("fails download after max retries", async () => {
    const { start, downloadItems } = setUp({
      retriesUntilDownloadIsReady: 10,
      options: { maxRetries: 3 },
    });

    start({ itemId: defaultItemId });
    await flushPromises(); // initial two calls

    expect(downloadItems.value.length).toBe(1);
    const downloadItem = downloadItems.value[0];
    expect(downloadItem).toStrictEqual({
      status: "IN_PROGRESS",
      downloadId: defaultDownloadId,
      itemId: defaultItemId,
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
    });
  });

  it("resets composable state", async () => {
    const { start, resetState, downloadItems } = setUp({
      retriesUntilDownloadIsReady: 1,
    });
    start({ itemId: defaultItemId });
    await flushPromises(); // initial two calls

    vi.runAllTimers(); // poll once
    await flushPromises();

    expect(downloadItems.value.length).toBe(1);
    expect(downloadItems.value[0]).toStrictEqual({
      status: "READY",
      downloadId: defaultDownloadId,
      itemId: defaultItemId,
      downloadUrl: defaultDownloadUrl,
    });

    resetState();
    await nextTick();
    expect(downloadItems.value.length).toBe(0);
  });

  it("rethrows error if initial calls fail", async () => {
    const { start, downloadItems } = setUp({
      initialCallSucceeds: false,
    });

    await expect(() => start({ itemId: defaultItemId })).rejects.toThrowError();
    expect(downloadItems.value.length).toBe(0);
  });

  it("updates failure info when polling request fails, but does not throw", async () => {
    const { start, downloadItems } = setUp({
      downloadSucceeds: false,
      retriesUntilDownloadIsReady: 1,
    });

    start({ itemId: defaultItemId });
    await flushPromises(); // initial two calls

    vi.runAllTimers(); // poll once
    await flushPromises();

    expect(downloadItems.value.length).toBe(1);
    expect(downloadItems.value[0]).toStrictEqual({
      status: "FAILED",
      downloadId: defaultDownloadId,
      itemId: defaultItemId,
      failureDetails: `Download failed: ${downloadFailedResponse.statusMessage}`,
    });
  });
});
