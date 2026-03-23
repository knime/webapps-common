import { useWorkflowGroupStore } from "#imports";
import { describe, expect, it, vi } from "vitest";
import type { MaybeRefOrGetter } from "vue";
import type { Space } from "#shared/repositoryDefinition/catalog";
import { flushPromises } from "@vue/test-utils";
import { createTestingPinia } from "@pinia/testing";

import { rfcErrors } from "@knime/hub-features";

import { toastServiceMock } from "~/__shared/test-utils/mockToastService";
import mountComposable from "~/__shared/test-utils/mountComposable";
import { useMoveOrCopyOperations } from "../useMoveOrCopyOperations";

const { promptCollisionStrategiesMock, promptDestinationMock } = vi.hoisted(
  () => ({
    promptCollisionStrategiesMock: vi.fn(),
    promptDestinationMock: vi.fn(),
  }),
);

vi.mock("~/components/spaceExplorer/usePromptCollisionHandling", () => ({
  usePromptCollisionStrategies: () => ({
    promptCollisionStrategies: promptCollisionStrategiesMock,
  }),
}));

vi.mock(
  "~/components/spaceExplorer/DestinationPicker/useDestinationPicker.ts",
  async (importOriginal) => {
    const actual = await importOriginal();
    return {
      useDestinationPicker: () => ({
        // @ts-expect-error mock
        ...actual.useDestinationPicker(),
        promptDestination: promptDestinationMock,
      }),
    };
  },
);

const operation = "copy";
const item = { id: "1", name: "itemToCopy" };
const path = "/Users/user/my-folder";

const initialCallPayload = {
  operation: "copy",
  ids: [item.id],
  targetCanonicalPath: path,
  force: false,
  suffix: "",
};

const successResult = {
  conflicts: [],
  failed: [],
  succeeded: [{ result: item.id, error: null }],
};

const rfcConflictError = new rfcErrors.RFCError({
  title: "Already exists",
  date: new Date(),
  requestId: "request-id",
  status: 400,
});
const conflict = { result: item.id, rfcError: rfcConflictError };
const conflictResult = {
  conflicts: [conflict],
  failed: [conflict],
  succeeded: [],
};

const rfcError = new rfcErrors.RFCError({
  title: "Copy failed",
  date: new Date(),
  requestId: "request-id",
  status: 400,
});
const errorResult = {
  conflicts: [],
  failed: [{ result: item.id, rfcError }],
  succeeded: [],
};

const successMessage = {
  type: "success",
  headline: "Copied",
  message: "The item has been copied.",
};

describe("useMoveOrCopyOperations", () => {
  type MountOpts = {
    masonControls?: MaybeRefOrGetter<Space["@controls"]>;
    collisionStrategy?: "OVERWRITE" | "CANCEL" | "AUTORENAME";
  };

  const doMount = ({ masonControls, collisionStrategy }: MountOpts = {}) => {
    const testingPinia = createTestingPinia({ createSpy: vi.fn });

    const workflowGroupStore = useWorkflowGroupStore(testingPinia);
    workflowGroupStore.moveOrCopyItems = vi.fn();

    promptCollisionStrategiesMock.mockResolvedValue(collisionStrategy);

    const { getComposableResult } = mountComposable({
      composable: useMoveOrCopyOperations,
      composablePropTypes: {
        masonControls: Object as MaybeRefOrGetter<Space["@controls"]>,
      },
      composableProps: { masonControls },
      piniaInstance: testingPinia,
    });

    return { ...getComposableResult(), workflowGroupStore };
  };

  describe("canCopyItems", () => {
    it("returns true if the user has copy permissions", () => {
      const { canCopyItems } = doMount({
        masonControls: { "knime:copy": {} },
      });

      expect(canCopyItems.value).toBe(true);
    });

    it("returns false if the user doesn't have copy permissions", () => {
      const { canCopyItems } = doMount();

      expect(canCopyItems.value).toBe(false);
    });
  });

  describe("canMoveItems", () => {
    it("returns true if the user has move permissions", () => {
      const { canMoveItems } = doMount({
        masonControls: { "knime:move": {} },
      });

      expect(canMoveItems.value).toBe(true);
    });

    it("returns false if the user doesn't have move permissions", () => {
      const { canMoveItems } = doMount();

      expect(canMoveItems.value).toBe(false);
    });
  });

  describe("copyOrMove - copy operation", () => {
    describe("no conflicts", () => {
      it("copies the item and shows a success toast if operation was successful", async () => {
        const { copyOrMove, workflowGroupStore } = doMount();
        workflowGroupStore.moveOrCopyItems.mockReturnValueOnce(successResult);

        copyOrMove(operation, [item], path);
        await flushPromises();

        expect(workflowGroupStore.moveOrCopyItems).toHaveBeenCalledWith(
          initialCallPayload,
        );
        expect(toastServiceMock.show).toHaveBeenCalledWith(successMessage);
      });

      it("copies the item and shows an error toast if operation failed", async () => {
        const { copyOrMove, workflowGroupStore } = doMount();
        workflowGroupStore.moveOrCopyItems.mockReturnValueOnce({
          conflicts: [],
          failed: [{ result: item.id, rfcError }],
          succeeded: [],
        });

        copyOrMove(operation, [item], path);
        await flushPromises();

        expect(workflowGroupStore.moveOrCopyItems).toHaveBeenCalledWith(
          initialCallPayload,
        );
        expect(toastServiceMock.show).toHaveBeenCalledWith({
          type: "error",
          headline: "1 item couldn’t be copied",
          message: rfcError.message,
        });
      });

      it("copies some items and shows a warning toast if operation partially failed", async () => {
        const { copyOrMove, workflowGroupStore } = doMount();
        workflowGroupStore.moveOrCopyItems.mockReturnValueOnce({
          conflicts: [],
          failed: [{ result: item.id, rfcError }],
          succeeded: [{ result: item.id, error: null }],
        });

        copyOrMove(operation, [item], path);
        await flushPromises();

        expect(workflowGroupStore.moveOrCopyItems).toHaveBeenCalledWith(
          initialCallPayload,
        );
        expect(toastServiceMock.show).toHaveBeenCalledWith({
          type: "warning",
          headline: "1 item copied / 1 failed",
          message: rfcError.message,
        });
      });
    });

    describe("conflicts - OVERWRITE strategy", () => {
      it("overwrites the item and shows a success toast if operation was successful", async () => {
        const { copyOrMove, workflowGroupStore } = doMount({
          collisionStrategy: "OVERWRITE",
        });

        workflowGroupStore.moveOrCopyItems
          .mockReturnValueOnce(conflictResult)
          .mockReturnValueOnce(successResult);

        copyOrMove(operation, [item], path);
        await flushPromises();

        expect(workflowGroupStore.moveOrCopyItems).toHaveBeenNthCalledWith(
          1,
          initialCallPayload,
        );
        expect(workflowGroupStore.moveOrCopyItems).toHaveBeenNthCalledWith(2, {
          operation: "copy",
          ids: [item.id],
          targetCanonicalPath: path,
          force: true,
          suffix: "",
        });
        expect(toastServiceMock.show).toHaveBeenCalledTimes(1);
        expect(toastServiceMock.show).toHaveBeenCalledWith(successMessage);
      });

      it("overwrites the item and shows an error toast if operation failed", async () => {
        const { copyOrMove, workflowGroupStore } = doMount({
          collisionStrategy: "OVERWRITE",
        });

        workflowGroupStore.moveOrCopyItems
          .mockReturnValueOnce(conflictResult)
          .mockReturnValueOnce(errorResult);

        copyOrMove(operation, [item], path);
        await flushPromises();

        expect(workflowGroupStore.moveOrCopyItems).toHaveBeenCalledTimes(2);
        expect(toastServiceMock.show).toHaveBeenCalledTimes(1);
        expect(toastServiceMock.show).toHaveBeenCalledWith({
          type: "error",
          headline: "1 item couldn’t be copied",
          message: "Copy failed",
        });
      });
    });

    describe("conflicts - AUTORENAME strategy", () => {
      it("renames the item and shows a success toast if operation was successful", async () => {
        const { copyOrMove, workflowGroupStore } = doMount({
          collisionStrategy: "AUTORENAME",
        });

        workflowGroupStore.moveOrCopyItems
          .mockReturnValueOnce(conflictResult)
          .mockReturnValueOnce(successResult);

        copyOrMove(operation, [item], path);
        await flushPromises();

        expect(workflowGroupStore.moveOrCopyItems).toHaveBeenNthCalledWith(
          1,
          initialCallPayload,
        );
        expect(workflowGroupStore.moveOrCopyItems).toHaveBeenNthCalledWith(2, {
          operation: "copy",
          ids: [item.id],
          targetCanonicalPath: path,
          force: false,
          suffix: expect.stringMatching(
            /^\s\d{4}-\d{2}-\d{2}_\d{2}-\d{2}-\d{2}$/,
          ),
        });
        expect(toastServiceMock.show).toHaveBeenCalledTimes(1);
        expect(toastServiceMock.show).toHaveBeenCalledWith(successMessage);
      });

      it("renames the item and shows an error toast if operation failed", async () => {
        const { copyOrMove, workflowGroupStore } = doMount({
          collisionStrategy: "AUTORENAME",
        });

        workflowGroupStore.moveOrCopyItems
          .mockReturnValueOnce(conflictResult)
          .mockReturnValueOnce(errorResult);

        copyOrMove(operation, [item], path);
        await flushPromises();

        expect(workflowGroupStore.moveOrCopyItems).toHaveBeenCalledTimes(2);
        expect(toastServiceMock.show).toHaveBeenCalledTimes(1);
        expect(toastServiceMock.show).toHaveBeenCalledWith({
          type: "error",
          headline: "1 item couldn’t be copied",
          message: "Copy failed",
        });
      });
    });

    describe("conflicts - CANCEL strategy", () => {
      it("cancels the operation and doesn't show a toast if no items were copied", async () => {
        const { copyOrMove, workflowGroupStore } = doMount({
          collisionStrategy: "CANCEL",
        });

        workflowGroupStore.moveOrCopyItems.mockReturnValueOnce(conflictResult);

        copyOrMove(operation, [item], path);
        await flushPromises();

        expect(workflowGroupStore.moveOrCopyItems).toHaveBeenCalledWith(
          initialCallPayload,
        );
        expect(toastServiceMock.show).not.toHaveBeenCalled();
      });

      it("cancels the operation and shows an info toast if some items were successfully copied", async () => {
        const { copyOrMove, workflowGroupStore } = doMount({
          collisionStrategy: "CANCEL",
        });

        workflowGroupStore.moveOrCopyItems.mockReturnValueOnce({
          conflicts: [conflict],
          failed: [conflict],
          succeeded: [{ result: "2", error: null }],
        });

        copyOrMove(operation, [item], path);
        await flushPromises();

        expect(workflowGroupStore.moveOrCopyItems).toHaveBeenCalledWith(
          initialCallPayload,
        );
        expect(toastServiceMock.show).toHaveBeenCalledTimes(1);
        expect(toastServiceMock.show).toHaveBeenCalledWith({
          type: "info",
          headline: "Partial copy",
          message: "1 item copied, 1 item skipped due to name conflicts.",
        });
      });
    });
  });

  describe("copyOrMoveAskForDestination - copy operation", () => {
    it("completes the operation if destination picker returns a valid item", async () => {
      const { copyOrMoveAskForDestination, workflowGroupStore } = doMount();
      workflowGroupStore.moveOrCopyItems.mockReturnValueOnce(successResult);

      promptDestinationMock.mockResolvedValueOnce({
        type: "item",
        canonicalPath: path,
        path,
      });

      copyOrMoveAskForDestination(operation, [item], path);
      await flushPromises();

      expect(workflowGroupStore.moveOrCopyItems).toHaveBeenCalledWith(
        initialCallPayload,
      );
      expect(toastServiceMock.show).toHaveBeenCalledWith({
        ...successMessage,
        buttons: [
          {
            text: "Go to my-folder",
            to: "/user/spaces/my-folder/",
          },
        ],
      });
    });

    it("exits early if selected destination is not an item", async () => {
      const { copyOrMoveAskForDestination, workflowGroupStore } = doMount();
      workflowGroupStore.moveOrCopyItems.mockReturnValueOnce(successResult);

      promptDestinationMock.mockResolvedValueOnce({
        type: "group",
        canonicalPath: path,
        path,
      });

      copyOrMoveAskForDestination(operation, [item], path);
      await flushPromises();

      expect(workflowGroupStore.moveOrCopyItems).not.toHaveBeenCalled();
      expect(toastServiceMock.show).not.toHaveBeenCalled();
    });

    it("exits early if selected item has no target canonical path", async () => {
      const { copyOrMoveAskForDestination, workflowGroupStore } = doMount();
      workflowGroupStore.moveOrCopyItems.mockReturnValueOnce(successResult);

      promptDestinationMock.mockResolvedValueOnce({ type: "item", path });

      copyOrMoveAskForDestination(operation, [item], path);
      await flushPromises();

      expect(workflowGroupStore.moveOrCopyItems).not.toHaveBeenCalled();
      expect(toastServiceMock.show).not.toHaveBeenCalled();
    });
  });
});
