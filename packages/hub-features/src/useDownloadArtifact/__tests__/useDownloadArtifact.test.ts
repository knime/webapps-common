import { beforeEach, describe, expect, it, vi } from "vitest";
import { nextTick } from "vue";

import { useDownloadArtifact } from "../useDownloadArtifact";

describe("useDownloadArtifact", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    $ofetchMock.mockResolvedValueOnce({ downloadId: "testDownloadId" });
  });

  const doMount = ({ isDownloadReady = true } = {}) => {
    if (isDownloadReady) {
      $ofetchMock.mockResolvedValueOnce({
        status: "READY",
        downloadUrl: "testDownloadUrl",
      });
    }
    const downloadComposable = useDownloadArtifact({
      maxRetries: 3,
      pollingInterval: 10,
      customFetchClientOptions: { baseURL: "/_/api" },
    });
    const windowOpenSpy = vi.spyOn(window, "open");
    const consolaErrorSpy = vi.spyOn(consola, "error");
    return {
      windowOpenSpy,
      downloadComposable,
      consolaErrorSpy,
    };
  };

  it("sets isDownloading to true and false around downloadArtifact call", async () => {
    const { downloadComposable, windowOpenSpy } = doMount();
    const artifactParams = { itemId: "1234", version: 1 };
    expect(downloadComposable.isDownloading.value).toBe(false);
    const downloadPromise = downloadComposable.downloadArtifact(artifactParams);
    expect(downloadComposable.isDownloading.value).toBe(true);
    await downloadPromise;
    expect(downloadComposable.isDownloading.value).toBe(false);
    expect(windowOpenSpy).toHaveBeenCalledWith("testDownloadUrl", "_parent");
  });

  it("calls ofetch with correct route and query params for the initial request", async () => {
    const { downloadComposable, windowOpenSpy } = doMount();
    const artifactParams = { itemId: "1234", version: 1 };
    const downloadPromise = downloadComposable.downloadArtifact(artifactParams);
    expect(downloadComposable.isDownloading.value).toBe(true);
    await downloadPromise;

    expect($ofetchMock).toHaveBeenCalledTimes(2);
    expect($ofetchMock).toHaveBeenCalledWith(
      "/_/api/repository/1234/artifact",
      {
        method: "GET",
        query: {
          version: 1,
        },
        signal: expect.any(AbortSignal),
      },
    );

    expect($ofetchMock).toHaveBeenCalledWith(
      "/_/api/downloads/testDownloadId/status",
      {
        method: "GET",
        signal: expect.any(AbortSignal),
      },
    );

    expect(windowOpenSpy).toHaveBeenCalledWith("testDownloadUrl", "_parent");
    expect(downloadComposable.isDownloading.value).toBe(false);
  });

  it("poll fetch until the download is ready", async () => {
    const { downloadComposable, windowOpenSpy } = doMount({
      isDownloadReady: false,
    });
    const artifactParams = { itemId: "1234", version: 1 };
    const downloadPromise = downloadComposable.downloadArtifact(artifactParams);
    expect(downloadComposable.isDownloading.value).toBe(true);

    expect($ofetchMock).toHaveBeenCalledWith(
      "/_/api/repository/1234/artifact",
      {
        method: "GET",
        query: {
          version: 1,
        },
        signal: expect.any(AbortSignal),
      },
    );
    expect($ofetchMock).toHaveBeenCalledTimes(1);
    await nextTick();
    expect($ofetchMock).toHaveBeenCalledWith(
      "/_/api/downloads/testDownloadId/status",
      {
        method: "GET",
        signal: expect.any(AbortSignal),
      },
    );
    expect($ofetchMock).toHaveBeenCalledTimes(2);
    expect(windowOpenSpy).not.toBeCalled();

    $ofetchMock.mockResolvedValueOnce({
      status: "READY",
      downloadUrl: "testDownloadUrl",
    });
    await downloadPromise;
    expect($ofetchMock).toHaveBeenCalledTimes(3);
    expect(windowOpenSpy).toHaveBeenCalledWith("testDownloadUrl", "_parent");
  });
});
