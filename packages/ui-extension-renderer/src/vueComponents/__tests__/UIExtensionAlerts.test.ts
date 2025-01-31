import { describe, expect, it } from "vitest";
import { shallowMount } from "@vue/test-utils";

import UIExtensionAlerts from "../UIExtensionAlerts.vue";
import UIExtensionBlockingErrorView from "../UIExtensionBlockingErrorView.vue";
import UIExtensionErrorOverlay from "../UIExtensionErrorOverlay.vue";
import UIExtensionWarningButton from "../UIExtensionWarningButton.vue";
import {
  type Alert,
  USER_ERROR_CODE,
  USER_ERROR_CODE_BLOCKING,
} from "../types";

describe("UIExtensionAlerts.vue", () => {
  const createWrapper = (alert: Alert | null) => {
    const wrapper = shallowMount(UIExtensionAlerts, {
      props: { alert },
    });

    return {
      wrapper,
      uiExtErrorOverlay: wrapper.findComponent(UIExtensionErrorOverlay),
      uiExtErrorView: wrapper.findComponent(UIExtensionBlockingErrorView),
      uiExtWarningButton: wrapper.findComponent(UIExtensionWarningButton),
    };
  };

  it("passes the alert to the UIExtErrorOverlay for errors with the default code", () => {
    const alert = {
      type: "error",
      message: "error message",
      code: USER_ERROR_CODE,
      data: {},
    } satisfies Alert;
    const { uiExtErrorOverlay, uiExtErrorView, uiExtWarningButton } =
      createWrapper(alert);
    expect(uiExtErrorOverlay.props("alert")).toStrictEqual(alert);
    expect(uiExtErrorView.props("alert")).toBeNull();
    expect(uiExtWarningButton.props("alert")).toBeNull();
  });

  it("passes the alert to the UIExtBlockingErrorView for errors with the blocking code", () => {
    const alert = {
      type: "error",
      message: "error message",
      code: USER_ERROR_CODE_BLOCKING,
      data: {},
    } satisfies Alert;
    const { uiExtErrorOverlay, uiExtErrorView, uiExtWarningButton } =
      createWrapper(alert);
    expect(uiExtErrorOverlay.props("alert")).toBeNull();
    expect(uiExtErrorView.props("alert")).toStrictEqual(alert);
    expect(uiExtWarningButton.props("alert")).toBeNull();
  });

  it("passes the alert to the UIExtWarningButton for warnings", () => {
    const alert = {
      type: "warn",
      warnings: [{ message: "warning message", details: "warning details" }],
    } satisfies Alert;
    const { uiExtErrorOverlay, uiExtErrorView, uiExtWarningButton } =
      createWrapper(alert);
    expect(uiExtErrorOverlay.props("alert")).toBeNull();
    expect(uiExtErrorView.props("alert")).toBeNull();
    expect(uiExtWarningButton.props("alert")).toStrictEqual(alert);
  });
});
