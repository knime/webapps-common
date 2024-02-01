import {
  CachingSelectionService,
  SelectionService,
  UIExtensionPushEvents,
  UIExtensionService,
} from "src";
import { setUpCustomEmbedderService } from "src/embedder";
import { SelectionModes } from "src/services/SelectionService";
import { SelectionServiceAPILayer } from "src/services/types/serviceApiLayers";
import { extensionConfig } from "test/mocks";

describe("CachingSelectionService", () => {
  let cachingSelectionService: CachingSelectionService,
    knimeService: UIExtensionService<SelectionServiceAPILayer>,
    dispatchPushEvent: (event: UIExtensionPushEvents.PushEvent<any>) => void;

  const setInitialSelection = (initialSelection: string[]) => {
    jest
      .spyOn(SelectionService.prototype, "initialSelection")
      .mockResolvedValue(initialSelection);
    return cachingSelectionService.initialSelection();
  };

  beforeEach(() => {
    const embedderService = setUpCustomEmbedderService({
      updateDataPointSelection: jest
        .fn()
        .mockResolvedValue('{"result": "backend-result"}'),
      getConfig: () => extensionConfig,
    });
    knimeService = embedderService.service;
    dispatchPushEvent = embedderService.dispatchPushEvent;
    cachingSelectionService = new CachingSelectionService(knimeService);
  });

  it("adds the initial selection to the selected keys when subscribe to selection is activated", async () => {
    const initialSelection = await setInitialSelection(["1", "3", "6"]);
    expect(initialSelection).toStrictEqual(["1", "3", "6"]);
    expect(
      Array.from(cachingSelectionService.getCachedSelection()).sort(),
    ).toStrictEqual(["1", "3", "6"]);
  });

  it.each([
    [SelectionModes.ADD, ["0"], ["1", "3", "6"], ["0", "1", "3", "6"]],
    [SelectionModes.REMOVE, ["0"], ["0"], []],
    [SelectionModes.REPLACE, ["0"], ["1", "3", "6"], ["1", "3", "6"]],
  ])(
    "correctly updates the selected keys on backend selection with selection mode %s",
    async (selectionMode, initialSelection, newSelection, selectedKeys) => {
      await setInitialSelection(initialSelection);
      const selectionPayload = {
        ...extensionConfig,
        selection: newSelection,
        mode: selectionMode,
      };

      dispatchPushEvent({
        name: "SelectionEvent",
        payload: selectionPayload,
      });

      expect(
        Array.from(cachingSelectionService.getCachedSelection()).sort(),
      ).toStrictEqual(selectedKeys);
    },
  );

  it("adds the selection to the selected keys and calls the parent method with equal name on add", async () => {
    const currentSelectedKeys = ["1", "3", "5"];
    await setInitialSelection(currentSelectedKeys);
    const newSelection = ["2", "4", "6"];
    const parentAddSpy = jest.spyOn(SelectionService.prototype, "add");

    cachingSelectionService.add(newSelection);

    expect(
      Array.from(cachingSelectionService.getCachedSelection()).sort(),
    ).toStrictEqual([...currentSelectedKeys, ...newSelection].sort());
    expect(parentAddSpy).toHaveBeenCalledWith(newSelection);
  });

  it("removes the selection from the selected keys and calls the parent method with equal name on remove", async () => {
    await setInitialSelection(["1", "3", "5"]);
    const newSelection = ["1", "5"];
    const parentRemoveSpy = jest.spyOn(SelectionService.prototype, "remove");

    cachingSelectionService.remove(newSelection);

    expect(
      Array.from(cachingSelectionService.getCachedSelection()),
    ).toStrictEqual(["3"]);
    expect(parentRemoveSpy).toHaveBeenCalledWith(newSelection);
  });

  it("replaces the selected keys and calls the parent method with equal name on replace", async () => {
    await setInitialSelection(["1", "3", "5"]);

    const newSelection = ["2", "4", "6"];
    const parentReplaceSpy = jest.spyOn(SelectionService.prototype, "replace");

    cachingSelectionService.replace(newSelection);

    expect(
      Array.from(cachingSelectionService.getCachedSelection()).sort(),
    ).toStrictEqual(newSelection);
    expect(parentReplaceSpy).toHaveBeenCalledWith(newSelection);
  });
});
