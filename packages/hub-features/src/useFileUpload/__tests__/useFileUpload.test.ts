import {
  type MockInstance,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
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
    fetchMock
      .mockResponseOnce(
        JSON.stringify({
          items: {
            "mock-file1.txt": { uploadId: "upload1" },
            "mock-file2.txt": { uploadId: "upload2" },
          },
        }),
      )
      .mockResponse(JSON.stringify({ method: "", url: "" }));
  });

  it("should start an upload", async () => {
    const { start, uploadItems } = useFileUpload({ apiBaseUrl: mockAPIUrl });

    start(parentId, [file1, file2]);
    await flushPromises();

    expect(fetchMock).toHaveBeenCalledWith(
      `${mockAPIUrl}/repository/${parentId}/manifest`,
      {
        headers: { "Content-Type": "application/json;charset=UTF8" },
        method: "POST",
        body: JSON.stringify({
          items: {
            "mock-file1.txt": { itemContentType: "text/plain" },
            "mock-file2.txt": { itemContentType: "text/plain" },
          },
        }),
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

    expect(fetchMock).toHaveBeenCalledWith(
      `${mockAPIUrl}/uploads/upload1/parts/?partNumber=1`,
      { method: "POST" },
    );
    expect(fetchMock).toHaveBeenCalledWith(
      `${mockAPIUrl}/uploads/upload2/parts/?partNumber=1`,
      { method: "POST" },
    );
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
        filePartIds: ["part1"],
      });

      await flushPromises();

      expect(onFileUploadComplete).toHaveBeenCalledWith("upload1", ["part1"]);
      expect(fetchMock).toHaveBeenCalledWith(`${mockAPIUrl}/uploads/upload1`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(["part1"]),
      });
    });

    it("should handle failing to complete an upload", async () => {
      fetchMock.mockReset();

      // mute consola
      // @ts-ignore
      consola.error = () => {};

      const apiError = new Error("api error");
      fetchMock
        .mockResponseOnce(
          JSON.stringify({
            items: {
              "mock-file1.txt": { uploadId: "upload1" },
            },
          }),
        )
        .mockResponseOnce(JSON.stringify({ method: "", url: "" }))
        .mockReject(apiError);

      const { start, uploadItems } = useFileUpload({
        apiBaseUrl: mockAPIUrl,
      });

      start(parentId, [file1]);
      await flushPromises();

      mockUseUploadManagerCallbacks.onFileUploadComplete({
        uploadId: "upload1",
        filePartIds: ["part1"],
      });

      expect(fetchMock).toHaveBeenLastCalledWith(
        `${mockAPIUrl}/uploads/upload1`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(["part1"]),
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

    expect(fetchMock).toHaveBeenLastCalledWith(
      `${mockAPIUrl}/uploads/upload1`,
      { method: "DELETE" },
    );

    expect(uploadItems.value).toEqual([
      expect.objectContaining({ id: "upload1", status: "cancelled" }),
      expect.objectContaining({ id: "upload2", status: "inprogress" }),
    ]);
  });
});
