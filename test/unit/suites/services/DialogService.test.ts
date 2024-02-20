import { UIExtensionPushEvents } from "src";
import { setUpCustomEmbedderService } from "src/embedder";
import { DialogService } from "src/services/DialogService";
import { extensionConfig } from "test/mocks";
import flushPromises from "flush-promises";

describe("DialogService", () => {
  const constructDialogService = () => {
    const apiLayer = {
      setSettingsWithCleanModelSettings: jest.fn(),
      setDirtyModelSettings: jest.fn(),
      onApplied: jest.fn(),
      publishData: jest.fn(),
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

  it("publishes data", () => {
    const { dialogService, publishData } = constructDialogService();
    const testData = { agent: "007" };
    dialogService.publishSettings(testData);
    expect(publishData).toHaveBeenCalledWith(testData);
  });

  it("does not publish data when settings are dirty", () => {
    const { dialogService, publishData } = constructDialogService();
    const testSettings = { agent: "007" };
    dialogService.setDirtyModelSettings();
    dialogService.publishSettings(testSettings);
    expect(publishData).not.toHaveBeenCalled();
  });

  it("sets settings with clean model settings", () => {
    const { dialogService, setSettingsWithCleanModelSettings } =
      constructDialogService();
    const testSettings = { agent: "007" };
    dialogService.setSettingsWithCleanModelSettings(testSettings);
    expect(setSettingsWithCleanModelSettings).toHaveBeenCalledWith(
      testSettings,
    );
  });

  it("sets dirty model settings", () => {
    const { dialogService, setDirtyModelSettings } = constructDialogService();
    dialogService.setDirtyModelSettings();
    expect(setDirtyModelSettings).toHaveBeenCalled();
  });

  it("listens to ApplyData push events and sets isApplied when finished successfully", async () => {
    const { dialogService, onApplied, dispatchPushEvent } =
      constructDialogService();
    let isApplied = true;
    const applySettingsMock = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ isApplied }));
    dialogService.setApplyListener(applySettingsMock);

    const dispatchApplyEvent = () => {
      dispatchPushEvent<UIExtensionPushEvents.EventTypes.ApplyDataEvent>({
        name: UIExtensionPushEvents.EventTypes.ApplyDataEvent,
      });
    };

    dispatchApplyEvent();

    expect(applySettingsMock).toHaveBeenCalled();
    expect(onApplied).not.toHaveBeenCalled();
    await flushPromises();
    expect(onApplied).toHaveBeenCalledWith({ isApplied: true });
    onApplied.mockReset();

    isApplied = false;
    dispatchApplyEvent();
    expect(applySettingsMock).toHaveBeenCalled();
    await flushPromises();
    expect(onApplied).toHaveBeenCalledWith({ isApplied: false });
  });
});
