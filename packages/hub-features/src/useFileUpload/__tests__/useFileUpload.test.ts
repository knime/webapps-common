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
import { knimeFileFormats, promise } from "@knime/utils";

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
      retryPromise: vi.fn(({ fn }: { fn: () => any }) => fn()),
    },
  };
});

describe("useFileUpload", () => {
  const parentId = "some-container-for-the-upload";
  const fileSize = new Array(10).fill("A"); // 10 bytes

  const file1 = new File(fileSize, "mock-file1.txt", { type: "text/plain" });
  const file2 = new File(fileSize, "mock-file2.txt", { type: "text/plain" });
  const wfFile = new File(
    fileSize,
    `mock-workflow.${knimeFileFormats.KNWF.extension}`,
    { type: knimeFileFormats.KNWF.mimeType },
  );

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
    const { start, uploadItems } = useFileUpload({
      customFetchClientOptions: { baseURL: mockAPIUrl },
    });

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

  describe("prepare upload", () => {
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

      const { start, isPreparingUpload, totalFilesBeingPrepared } =
        useFileUpload({ customFetchClientOptions: { baseURL: mockAPIUrl } });

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

    it("should remove extension for .knwf files", async () => {
      $ofetchMock
        .mockReset()
        .mockResolvedValueOnce({
          items: {
            "mock-file1.txt": { uploadId: "upload1" },
            "mock-workflow": { uploadId: "upload2" },
          },
        })
        .mockResolvedValue(JSON.stringify({ method: "", url: "" }));
      const { start } = useFileUpload({
        customFetchClientOptions: { baseURL: mockAPIUrl },
      });

      start(parentId, [file1, wfFile]);
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
              "mock-workflow": {
                itemContentType: knimeFileFormats.KNWF.mimeType,
                itemContentSize: wfFile.size,
              },
            },
          },
        },
      );
    });

    it("should handle prepare state on prepare failure", async () => {
      (promise.retryPromise as any).mockRejectedValueOnce(
        new Error("Whoopsie"),
      );

      const { start, isPreparingUpload, totalFilesBeingPrepared } =
        useFileUpload({ customFetchClientOptions: { baseURL: mockAPIUrl } });

      await expect(() =>
        start(parentId, [file1, file2]),
      ).rejects.toThrowError();

      expect(isPreparingUpload.value).toBe(false);
      expect(totalFilesBeingPrepared.value).toBe(0);
    });
  });

  it("should return properties for pending state", async () => {
    $ofetchMock.mockResolvedValueOnce({
      items: {
        "mock-file1.txt": { uploadId: "upload1" },
        "mock-file2.txt": { uploadId: "upload2" },
      },
    });

    const { start, hasPendingUploads, totalPendingUploads } = useFileUpload({
      customFetchClientOptions: { baseURL: mockAPIUrl },
    });

    start(parentId, [file1, file2]);
    await flushPromises();

    expect(hasPendingUploads.value).toBe(true);
    expect(totalPendingUploads.value).toBe(2);
  });

  describe("uploads with processing state", () => {
    beforeEach(() => {
      $ofetchMock.mockReset();
      $ofetchMock
        .mockResolvedValueOnce({
          items: { "mock-workflow": { uploadId: "upload1" } },
        })
        .mockResolvedValueOnce(JSON.stringify({ method: "", url: "" }))
        .mockResolvedValueOnce(null);
    });

    it("should add uploadId to unprocessedUploads when starting upload for file with processing step", async () => {
      const { start, unprocessedUploads } = useFileUpload({
        customFetchClientOptions: { baseURL: mockAPIUrl },
      });

      expect(unprocessedUploads.size).toBe(0);

      start(parentId, [wfFile]);
      await flushPromises();

      expect(unprocessedUploads.size).toBe(1);
    });

    it("does not add uploadId to unprocessedUploads when starting upload for file without processing step", async () => {
      $ofetchMock.mockReset();
      $ofetchMock
        .mockResolvedValueOnce({
          items: { "mock-file1.txt": { uploadId: "upload1" } },
        })
        .mockResolvedValueOnce(JSON.stringify({ method: "", url: "" }))
        .mockResolvedValueOnce(null);
      const { start, unprocessedUploads } = useFileUpload({
        customFetchClientOptions: { baseURL: mockAPIUrl },
      });

      expect(unprocessedUploads.size).toBe(0);

      start(parentId, [file1]);
      await flushPromises();

      expect(unprocessedUploads.size).toBe(0);
    });

    it("setProcessingCompleted should update item state accordingly", async () => {
      const { start, unprocessedUploads, setProcessingCompleted } =
        useFileUpload({
          customFetchClientOptions: { baseURL: mockAPIUrl },
        });

      expect(unprocessedUploads.size).toBe(0);

      start(parentId, [wfFile]);
      await flushPromises();

      expect(unprocessedUploads.size).toBe(1);

      mockUseUploadManagerCallbacks.onFileUploadComplete({
        uploadId: "upload1",
        filePartIds: { 1: "part1" },
        parentId,
      });

      await flushPromises();
      setProcessingCompleted({ uploadId: "upload1" });
      await nextTick();
      expect(unprocessedUploads.size).toBe(0);
    });

    it("setProcessingFailed should update item state accordingly", async () => {
      const { start, unprocessedUploads, setProcessingFailed } = useFileUpload({
        customFetchClientOptions: { baseURL: mockAPIUrl },
      });

      expect(unprocessedUploads.size).toBe(0);

      start(parentId, [wfFile]);
      await flushPromises();

      expect(unprocessedUploads.size).toBe(1);

      mockUseUploadManagerCallbacks.onFileUploadComplete({
        uploadId: "upload1",
        filePartIds: { 1: "part1" },
        parentId,
      });

      await flushPromises();
      setProcessingFailed({ uploadId: "upload1" });
      await nextTick();
      expect(unprocessedUploads.size).toBe(0);
    });
  });

  describe("completing upload", () => {
    it("should handle successful completion of an upload", async () => {
      const onFileUploadComplete = vi.fn();
      const { start } = useFileUpload({
        customFetchClientOptions: { baseURL: mockAPIUrl },
        onFileUploadComplete,
      });

      start(parentId, [file1, file2]);
      await flushPromises();

      mockUseUploadManagerCallbacks.onFileUploadComplete({
        uploadId: "upload1",
        filePartIds: { 1: "part1" },
        parentId,
      });

      await flushPromises();

      expect(onFileUploadComplete).toHaveBeenCalledWith({
        uploadId: "upload1",
        filePartIds: {
          1: "part1",
        },
        parentId,
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
      // @ts-expect-error Property 'raw' is missing in type '() => void' but required in type 'LogFn'
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
        customFetchClientOptions: { baseURL: mockAPIUrl },
      });

      start(parentId, [file1]);
      await flushPromises();

      mockUseUploadManagerCallbacks.onFileUploadComplete({
        uploadId: "upload1",
        filePartIds: { 1: "part1" },
        parentId,
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
      customFetchClientOptions: { baseURL: mockAPIUrl },
      onFileUploadFailed,
    });

    start(parentId, [file1, file2]);
    await flushPromises();

    const someError = new Error();
    mockUseUploadManagerCallbacks.onFileUploadFailed({
      uploadId: "upload1",
      error: someError,
      parentId,
    });

    expect(onFileUploadFailed).toHaveBeenCalledWith({
      uploadId: "upload1",
      error: someError,
      parentId,
    });
  });

  it("should cancel an upload", async () => {
    const { start, uploadItems, cancel } = useFileUpload({
      customFetchClientOptions: { baseURL: mockAPIUrl },
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
      customFetchClientOptions: { baseURL: mockAPIUrl },
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
