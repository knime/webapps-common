import { expect, describe, afterEach, it, vi, beforeEach } from "vitest";
import { shallowMount } from "@vue/test-utils";
import UIExtension from "../UIExtension.vue";
import UIExtShadowApp from "../UIExtShadowApp.vue";
import UIExtIFrame from "../UIExtIFrame.vue";

import {
  iFrameExtensionConfig,
  componentExtensionConfig,
} from "./extensionConfig";
import type { ExtensionConfig } from "../types/ExtensionConfig";
import type { UIExtensionAPILayer } from "../types/UIExtensionAPILayer";
import {
  AlertType,
  type UIExtensionServiceAPILayer,
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
    expect(wrapper.findComponent(UIExtShadowApp).exists()).toBeTruthy();
    expect(wrapper.findComponent(UIExtIFrame).exists()).toBeFalsy();
  });

  it("renders ui extensions as iframes", () => {
    props.extensionConfig = iFrameExtensionConfig;
    const wrapper = shallowMount(UIExtension, {
      props,
    });
    expect(wrapper.findComponent(UIExtIFrame).exists()).toBeTruthy();
    expect(wrapper.findComponent(UIExtShadowApp).exists()).toBeFalsy();
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
      wrapper.findComponent(UIExtShadowApp).vm.$emit("serviceCreated", service);
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
    const serviceApiLayer = wrapper.findComponent(UIExtShadowApp).props()
      .apiLayer as UIExtensionServiceAPILayer;
    expect(serviceApiLayer.getConfig()).toStrictEqual({
      ...componentExtensionConfig,
      dialogSettings,
    });
  });

  describe("handling alerts", () => {
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

      it("displays errors from the extensionConfig", () => {
        const sendAlertSpy = vi.fn();
        props.extensionConfig.nodeInfo = {
          ...nodeInfoBase,
          nodeErrorMessage: message,
        };
        props.apiLayer = {
          ...props.apiLayer,
          sendAlert: sendAlertSpy,
        };

        shallowMount(UIExtension, {
          props,
        });

        const expectedAlert = {
          ...expectedAlertBase,
          type: AlertType.ERROR,
        };

        expect(sendAlertSpy).toHaveBeenCalledWith(expectedAlert);
      });

      it("displays warnings from the extensionConfig", () => {
        const sendAlertSpy = vi.fn();
        props.extensionConfig.nodeInfo = {
          ...nodeInfoBase,
          nodeWarnMessage: message,
        };
        props.apiLayer = {
          ...props.apiLayer,
          sendAlert: sendAlertSpy,
        };
        shallowMount(UIExtension, {
          props,
        });

        const expectedAlert = {
          ...expectedAlertBase,
          type: AlertType.WARN,
        };
        expect(sendAlertSpy).toHaveBeenCalledWith(expectedAlert);
      });
    });
  });
});
