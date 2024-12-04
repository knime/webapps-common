import { afterEach, describe, expect, it, vi } from "vitest";
import { flushPromises } from "@vue/test-utils";

import type { UploadManagerNS } from "@knime/utils";

import { useUploadManager } from "../useUploadManager";

const uploadManagerMock = {
  uploadFiles: vi.fn(),
  cancel: vi.fn(),
  setFailed: vi.fn(),
};

// use the config injected to the uploadManager as a way to trigger callbacks
let uploadManagerConfig: UploadManagerNS.UploaderConfig;

vi.mock("@knime/utils", async (importOriginal) => {
  const actual = (await importOriginal()) as any;

  return {
    ...actual,
    uploadManager: {
      createUploadManager: vi.fn((injectedConfig) => {
        uploadManagerConfig = injectedConfig;
        return uploadManagerMock;
      }),
    },
    promise: {
      retryPromise: ({ fn }: { fn: () => any }) => fn(),
    },
  };
});

describe("useUploadManager", () => {
  const parentId = "some-container-for-the-upload";
  const fileSize = new Array(10).fill("A"); // 10 bytes

  const file1 = new File(fileSize, "mock-file1.txt", { type: "text/plain" });
  const file2 = new File(fileSize, "mock-file2.txt", { type: "text/plain" });

  const resolveFilePartUploadURL = () =>
    Promise.resolve({ method: "", url: "" });

  afterEach(() => {
    vi.clearAllMocks();
  });

  type Options = Partial<Parameters<typeof useUploadManager>[0]>;

  const setup = async (options: Options = {}) => {
    const composableResult = useUploadManager({
      resolveFilePartUploadURL,
      ...options,
    });

    const payload = [
      { uploadId: "1", file: file1 },
      { uploadId: "2", file: file2 },
    ];

    composableResult.start(parentId, payload);
    await flushPromises();

    return composableResult;
  };

  it("should start an upload", async () => {
    const { uploadItems } = await setup();

    expect(uploadItems.value).toEqual([
      {
        id: "1",
        name: "mock-file1.txt",
        size: 10,
        progress: 0,
        status: "inprogress",
        parentId,
      },
      {
        id: "2",
        name: "mock-file2.txt",
        size: 10,
        progress: 0,
        status: "inprogress",
        parentId,
      },
    ]);
    expect(uploadManagerMock.uploadFiles).toHaveBeenCalledWith([
      { uploadId: "1", file: file1 },
      { uploadId: "2", file: file2 },
    ]);
    expect(uploadManagerConfig.resolveFilePartUploadURL).toBe(
      resolveFilePartUploadURL,
    );
  });

  it("should update progress of an upload", async () => {
    const { uploadItems } = await setup();

    expect(uploadItems.value).toEqual([
      expect.objectContaining({ id: "1", progress: 0 }),
      expect.objectContaining({ id: "2", progress: 0 }),
    ]);

    uploadManagerConfig.onProgress?.("1", 30);

    expect(uploadItems.value).toEqual([
      expect.objectContaining({ id: "1", progress: 30 }),
      expect.objectContaining({ id: "2", progress: 0 }),
    ]);

    uploadManagerConfig.onProgress?.("2", 90);

    expect(uploadItems.value).toEqual([
      expect.objectContaining({ id: "1", progress: 30 }),
      expect.objectContaining({ id: "2", progress: 90 }),
    ]);
  });

  it("should update cancellation state", async () => {
    const { uploadItems, cancel } = await setup();

    expect(uploadItems.value).toEqual([
      expect.objectContaining({ id: "1", status: "inprogress" }),
      expect.objectContaining({ id: "2", status: "inprogress" }),
    ]);

    cancel("1");
    expect(uploadManagerMock.cancel).toHaveBeenCalledWith("1");

    expect(uploadItems.value).toEqual([
      expect.objectContaining({ id: "1", status: "cancelled" }),
      expect.objectContaining({ id: "2", status: "inprogress" }),
    ]);
  });

  it("should handle `setFailed`", async () => {
    const { uploadItems, setFailed } = await setup();

    expect(uploadItems.value).toEqual([
      expect.objectContaining({ id: "1", status: "inprogress" }),
      expect.objectContaining({ id: "2", status: "inprogress" }),
    ]);

    const error = new Error("this is an error");
    setFailed("1", error);
    expect(uploadManagerMock.setFailed).toHaveBeenCalledWith("1", error);

    expect(uploadItems.value).toEqual([
      expect.objectContaining({
        id: "1",
        status: "failed",
        failureDetails: "this is an error",
      }),
      expect.objectContaining({ id: "2", status: "inprogress" }),
    ]);
  });

  it("should update completion state", async () => {
    const onComplete = vi.fn();
    const { uploadItems } = await setup({
      onFileUploadComplete: onComplete,
    });

    expect(uploadItems.value).toEqual([
      expect.objectContaining({ id: "1", status: "inprogress" }),
      expect.objectContaining({ id: "2", status: "inprogress" }),
    ]);

    uploadManagerConfig.onFileUploadComplete?.({
      uploadId: "1",
      filePartIds: ["part1", "part2"],
    });

    expect(onComplete).toHaveBeenCalledWith({
      uploadId: "1",
      filePartIds: ["part1", "part2"],
    });

    expect(uploadItems.value).toEqual([
      expect.objectContaining({ id: "1", status: "complete" }),
      expect.objectContaining({ id: "2", status: "inprogress" }),
    ]);
  });

  it("should update failed state", async () => {
    const onFailed = vi.fn();
    const { uploadItems } = await setup({
      onFileUploadFailed: onFailed,
    });

    expect(uploadItems.value).toEqual([
      expect.objectContaining({ id: "1", status: "inprogress" }),
      expect.objectContaining({ id: "2", status: "inprogress" }),
    ]);

    const error = new Error("this is an error");
    uploadManagerConfig.onFileUploadFailed?.("1", error);

    expect(onFailed).toHaveBeenCalledWith("1", error);

    expect(uploadItems.value).toEqual([
      expect.objectContaining({
        id: "1",
        status: "failed",
        failureDetails: "this is an error",
      }),
      expect.objectContaining({ id: "2", status: "inprogress" }),
    ]);
  });

  it("should allow resetting state", async () => {
    const { uploadItems, resetState } = await setup();

    expect(uploadItems.value.length).toBe(2);
    resetState();
    expect(uploadItems.value.length).toBe(0);
  });

  it("should remove an upload item", async () => {
    const { uploadItems, removeItem, cancel } = await setup();

    cancel("1");
    expect(uploadItems.value).toEqual([
      expect.objectContaining({ id: "1", status: "cancelled" }),
      expect.objectContaining({ id: "2", status: "inprogress" }),
    ]);

    // item 1 has already been cancelled
    removeItem("1");
    expect(uploadManagerMock.cancel).toHaveBeenCalledOnce();
    expect(uploadManagerMock.cancel).toHaveBeenLastCalledWith("1");

    // item 1 is removed
    expect(uploadItems.value).toEqual([
      expect.objectContaining({ id: "2", status: "inprogress" }),
    ]);

    // remove item 2 which is in progress
    removeItem("2");
    expect(uploadManagerMock.cancel).toHaveBeenCalledTimes(2);
    expect(uploadManagerMock.cancel).toHaveBeenLastCalledWith("2");

    expect(uploadItems.value).toEqual([]);
  });
});
