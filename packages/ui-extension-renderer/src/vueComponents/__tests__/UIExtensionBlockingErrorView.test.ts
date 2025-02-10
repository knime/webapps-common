import { describe, expect, it } from "vitest";
import { shallowMount } from "@vue/test-utils";

import { Button } from "@knime/components";
import CircleCloseIcon from "@knime/styles/img/icons/circle-close.svg";

import UIExtensionBlockingErrorView from "../UIExtensionBlockingErrorView.vue";
import { type ErrorAlert, USER_ERROR_CODE_BLOCKING } from "../types";

describe("UIExtensionBlockingErrorView.vue", () => {
  const shallowMountView = (props: { alert: ErrorAlert | null }) => {
    return shallowMount(UIExtensionBlockingErrorView, {
      props,
    });
  };

  it("does not render the view when the given alert is null", () => {
    const wrapper = shallowMountView({ alert: null });
    expect(wrapper.text()).toBe("");
  });

  it("render the view with the given alert", () => {
    const wrapper = shallowMountView({
      alert: {
        code: USER_ERROR_CODE_BLOCKING,
        type: "error",
        message: "Some error occurred.",
        data: {},
      },
    });
    expect(wrapper.findComponent(CircleCloseIcon).exists()).toBeTruthy();
    expect(wrapper.find("span").text()).toBe("Some error occurred.");
    expect(wrapper.findComponent(Button).text()).toBe("Try again");
  });

  it("emits retry on click of the try again button", async () => {
    const wrapper = shallowMountView({
      alert: {
        code: USER_ERROR_CODE_BLOCKING,
        type: "error",
        message: "Some error occurred.",
        data: {},
      },
    });
    await wrapper.findComponent(Button).trigger("click");
    expect(wrapper.emitted("retry")).toBeTruthy();
  });
});
