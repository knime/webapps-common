/* eslint-disable class-methods-use-this */
import { describe, expect, it, vi } from "vitest";
import { ApplyState, UIExtensionPushEvents, ViewState } from "@/index";
import { setUpCustomEmbedderService } from "@/embedder";
import { DialogService } from "../DialogService";
import { extensionConfig } from "./mocks";
import flushPromises from "flush-promises";

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
      apply: ApplyState.EXEC,
      view: ViewState.EXEC,
    });

    aModelSetting.setValue("newSetting");

    expect(onDirtyStateChange).toHaveBeenNthCalledWith(2, {
      apply: ApplyState.CONFIG,
      view: ViewState.CONFIG,
    });
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

    const dispatchApplyEvent = () => {
      dispatchPushEvent<UIExtensionPushEvents.EventTypes.ApplyDataEvent>({
        eventType: UIExtensionPushEvents.EventTypes.ApplyDataEvent,
      });
    };

    dispatchApplyEvent();
    expect(applySettingsMock).toHaveBeenCalled();
    await flushPromises();
    expect(onApplied).toHaveBeenCalledWith({ isApplied: false });
    onApplied.mockReset();

    const cleanState = {
      apply: ApplyState.CLEAN,
      view: ViewState.CLEAN,
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
});
