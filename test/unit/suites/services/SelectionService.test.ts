import { SelectionService } from "src/services";
import { KnimeService } from "src/services/KnimeService";
import { ExtensionConfig, NodeServices, SelectionModes } from "src/types";
import { extensionConfig } from "test/mocks";

describe("SelectionService", () => {
  describe("initialization", () => {
    it("Creates selection service", () => {
      const knime = new KnimeService();
      const selectionService = new SelectionService(knime);

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
    it("Calls selection service add/remove/replace methods with correct params", async () => {
      const callableService = jest
        .fn()
        .mockReturnValue(
          Promise.resolve(new Promise((res) => res({ result: "[]" }))),
        );

      const knime = new KnimeService(extensionConfig, callableService);
      const selectionService = new SelectionService(knime);

      const params = ["row1", "row2", "row3"];
      await selectionService.add(params);
      expect(callableService.mock.calls[0]).toEqual([
        NodeServices.CALL_NODE_SELECTION_SERVICE,
        SelectionModes.ADD,
        params,
      ]);

      await selectionService.remove(params);
      expect(callableService.mock.calls[1]).toEqual([
        NodeServices.CALL_NODE_SELECTION_SERVICE,
        SelectionModes.REMOVE,
        params,
      ]);
      await selectionService.replace(params);
      expect(callableService.mock.calls[2]).toEqual([
        NodeServices.CALL_NODE_SELECTION_SERVICE,
        SelectionModes.REPLACE,
        params,
      ]);
    });

    it("Adds callback to event with addOnSelectionChangeCallback", () => {
      const knime = new KnimeService();
      const selectionService = new SelectionService(knime);

      const callback = () => {};

      selectionService.addOnSelectionChangeCallback(callback);

      expect(knime.eventCallbacksMap.get("SelectionEvent")[0]).toEqual(
        (selectionService as any).callbackMap.get(callback),
      );
    });

    it("wraps selection callbacks to filter events by nodeId", () => {
      const testPayload = { key: "someValue" };
      const nodeId = "123";
      const extensionConfig = { nodeId } as ExtensionConfig;
      const knime = new KnimeService(extensionConfig);
      const selectionService = new SelectionService(knime);

      const callback = jest.fn();

      selectionService.addOnSelectionChangeCallback(callback);

      const wrappedCallback = (selectionService as any).callbackMap.get(
        callback,
      );

      wrappedCallback({ nodeId: "321", params: [testPayload] });
      expect(callback).not.toHaveBeenCalled();
      wrappedCallback({ nodeId, params: [testPayload] });
      expect(callback).not.toHaveBeenCalledWith(testPayload);
    });

    it("Removes event callback with removeOnSelectionChangeCallback", () => {
      const knime = new KnimeService();
      const selectionService = new SelectionService(knime);

      const callback = () => {};

      selectionService.addOnSelectionChangeCallback(callback);
      selectionService.removeOnSelectionChangeCallback(callback);

      expect(knime.eventCallbacksMap.get("SelectionEvent")).toEqual([]);
    });
  });
});
