import { expect, describe, afterEach, it, vi, beforeEach } from "vitest";
import { shallowMount } from "@vue/test-utils";
import UIExtension from "../UIExtension.vue";
import UIExtComponent from "../UIExtComponent.vue";
import UIExtIFrame from "../UIExtIFrame.vue";
import AlertLocal from "../../../ui/AlertLocal.vue";
import WarningLocal from "../../../ui/WarningLocal.vue";
import {
  iFrameExtensionConfig,
  componentExtensionConfig,
} from "./extensionConfig";
import { ExtensionConfig } from "../types/ExtensionConfig";
import { UIExtensionAPILayer } from "../types/UIExtensionAPILayer";
import {
  Alert,
  AlertType,
  UIExtensionServiceAPILayer,
} from "@knime/ui-extension-service";
vi.mock("@knime/ui-extension-service");

describe("UIExtension.vue", () => {
  type UIExtensionProps = {
    apiLayer: UIExtensionAPILayer;
    extensionConfig: ExtensionConfig;
    resourceLocation: string;
    settingsOnClean?: any;
    isReporting?: true;
    isDialogLayout?: true;
  };

  let props: UIExtensionProps;

  beforeEach(() => {
    props = {
      apiLayer: {} as UIExtensionAPILayer,
      extensionConfig: componentExtensionConfig,
      resourceLocation: "myResourceLocation",
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders ui extensions as Vue components", () => {
    const wrapper = shallowMount(UIExtension, {
      props,
    });
    expect(wrapper.findComponent(UIExtComponent).exists()).toBeTruthy();
    expect(wrapper.findComponent(UIExtIFrame).exists()).toBeFalsy();
  });

  it("renders ui extensions as iframes", () => {
    props.extensionConfig = iFrameExtensionConfig;
    const wrapper = shallowMount(UIExtension, {
      props,
    });
    expect(wrapper.findComponent(UIExtIFrame).exists()).toBeTruthy();
    expect(wrapper.findComponent(UIExtComponent).exists()).toBeFalsy();
  });

  it("increments key on UIExtIFrame component when a new extension config is passes in", async () => {
    props.extensionConfig = iFrameExtensionConfig;
    const wrapper = shallowMount(UIExtension, { props });
    const uiExtIFrameEleInitial = wrapper.findComponent(UIExtIFrame).vm.$el;

    const newExtensionConfig = { ...iFrameExtensionConfig };

    await wrapper.setProps({ extensionConfig: newExtensionConfig });

    expect(wrapper.findComponent(UIExtIFrame).vm.$el).not.toBe(
      uiExtIFrameEleInitial,
    );
  });

  describe("registration of push event service", () => {
    const service = {
      dispatchPushEvent: () => {},
    };

    let deregisterPushEventService: () => void,
      registerPushEventService: () => () => void,
      wrapper: ReturnType<typeof shallowMount>;

    beforeEach(() => {
      deregisterPushEventService = vi.fn();
      registerPushEventService = vi.fn(() => deregisterPushEventService);
      props.apiLayer.registerPushEventService = registerPushEventService;
      wrapper = shallowMount(UIExtension, {
        props,
      });
      wrapper.findComponent(UIExtComponent).vm.$emit("serviceCreated", service);
    });

    it("registers a service instance during mount", () => {
      expect(registerPushEventService).toHaveBeenCalledWith(service);
    });

    it("deregisters a service instance during unmount", () => {
      expect(deregisterPushEventService).not.toHaveBeenCalled();
      wrapper.unmount();
      expect(deregisterPushEventService).toHaveBeenCalled();
    });
  });

  it("provides extensionConfig and dialogSettings in getConfig method in the apiLayer", () => {
    const dialogSettings = { agent: "007" };
    props.settingsOnClean = dialogSettings;
    const wrapper = shallowMount(UIExtension, {
      props,
    });
    const serviceApiLayer = wrapper.findComponent(UIExtComponent).props()
      .apiLayer as UIExtensionServiceAPILayer;
    expect(serviceApiLayer.getConfig()).toStrictEqual({
      ...componentExtensionConfig,
      dialogSettings,
    });
  });

  describe("handling alerts", () => {
    let closeAlertCallback: (() => void) | undefined;

    beforeEach(() => {
      props.apiLayer.sendAlert = vi.fn((_alert, closeAlert) => {
        closeAlertCallback = closeAlert;
      });
    });

    const expectLocalAlert = async (
      wrapper: ReturnType<typeof shallowMount>,
      alertComponent: any,
      event: string,
      expectedAlert: Alert,
    ) => {
      await wrapper.vm.$nextTick();
      const localAlertWrapper = wrapper.findComponent(alertComponent);
      expect(localAlertWrapper.exists()).toBeTruthy();
      await localAlertWrapper.vm.$emit(event);
      expect(props.apiLayer.sendAlert).toHaveBeenCalledWith(
        expectedAlert,
        expect.anything(),
      );
      expect(closeAlertCallback).toBeDefined();
      closeAlertCallback?.();
      await wrapper.vm.$nextTick();
      expect(wrapper.findComponent(alertComponent).exists()).toBeFalsy();
    };

    const expectLocalError = (
      wrapper: ReturnType<typeof shallowMount>,
      expectedError: Alert,
    ) => {
      return expectLocalAlert(wrapper, AlertLocal, "showAlert", expectedError);
    };

    const expectLocalWarning = (
      wrapper: ReturnType<typeof shallowMount>,
      expectedWarning: Alert,
    ) => {
      return expectLocalAlert(wrapper, WarningLocal, "click", expectedWarning);
    };

    const sendAlertFromServiceAPILayer = (
      wrapper: ReturnType<typeof shallowMount>,
      alert: Alert,
    ) => {
      const serviceApiLayer = wrapper.findComponent(UIExtComponent).props()
        .apiLayer as UIExtensionServiceAPILayer;
      serviceApiLayer.sendAlert(alert);
    };

    const alertBase = { message: "Shaken not stirred.", nodeId: "123" };
    const mockWarning = { ...alertBase, type: AlertType.WARN };
    const mockError = { ...alertBase, type: AlertType.ERROR };

    describe("sendAlert in serviceAPILayer", () => {
      it("displays warnings from the serviceApiLayer", async () => {
        const wrapper = shallowMount(UIExtension, {
          props,
        });
        sendAlertFromServiceAPILayer(wrapper, mockWarning);
        await expectLocalWarning(wrapper, mockWarning);
      });

      it("displays errors from the serviceApiLayer", async () => {
        const wrapper = shallowMount(UIExtension, {
          props,
        });
        sendAlertFromServiceAPILayer(wrapper, mockError);
        await expectLocalError(wrapper, mockError);
      });
    });

    describe("alerts in dialog layout", () => {
      let wrapper: ReturnType<typeof shallowMount>;

      beforeEach(() => {
        wrapper = shallowMount(UIExtension, {
          props: { ...props, isDialogLayout: true },
        });
      });

      it("does not show local warnings if isDialogLayout is true", async () => {
        sendAlertFromServiceAPILayer(wrapper, mockWarning);
        expect(props.apiLayer.sendAlert).toHaveBeenCalledWith(mockWarning);
        await wrapper.vm.$nextTick();
        expect(wrapper.findComponent(WarningLocal).exists()).toBeFalsy();
      });

      it("does not show local errors if isDialogLayout is true", async () => {
        sendAlertFromServiceAPILayer(wrapper, mockError);
        expect(props.apiLayer.sendAlert).toHaveBeenCalledWith(mockError);
        await wrapper.vm.$nextTick();
        expect(wrapper.findComponent(AlertLocal).exists()).toBeFalsy();
      });
    });

    describe("alerts in report", () => {
      let wrapper: ReturnType<typeof shallowMount>;

      beforeEach(() => {
        wrapper = shallowMount(UIExtension, {
          props: { ...props, isReporting: true },
        });
      });

      it("does not display errors in reporting", async () => {
        sendAlertFromServiceAPILayer(wrapper, mockError);
        expect(props.apiLayer.sendAlert).not.toHaveBeenCalledWith(mockError);
        await wrapper.vm.$nextTick();
        expect(wrapper.findComponent(AlertLocal).exists()).toBeFalsy();
      });

      it("does not display warnings in reporting", async () => {
        sendAlertFromServiceAPILayer(wrapper, mockWarning);
        expect(props.apiLayer.sendAlert).not.toHaveBeenCalledWith(mockWarning);
        await wrapper.vm.$nextTick();
        expect(wrapper.findComponent(WarningLocal).exists()).toBeFalsy();
      });
    });

    describe("alerts from the extensionConfig", () => {
      const nodeInfoBase = {
        nodeState: "executed",
        nodeName: "Scatter Plot",
      };
      const message = "test error";

      const expectedAlertBase = {
        message,
        subtitle: "",
        nodeId: componentExtensionConfig.nodeId,
      };

      it("displays errors from the extensionConfig", async () => {
        props.extensionConfig.nodeInfo = {
          ...nodeInfoBase,
          nodeErrorMessage: message,
        };
        const wrapper = shallowMount(UIExtension, {
          props,
        });
        const expectedAlert = {
          ...expectedAlertBase,
          type: AlertType.ERROR,
        };
        await expectLocalError(wrapper, expectedAlert);
      });

      it("displays warnings from the extensionConfig", async () => {
        props.extensionConfig.nodeInfo = {
          ...nodeInfoBase,
          nodeWarnMessage: message,
        };
        const wrapper = shallowMount(UIExtension, {
          props,
        });
        const expectedAlert = {
          ...expectedAlertBase,
          type: AlertType.WARN,
        };
        await expectLocalWarning(wrapper, expectedAlert);
      });
    });
  });
});
