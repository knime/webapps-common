/* eslint-disable vitest/no-disabled-tests */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { newServer } from "mock-xmlhttprequest";

import { createUploadManager } from "..";

describe("uploadManager", () => {
  const fiftyBytes = new Array(50).fill("A");

  const file = new File(fiftyBytes, "mock-file.txt", {
    type: "text/plain",
  });

  type MockXHRHandler = NonNullable<Parameters<typeof newServer>[0]>[string][1];

  const defaultUploadPartResponse: MockXHRHandler = {
    // status: 200 is the default
    headers: { "Content-Type": "application/json", Etag: '"partId"' },
    body: "{}",
  };

  type Options = {
    uploadPartResponse?: MockXHRHandler;
  };

  const setup = ({ uploadPartResponse }: Options = {}) => {
    const server = newServer({
      put: ["/success", uploadPartResponse ?? defaultUploadPartResponse],
    });

    server.install();

    return { server };
  };

  const mockUploadURLMetadata = { method: "PUT", url: "/success" };
  const resolveFilePartUploadURL = vi.fn();

  beforeEach(() => {
    resolveFilePartUploadURL.mockImplementation(() =>
      Promise.resolve(mockUploadURLMetadata),
    );
  });

  const createIdGenerator = () => {
    const generator = (function* () {
      let id = 0;
      while (true) {
        yield id++;
      }
    })();

    return () => `mock-upload--${generator.next().value}`;
  };

  const getUploadId = createIdGenerator();

  describe("success", () => {
    it("should handle `uploadFiles`", async () => {
      setup();
      const { uploadFiles } = createUploadManager({
        resolveFilePartUploadURL,
      });

      const uploadId = getUploadId();
      const { completed, failed, cancelled } = await uploadFiles([
        { uploadId, file },
      ]);

      expect(completed).toEqual([uploadId]);
      expect(failed.length).toBe(0);
      expect(cancelled.length).toBe(0);
      expect(resolveFilePartUploadURL).toHaveBeenCalled();
    });

    it("should succeed if resolveFilePartUrl is retried successfully", async () => {
      let callCount = 0;
      resolveFilePartUploadURL.mockImplementation(() => {
        callCount++;
        if (callCount < 2) {
          return Promise.reject(new Error("error that will be retried"));
        }

        return Promise.resolve(mockUploadURLMetadata);
      });

      setup();
      const { uploadFiles } = createUploadManager({
        resolveFilePartUploadURL,
      });

      const uploadId = getUploadId();
      const { completed, failed, cancelled } = await uploadFiles([
        { uploadId, file },
      ]);

      expect(completed).toEqual([uploadId]);
      expect(failed.length).toBe(0);
      expect(cancelled.length).toBe(0);
      expect(resolveFilePartUploadURL).toHaveBeenCalled();
    });

    it("should succeed if uploadPart request is retried successfully", async () => {
      let callCount = 0;
      setup({
        uploadPartResponse: (request) => {
          callCount++;
          if (callCount <= 3) {
            request.respond(400, {});
          }

          request.respond(200, { Etag: '"partId"' });
        },
      });

      const uploadId = getUploadId();
      const { uploadFiles } = createUploadManager({
        resolveFilePartUploadURL,
      });

      const { completed, failed, cancelled } = await uploadFiles([
        { uploadId, file },
      ]);

      expect(completed).toEqual([uploadId]);
      expect(failed.length).toBe(0);
      expect(cancelled.length).toBe(0);
      expect(resolveFilePartUploadURL).toHaveBeenCalled();
    });
  });

  describe("callbacks", () => {
    it("should call onFileUploadComplete", async () => {
      setup();
      const onComplete = vi.fn();
      const onFailed = vi.fn();
      const { uploadFiles } = createUploadManager({
        resolveFilePartUploadURL,
        onFileUploadComplete: onComplete,
        onFileUploadFailed: onFailed,
      });

      const uploadId1 = getUploadId();
      const uploadId2 = getUploadId();

      const { completed, failed, cancelled } = await uploadFiles([
        { uploadId: uploadId1, file },
        { uploadId: uploadId2, file },
      ]);

      expect(completed).toEqual([uploadId1, uploadId2]);
      expect(failed.length).toBe(0);
      expect(cancelled.length).toBe(0);
      expect(onComplete).toHaveBeenCalledWith({
        uploadId: uploadId1,
        filePartIds: { 1: "partId" },
      });
      expect(onComplete).toHaveBeenCalledWith({
        uploadId: uploadId2,
        filePartIds: { 1: "partId" },
      });
      expect(onFailed).not.toHaveBeenCalled();
    });

    it("should call onFileUploadFailed", async () => {
      setup({
        uploadPartResponse: (request) => {
          request.respond(400, {});
        },
      });
      const onComplete = vi.fn();
      const onFailed = vi.fn();
      const { uploadFiles } = createUploadManager({
        resolveFilePartUploadURL,
        onFileUploadComplete: onComplete,
        onFileUploadFailed: onFailed,
      });

      const uploadId1 = getUploadId();
      const uploadId2 = getUploadId();
      const { completed, failed, cancelled } = await uploadFiles([
        { uploadId: uploadId1, file },
        { uploadId: uploadId2, file },
      ]);

      expect(completed.length).toBe(0);
      expect(failed).toEqual([uploadId1, uploadId2]);
      expect(cancelled.length).toBe(0);
      expect(onFailed).toHaveBeenCalledWith(uploadId1);
      expect(onFailed).toHaveBeenCalledWith(uploadId2);
      expect(onComplete).not.toHaveBeenCalled();
    });

    it("should call onProgress callback", async () => {
      setup();
      const onProgress = vi.fn();

      const { uploadFiles } = createUploadManager({
        resolveFilePartUploadURL,
        onProgress,
      });

      await uploadFiles([{ uploadId: getUploadId(), file }]);

      expect(onProgress).toHaveBeenCalled();
    });
  });

  describe("cancellation", () => {
    it("should handle cancellation", async () => {
      setup();
      const { uploadFiles, cancel } = createUploadManager({
        resolveFilePartUploadURL,
      });

      const uploadId = getUploadId();
      const upload = uploadFiles([{ uploadId, file }]);

      cancel(uploadId);

      const { completed, cancelled, failed } = await upload;
      expect(completed.length).toBe(0);
      expect(cancelled).toEqual([uploadId]);
      expect(failed.length).toBe(0);
    });
  });

  describe("failures", () => {
    it("should fail when resolving upload url fails", async () => {
      resolveFilePartUploadURL.mockImplementation(() =>
        Promise.reject(new Error("error")),
      );

      setup();
      const { uploadFiles } = createUploadManager({
        resolveFilePartUploadURL,
      });

      const uploadId = getUploadId();
      const { completed, failed, cancelled } = await uploadFiles([
        { uploadId, file },
      ]);

      expect(completed.length).toBe(0);
      expect(failed).toEqual([uploadId]);
      expect(cancelled.length).toBe(0);
      expect(resolveFilePartUploadURL).toHaveBeenCalled();
    });

    it("should fail when uploading part request fails", async () => {
      setup({
        uploadPartResponse: (request) => {
          request.respond(400, {});
        },
      });

      const { uploadFiles } = createUploadManager({
        resolveFilePartUploadURL,
      });

      const uploadId = getUploadId();

      const { completed, failed, cancelled } = await uploadFiles([
        { uploadId, file },
      ]);

      expect(completed.length).toBe(0);
      expect(failed).toEqual([uploadId]);
      expect(cancelled.length).toBe(0);
      expect(resolveFilePartUploadURL).toHaveBeenCalled();
    });

    it("should fail when etag is missing from upload part response", async () => {
      setup({
        uploadPartResponse: (request) => {
          request.respond(200, {});
        },
      });

      const { uploadFiles } = createUploadManager({
        resolveFilePartUploadURL,
      });

      const uploadId = getUploadId();

      const { completed, failed, cancelled } = await uploadFiles([
        { uploadId, file },
      ]);

      expect(completed.length).toBe(0);
      expect(failed).toEqual([uploadId]);
      expect(cancelled.length).toBe(0);
      expect(resolveFilePartUploadURL).toHaveBeenCalled();
    });
  });
});
