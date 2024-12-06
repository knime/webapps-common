import { describe, expect, it, vi } from "vitest";

import {
  type SelectionEventPayload,
  type UIExtensionServiceConfig,
} from "@knime/ui-extension-renderer/api";
import { setUpCustomEmbedderService } from "@knime/ui-extension-renderer/testing";

import { SelectionService } from "../SelectionService";

import { extensionConfig } from "./mocks";

describe("SelectionService", () => {
  const constructSelectionService = (
    extensionConfig: UIExtensionServiceConfig,
  ) => {
    const apiLayer = {
      updateDataPointSelection: vi.fn(),
      getConfig: () => extensionConfig,
      sendAlert: vi.fn(),
    };
    const embedder = setUpCustomEmbedderService(apiLayer);
    const selectionService = new SelectionService(embedder.service);
    return {
      selectionService,
      dispatchPushEvent: embedder.dispatchPushEvent,
      ...apiLayer,
    };
  };

  describe("initialization", () => {
    it("creates selection service", () => {
      const { selectionService } = constructSelectionService(extensionConfig);

      expect(selectionService).toHaveProperty("add");
      expect(selectionService).toHaveProperty("remove");
      expect(selectionService).toHaveProperty("replace");
      expect(selectionService).toHaveProperty("addOnSelectionChangeCallback");
      expect(selectionService).toHaveProperty(
        "removeOnSelectionChangeCallback",
      );
      expect(selectionService).toHaveProperty("publishOnSelectionChange");
    });
  });

  describe("methods", () => {
    it("calls selection service add/remove/replace methods with correct params", async () => {
      const { selectionService, updateDataPointSelection } =
        constructSelectionService(extensionConfig);

      updateDataPointSelection.mockReturnValue(
        Promise.resolve(new Promise((res) => res({ result: "[]" }))),
      );
      const params = ["row1", "row2", "row3"];
      await selectionService.add(params);

      const idParams = {
        nodeId: extensionConfig.nodeId,
        projectId: extensionConfig.projectId,
        workflowId: extensionConfig.workflowId,
      };

      expect(updateDataPointSelection.mock.calls[0][0]).toStrictEqual({
        mode: "ADD",
        selection: params,
        ...idParams,
      });

      await selectionService.remove(params);
      expect(updateDataPointSelection.mock.calls[1][0]).toStrictEqual({
        mode: "REMOVE",
        selection: params,
        ...idParams,
      });
      await selectionService.replace(params);
      expect(updateDataPointSelection.mock.calls[2][0]).toStrictEqual({
        mode: "REPLACE",
        selection: params,
        ...idParams,
      });
    });

    const selectionPayload: SelectionEventPayload = {
      ...extensionConfig,
      mode: "ADD",
      selection: ["a", "c"],
    };

    it("sends an alert if the selection result contains an error", () => {
      const { selectionService, sendAlert, dispatchPushEvent } =
        constructSelectionService(extensionConfig);

      selectionService.addOnSelectionChangeCallback(vi.fn());
      const error = "some error";
      dispatchPushEvent({
        eventType: "SelectionEvent",
        payload: {
          ...selectionPayload,
          error,
          selection: null,
        },
      });
      expect(sendAlert).toHaveBeenCalledWith({
        message: "some error",
        type: "error",
      });
    });

    it("adds callback to event with addOnSelectionChangeCallback", () => {
      const { selectionService, dispatchPushEvent } =
        constructSelectionService(extensionConfig);

      const callback = vi.fn();

      selectionService.addOnSelectionChangeCallback(callback);

      const payload = { ...extensionConfig, ...selectionPayload };
      dispatchPushEvent({ eventType: "SelectionEvent", payload });
      expect(callback).toHaveBeenCalledWith(selectionPayload);
    });

    it("wraps selection callbacks to filter events by nodeId", () => {
      const testPayload = { key: "someValue" };
      const nodeId = "123";
      const extensionConfig = { nodeId } as UIExtensionServiceConfig;
      const { selectionService, dispatchPushEvent } =
        constructSelectionService(extensionConfig);

      const callback = vi.fn();

      selectionService.addOnSelectionChangeCallback(callback);

      dispatchPushEvent({
        eventType: "SelectionEvent",
        payload: { ...selectionPayload, nodeId: "otherNodeId" },
      });
      expect(callback).not.toHaveBeenCalled();
      dispatchPushEvent({
        eventType: "SelectionEvent",
        payload: selectionPayload,
      });
      expect(callback).not.toHaveBeenCalledWith(testPayload);
    });

    it("removes event callback with removeOnSelectionChangeCallback", () => {
      const { selectionService, dispatchPushEvent } =
        constructSelectionService(extensionConfig);

      const callback = vi.fn();

      selectionService.addOnSelectionChangeCallback(callback);
      selectionService.removeOnSelectionChangeCallback(callback);

      dispatchPushEvent({
        eventType: "SelectionEvent",
        payload: selectionPayload,
      });

      expect(callback).not.toHaveBeenCalled();
    });
  });
});
