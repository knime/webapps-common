/* eslint-disable class-methods-use-this */
import { UIExtensionPushEvents } from "src";
import { setUpCustomEmbedderService } from "src/embedder";
import { DialogService } from "src/services/DialogService";
import { extensionConfig } from "test/mocks";
import flushPromises from "flush-promises";
import { DefaultSettingsComparator } from "src/services/SettingsComparator";

describe("DialogService", () => {
  const constructDialogService = () => {
    const apiLayer = {
      onApplied: jest.fn(),
      publishSettings: jest.fn(),
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

  it("publishes settings with dirty state if not configured otherwise", () => {
    const { dialogService, publishSettings } = constructDialogService();
    const testData = { agent: "007" };
    dialogService.publishSettings(testData);
    expect(publishSettings).toHaveBeenCalledWith({
      settings: testData,
      settingsModified: {
        model: true,
        view: true,
      },
    });
  });

  class TestSettingsComparator<T> extends DefaultSettingsComparator<T, string> {
    cleanSettings: T;

    setSettings(cleanSettings: T): void {
      this.cleanSettings = cleanSettings;
      super.setSettings(cleanSettings);
    }

    equals(newState: string, cleanState: string): boolean {
      return newState === cleanState;
    }
  }

  class ModelSettingsComparator extends TestSettingsComparator<{
    model: string;
  }> {
    toInternalState({ model }: { model: string }): string {
      return model;
    }
  }

  class ViewSettingsComparator extends TestSettingsComparator<{
    view: string;
  }> {
    toInternalState({ view }: { view: string }): string {
      return view;
    }
  }

  it.each(["model", "view"])(
    "publishes settings with dirty %s settings",
    (type) => {
      const { dialogService, publishSettings } = constructDialogService();
      const initialSettings = { model: "initialModel", view: "initialView" };
      dialogService.configureSettingsLifecycle({
        applyListener: jest.fn(),
        modifyConfig: {
          modelSettingsComparator: new ModelSettingsComparator(),
          viewSettingsComparator: new ViewSettingsComparator(),
          initialSettings,
        },
      });
      const testData = { ...initialSettings, [type]: "newData" };
      dialogService.publishSettings(testData);
      expect(publishSettings).toHaveBeenCalledWith({
        settings: testData,
        settingsModified:
          type === "model"
            ? { model: true, view: false }
            : { model: false, view: true },
      });
    },
  );

  it("listens to ApplyData push events and sets isApplied when finished successfully", async () => {
    const { dialogService, onApplied, dispatchPushEvent } =
      constructDialogService();
    let isApplied = false;
    const initialSettings = { model: "james", view: "bond" };
    const modelSettingsComparator = new ModelSettingsComparator();
    const viewSettingsComparator = new ViewSettingsComparator();

    const appliedSettings = { model: "agent", view: "007" };
    const applySettingsMock = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({ isApplied, appliedSettings }),
      );
    dialogService.configureSettingsLifecycle({
      applyListener: applySettingsMock,
      modifyConfig: {
        modelSettingsComparator,
        viewSettingsComparator,
        initialSettings,
      },
    });

    const dispatchApplyEvent = () => {
      dispatchPushEvent<UIExtensionPushEvents.EventTypes.ApplyDataEvent>({
        eventType: UIExtensionPushEvents.EventTypes.ApplyDataEvent,
      });
    };

    dispatchApplyEvent();
    expect(applySettingsMock).toHaveBeenCalled();
    await flushPromises();
    expect(onApplied).toHaveBeenCalledWith({ isApplied: false });
    expect(modelSettingsComparator.cleanSettings).toBe(initialSettings);
    expect(viewSettingsComparator.cleanSettings).toBe(initialSettings);
    onApplied.mockReset();

    isApplied = true;
    dispatchApplyEvent();
    expect(applySettingsMock).toHaveBeenCalled();
    expect(onApplied).not.toHaveBeenCalled();
    await flushPromises();
    expect(onApplied).toHaveBeenCalledWith({ isApplied: true });
    expect(modelSettingsComparator.cleanSettings).toBe(appliedSettings);
    expect(viewSettingsComparator.cleanSettings).toBe(appliedSettings);
  });
});
