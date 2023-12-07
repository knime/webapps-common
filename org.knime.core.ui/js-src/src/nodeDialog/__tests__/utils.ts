import { vi, type Mock } from "vitest";
// @ts-ignore
import { createStore } from "vuex";

export const getOptions = ({
  setApplySettingsMock,
  createAlertMock,
  sendWarningMock,
  cleanSettingsMock,
  dirtySettingsMock,
  stubButtonsBySlot,
}: {
  setApplySettingsMock?: Mock;
  createAlertMock?: Mock;
  sendWarningMock?: Mock;
  cleanSettingsMock?: Mock;
  dirtySettingsMock?: Mock;
  stubButtonsBySlot?: true;
} = {}) => {
  const dialogStoreOptions = {
    actions: {
      setApplySettings: setApplySettingsMock || vi.fn(),
      cleanSettings: cleanSettingsMock || vi.fn(),
      dirtySettings: dirtySettingsMock || vi.fn(),
    },
    namespaced: true,
  };
  const store = createStore({
    modules: {
      "pagebuilder/dialog": dialogStoreOptions,
    },
  });
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
        store,
      },
      mocks: {
        $store: store,
      },
      ...(stubButtonsBySlot && {
        stubs: {
          Button: {
            inheritAttrs: false,
            template: "<slot/>",
          },
        },
      }),
    },
    props: {
      dialogSettings: {
        nodeId: "test",
      },
    },
  };
};
