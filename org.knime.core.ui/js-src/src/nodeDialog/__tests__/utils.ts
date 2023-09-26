import { vi, type Mock } from "vitest";
import { createStore } from "vuex";

export const getOptions = ({
  setApplySettingsMock,
  createAlertMock,
  sendWarningMock,
  cleanSettingsMock,
  dirtySettingsMock,
}: {
  setApplySettingsMock?: Mock;
  createAlertMock?: Mock;
  sendWarningMock?: Mock;
  cleanSettingsMock?: Mock;
  dirtySettingsMock?: Mock;
} = {}) => {
  const dialogStoreOptions = {
    actions: {
      setApplySettings: setApplySettingsMock || vi.fn(),
      cleanSettings: cleanSettingsMock || vi.fn(),
      dirtySettings: dirtySettingsMock || vi.fn(),
    },
    namespaced: true,
  };
  return {
    global: {
      provide: {
        getKnimeService: () => ({
          extensionConfig: {},
          callService: vi.fn().mockResolvedValue({}),
          registerDataGetter: vi.fn(),
          addEventCallback: vi.fn(),
          createAlert: createAlertMock || vi.fn(),
          sendWarning: sendWarningMock || vi.fn(),
        }),
      },
      mocks: {
        $store: createStore({
          modules: {
            "pagebuilder/dialog": dialogStoreOptions,
          },
        }),
      },
    },
    props: {
      dialogSettings: {
        nodeId: "test",
      },
    },
  };
};
