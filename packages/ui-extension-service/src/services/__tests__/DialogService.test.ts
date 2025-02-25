import { describe, expect, it, vi } from "vitest";
import flushPromises from "flush-promises";

import { type APILayerDirtyState } from "@knime/ui-extension-renderer/api";
import { setUpCustomEmbedderService } from "@knime/ui-extension-renderer/testing";

import { DialogService } from "../DialogService";

import { extensionConfig } from "./mocks";

describe("DialogService", () => {
  const constructDialogService = () => {
    const apiLayer = {
      onApplied: vi.fn(),
      onDirtyStateChange: vi.fn(),
      setControlsVisibility: vi.fn(),
      getConfig: () => extensionConfig,
    };
    const embedder = setUpCustomEmbedderService(apiLayer);
    const dialogService = new DialogService(embedder.service);
    return {
      dialogService,
      ...apiLayer,
      dispatchPushEvent: embedder.dispatchPushEvent,
    };
  };

  it("provides configs for dialogs", () => {
    const { dialogService } = constructDialogService();

    expect(dialogService.hasNodeView()).toBeTruthy();
    expect(dialogService.isWriteProtected()).toBeFalsy();
    expect(dialogService.getInitialDisplayMode()).toBe("large");
  });

  it("sets controls visibility", () => {
    const { dialogService, setControlsVisibility } = constructDialogService();
    const param = { shouldBeVisible: true };
    dialogService.setControlsVisibility(param);
    expect(setControlsVisibility).toHaveBeenCalledWith(param);
  });

  it("exposes dirty settings state", () => {
    const { dialogService, onDirtyStateChange } = constructDialogService();

    const aModelSetting = dialogService.registerSettings("model")({
      initialValue: "initial",
    });

    const aViewSetting = dialogService.registerSettings("view")({
      initialValue: "initial",
    });

    aViewSetting.setValue("newSetting");
    expect(onDirtyStateChange).toHaveBeenNthCalledWith(1, {
      apply: "executed",
      view: "executed",
    } satisfies APILayerDirtyState);

    aModelSetting.setValue("newSetting");

    expect(onDirtyStateChange).toHaveBeenNthCalledWith(2, {
      apply: "configured",
      view: "configured",
    } satisfies APILayerDirtyState);
  });

  it("listens to ApplyData push events and sets isApplied when finished successfully", async () => {
    const { dialogService, onApplied, dispatchPushEvent, onDirtyStateChange } =
      constructDialogService();
    let isApplied = false;

    const aModelSetting = dialogService.registerSettings("model")({
      initialValue: "initial",
    });
    aModelSetting.setValue("dirty");

    const applySettingsMock = vi
      .fn()
      .mockImplementation(() => Promise.resolve({ isApplied }));
    dialogService.setApplyListener(applySettingsMock);

    const dispatchApplyEvent = () =>
      dispatchPushEvent({
        eventType: "ApplyDataEvent",
      });

    dispatchApplyEvent();
    expect(applySettingsMock).toHaveBeenCalled();
    await flushPromises();
    expect(onApplied).toHaveBeenCalledWith({ isApplied: false });
    onApplied.mockReset();

    const cleanState: APILayerDirtyState = {
      apply: "clean",
      view: "clean",
    };
    expect(onDirtyStateChange).not.toHaveBeenCalledWith(cleanState);

    isApplied = true;
    dispatchApplyEvent();
    expect(applySettingsMock).toHaveBeenCalled();
    expect(onApplied).not.toHaveBeenCalled();
    await flushPromises();
    expect(onApplied).toHaveBeenCalledWith({ isApplied: true });

    expect(onDirtyStateChange).toHaveBeenCalledWith(cleanState);
  });

  it("adds callback to event with addOnDisplayModeChangeCallback", () => {
    const { dialogService, dispatchPushEvent } = constructDialogService();

    const callback = vi.fn();

    dialogService.addOnDisplayModeChangeCallback(callback);

    const payload = { mode: "large" as const };

    dispatchPushEvent({
      eventType: "DisplayModeEvent",
      payload,
    });

    expect(callback).toHaveBeenCalledWith(payload);
  });

  it("removes event callback with removeOnSelectionChangeCallback", () => {
    const { dialogService, dispatchPushEvent } = constructDialogService();

    const callback = vi.fn();

    dialogService.addOnDisplayModeChangeCallback(callback);
    dialogService.removeOnDisplayModeChangeCallback(callback);

    dispatchPushEvent({
      eventType: "DisplayModeEvent",
      payload: { mode: "large" },
    });

    expect(callback).not.toHaveBeenCalled();
  });
});
