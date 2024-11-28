import {
  type MockInstance,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { nextTick } from "vue";
import { flushPromises } from "@vue/test-utils";

import type { useUploadManager } from "@knime/components";
import { promise } from "@knime/utils";

import { useFileUpload } from "../useFileUpload";

type UseUploadManagerOptions = Parameters<typeof useUploadManager>[0];

type Callbacks = Required<
  Pick<UseUploadManagerOptions, "onFileUploadComplete" | "onFileUploadFailed">
>;

const mockUseUploadManagerCallbacks: Callbacks = {
  onFileUploadComplete: () => Promise.resolve(),
  onFileUploadFailed: () => {},
};

let setFailedSpy: MockInstance;

vi.mock("@knime/components", async (importOriginal) => {
  const actual = (await importOriginal()) as {
    useUploadManager: typeof useUploadManager;
  };

  return {
    useUploadManager: (params: UseUploadManagerOptions) => {
      mockUseUploadManagerCallbacks.onFileUploadComplete =
        params.onFileUploadComplete!;
      mockUseUploadManagerCallbacks.onFileUploadFailed =
        params.onFileUploadFailed!;

      const uploadManager = actual.useUploadManager(params);

      setFailedSpy = vi.spyOn(uploadManager, "setFailed");

      return uploadManager;
    },
  };
});

vi.mock("@knime/utils", async (importOriginal) => {
  const actual = (await importOriginal()) as any;

  return {
    ...actual,
    promise: {
      retryPromise: vi.fn((fn: () => any) => fn()),
    },
  };
});

describe("useFileUpload", () => {
  const parentId = "some-container-for-the-upload";
  const fileSize = new Array(10).fill("A"); // 10 bytes

  const file1 = new File(fileSize, "mock-file1.txt", { type: "text/plain" });
  const file2 = new File(fileSize, "mock-file2.txt", { type: "text/plain" });

  const mockAPIUrl = "http://myapi.com";

  beforeEach(() => {
    $ofetchMock
      .mockResolvedValueOnce({
        items: {
          "mock-file1.txt": { uploadId: "upload1" },
          "mock-file2.txt": { uploadId: "upload2" },
        },
      })
      .mockResolvedValue(JSON.stringify({ method: "", url: "" }));
  });

  it("should start an upload", async () => {
    const { start, uploadItems } = useFileUpload({ apiBaseUrl: mockAPIUrl });

    start(parentId, [file1, file2]);
    await flushPromises();

    expect($ofetchMock).toHaveBeenCalledWith(
      `${mockAPIUrl}/repository/${parentId}/manifest`,
      {
        method: "POST",
        body: {
          items: {
            "mock-file1.txt": {
              itemContentType: "text/plain",
              itemContentSize: file1.size,
            },
            "mock-file2.txt": {
              itemContentType: "text/plain",
              itemContentSize: file2.size,
            },
          },
        },
      },
    );

    expect(uploadItems.value).toEqual([
      {
        id: "upload1",
        name: "mock-file1.txt",
        size: 10,
        progress: 0,
        status: "inprogress",
        parentId,
      },
      {
        id: "upload2",
        name: "mock-file2.txt",
        size: 10,
        progress: 0,
        status: "inprogress",
        parentId,
      },
    ]);

    expect($ofetchMock).toHaveBeenCalledWith(
      `${mockAPIUrl}/uploads/upload1/parts/?partNumber=1`,
      { method: "POST" },
    );
    expect($ofetchMock).toHaveBeenCalledWith(
      `${mockAPIUrl}/uploads/upload2/parts/?partNumber=1`,
      { method: "POST" },
    );
  });

  it("should handle prepare state", async () => {
    $ofetchMock
      .mockResolvedValueOnce({
        items: {
          "mock-file1.txt": { uploadId: "upload1" },
          "mock-file2.txt": { uploadId: "upload2" },
        },
      })
      .mockResolvedValueOnce({
        items: {
          "mock-file1.txt": { uploadId: "upload3" },
          "mock-file2.txt": { uploadId: "upload4" },
        },
      });

    const { start, isPreparingUpload, totalFilesBeingPrepared } = useFileUpload(
      { apiBaseUrl: mockAPIUrl },
    );

    start(parentId, [file1, file2]);

    expect(isPreparingUpload.value).toBe(true);
    expect(totalFilesBeingPrepared.value).toBe(2);

    start(parentId, [file1, file2]);

    await nextTick();

    expect(isPreparingUpload.value).toBe(true);
    expect(totalFilesBeingPrepared.value).toBe(4);

    await flushPromises();

    expect(isPreparingUpload.value).toBe(false);
    expect(totalFilesBeingPrepared.value).toBe(0);
  });

  it("should return properties for pending state", async () => {
    $ofetchMock.mockResolvedValueOnce({
      items: {
        "mock-file1.txt": { uploadId: "upload1" },
        "mock-file2.txt": { uploadId: "upload2" },
      },
    });

    const { start, hasPendingUploads, totalPendingUploads } = useFileUpload({
      apiBaseUrl: mockAPIUrl,
    });

    start(parentId, [file1, file2]);
    await flushPromises();

    expect(hasPendingUploads.value).toBe(true);
    expect(totalPendingUploads.value).toBe(2);
  });

  describe("completing upload", () => {
    it("should handle successful completion of an upload", async () => {
      const onFileUploadComplete = vi.fn();
      const { start } = useFileUpload({
        apiBaseUrl: mockAPIUrl,
        onFileUploadComplete,
      });

      start(parentId, [file1, file2]);
      await flushPromises();

      mockUseUploadManagerCallbacks.onFileUploadComplete({
        uploadId: "upload1",
        filePartIds: { 1: "part1" },
      });

      await flushPromises();

      expect(onFileUploadComplete).toHaveBeenCalledWith("upload1", {
        1: "part1",
      });
      expect($ofetchMock).toHaveBeenCalledWith(
        `${mockAPIUrl}/uploads/upload1`,
        {
          method: "POST",
          body: { 1: "part1" },
        },
      );
    });

    it("should handle failing to complete an upload", async () => {
      $ofetchMock.mockReset();

      // mute consola
      // @ts-ignore
      consola.error = () => {};

      const apiError = new Error("api error");
      $ofetchMock
        .mockResolvedValueOnce({
          items: {
            "mock-file1.txt": { uploadId: "upload1" },
          },
        })
        .mockResolvedValueOnce({ method: "", url: "" })
        .mockRejectedValue(apiError);

      const { start, uploadItems } = useFileUpload({
        apiBaseUrl: mockAPIUrl,
      });

      start(parentId, [file1]);
      await flushPromises();

      mockUseUploadManagerCallbacks.onFileUploadComplete({
        uploadId: "upload1",
        filePartIds: { 1: "part1" },
      });

      expect($ofetchMock).toHaveBeenLastCalledWith(
        `${mockAPIUrl}/uploads/upload1`,
        {
          method: "POST",
          body: { 1: "part1" },
        },
      );

      await flushPromises();
      expect(setFailedSpy).toHaveBeenCalledWith("upload1", apiError);
      expect(uploadItems.value).toEqual([
        {
          id: "upload1",
          name: "mock-file1.txt",
          size: 10,
          progress: 0,
          status: "failed",
          parentId,
          failureDetails: "api error",
        },
      ]);
      expect(promise.retryPromise).toHaveBeenCalled();
    });
  });

  it("should forward call of `onFileUploadFailed`", async () => {
    const onFileUploadFailed = vi.fn();
    const { start } = useFileUpload({
      apiBaseUrl: mockAPIUrl,
      onFileUploadFailed,
    });

    start(parentId, [file1, file2]);
    await flushPromises();

    const someError = new Error();
    mockUseUploadManagerCallbacks.onFileUploadFailed("upload1", someError);

    expect(onFileUploadFailed).toHaveBeenCalledWith("upload1", someError);
  });

  it("should cancel an upload", async () => {
    const { start, uploadItems, cancel } = useFileUpload({
      apiBaseUrl: mockAPIUrl,
    });

    start(parentId, [file1, file2]);
    await flushPromises();

    cancel("upload1");

    expect($ofetchMock).toHaveBeenLastCalledWith(
      `${mockAPIUrl}/uploads/upload1`,
      {
        method: "DELETE",
      },
    );

    expect(uploadItems.value).toEqual([
      expect.objectContaining({ id: "upload1", status: "cancelled" }),
      expect.objectContaining({ id: "upload2", status: "inprogress" }),
    ]);
  });

  it("should handle upload queue size", async () => {
    const onUploadQueueSizeExceeded = vi.fn();
    const { start } = useFileUpload({
      apiBaseUrl: mockAPIUrl,
      maxUploadQueueSize: 2,
      onUploadQueueSizeExceeded,
    });

    start(parentId, [file1, file2]);
    await flushPromises();

    expect(onUploadQueueSizeExceeded).not.toHaveBeenCalled();
    // clear mock before second upload attempt
    $ofetchMock.mockClear();

    start(parentId, [file1, file2]);
    await flushPromises();

    expect($ofetchMock).not.toHaveBeenCalled();
    expect(onUploadQueueSizeExceeded).toHaveBeenCalledWith(2);
  });
});
