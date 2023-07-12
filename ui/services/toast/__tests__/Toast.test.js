import { mount, shallowMount } from "@vue/test-utils";
import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";

import Toast from "../components/Toast.vue";

describe("Toast.vue", () => {
  const MAX_LENGTH = 160;
  let animateMock;

  beforeEach(() => {
    animateMock = vi.fn();

    const animationMock = {
      onfinish: null,
    };

    animateMock.mockReturnValue(animationMock);
    HTMLDivElement.prototype.animate = animateMock;
  });

  afterEach(() => {
    animateMock.mockRestore();
  });

  describe("props", () => {
    it("uses default values for props when none are provided", () => {
      const wrapper = shallowMount(Toast);

      expect(wrapper.props().type).toBe("info");
      expect(wrapper.props().headline).toBe("");
      expect(wrapper.props().message).toBe("");
      expect(wrapper.props().buttons).toStrictEqual([]);
      expect(wrapper.props().autoRemove).toBe(true);
      expect(wrapper.props().active).toBe(true);
    });

    it("uses the type prop as the headline when no headline prop is provided", () => {
      const wrapper = shallowMount(Toast);

      const headlineElement = wrapper.find(".headline");
      expect(headlineElement.text()).toBe("Info");
    });

    it("renders a button with only text", () => {
      const button = {
        text: "button text",
      };

      const wrapper = mount(Toast, {
        propsData: {
          buttons: [button],
        },
      });

      const buttonElement = wrapper.find(".toast-button");
      expect(buttonElement.text()).toBe("button text");
    });

    it("renders a button with a callback", () => {
      const button = {
        text: "button text",
        callback: () => "button clicked",
      };
      const callbackSpy = vi.spyOn(button, "callback");

      const wrapper = mount(Toast, {
        propsData: {
          buttons: [button],
        },
      });

      wrapper.find(".toast-button").trigger("click");
      expect(callbackSpy).toHaveBeenCalled();
    });
  });

  describe("message truncation", () => {
    it("displays the full message when its length is < MAX_LENGTH", () => {
      const message = "A".repeat(MAX_LENGTH - 1);

      const wrapper = shallowMount(Toast, {
        propsData: {
          message,
        },
      });

      expect(wrapper.find(".message").text()).toBe(message);
      expect(wrapper.find(".show-more").exists()).toBe(false);
    });

    it("truncates message and provides 'show more' button when message length >= MAX_LENGTH", () => {
      const message = "A".repeat(MAX_LENGTH + 1);
      const expectedMessage = `${"A".repeat(MAX_LENGTH - 1)}…`;

      const wrapper = shallowMount(Toast, {
        propsData: {
          message,
        },
      });

      expect(wrapper.find(".message").text()).toContain(expectedMessage);
      expect(wrapper.find(".show-more").exists()).toBe(true);
    });

    it("displays the full message when 'show more' button is clicked", async () => {
      const message = "A".repeat(MAX_LENGTH + 1);

      const wrapper = shallowMount(Toast, {
        propsData: {
          message,
        },
      });

      await wrapper.find(".show-more").trigger("click");
      await wrapper.vm.$nextTick();
      expect(wrapper.find(".message").text()).toBe(message);
    });
  });

  describe("emits", () => {
    it("emits remove when the close button is clicked", () => {
      const wrapper = shallowMount(Toast);
      wrapper.find(".close-button").trigger("click");
      expect(wrapper.emitted().remove).toBeTruthy();
    });
  });
});
