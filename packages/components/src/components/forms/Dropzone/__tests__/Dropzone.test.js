import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";

import Dropzone from "../Dropzone.vue";

describe("Dropzone.vue", () => {
  describe("renders", () => {
    it("renders default content", () => {
      const wrapper = mount(Dropzone);
      expect(wrapper.classes()).toContain("vertical");
      expect(wrapper.classes()).not.toContain("disabled");
      const defaultContent = wrapper.find("[data-default-content]");
      expect(defaultContent.exists()).toBe(true);
      expect(wrapper.find(".dropzone-info").exists()).toBe(true);
      expect(wrapper.find(".dropzone-button").exists()).toBe(true);
      expect(wrapper.find(".add-button").exists()).toBe(false);
      const input = wrapper.find('input[type="file"]');
      expect(input.exists()).toBe(true);
      expect(input.attributes("disabled")).toBeUndefined();
      expect(input.attributes("multiple")).toBeUndefined();
    });

    it("can be disabled", () => {
      const wrapper = mount(Dropzone, {
        props: {
          disabled: true,
        },
      });

      expect(wrapper.classes()).toContain("disabled");
      const input = wrapper.find('input[type="file"]');
      expect(input.attributes("disabled")).toBeDefined();
    });

    it("allows multiple files", () => {
      const wrapper = mount(Dropzone, {
        props: {
          multiple: true,
        },
      });

      expect(wrapper.find(".add-button").exists()).toBe(false);
      const input = wrapper.find('input[type="file"]');
      expect(input.attributes("multiple")).toBeDefined();
    });

    it("renders custom content", () => {
      const wrapper = mount(Dropzone, {
        props: {
          empty: false,
        },
        slots: {
          default: "Custom content",
        },
      });

      const defaultContent = wrapper.find("[data-default-content]");
      expect(defaultContent.exists()).toBe(false);
      expect(wrapper.text()).toContain("Custom content");
      expect(wrapper.find(".add-button").exists()).toBe(false);
      expect(wrapper.find('input[type="file"]').exists()).toBe(false);
    });

    it("renders custom content with multiple files", () => {
      const wrapper = mount(Dropzone, {
        props: {
          empty: false,
          multiple: true,
        },
        slots: {
          default: "Custom content",
        },
      });

      const defaultContent = wrapper.find("[data-default-content]");
      expect(defaultContent.exists()).toBe(false);
      expect(wrapper.text()).toContain("Custom content");
      expect(wrapper.find(".add-button").exists()).toBe(true);
      expect(wrapper.find('input[type="file"]').exists()).toBe(true);
    });
  });

  describe("triggers file input", () => {
    it("should trigger input click when clicking on default content", async () => {
      const wrapper = mount(Dropzone);

      const defaultContent = wrapper.find("[data-default-content]");
      const input = wrapper.find('input[type="file"]');
      const inputClickSpy = vi.spyOn(input.element, "click");

      await defaultContent.trigger("click");
      expect(inputClickSpy).toHaveBeenCalled();

      inputClickSpy.mockReset();
      await wrapper.find(".dropzone-button").trigger("click");
      expect(inputClickSpy).toHaveBeenCalled();
    });

    it("should not trigger input click when clicking on custom content", async () => {
      const wrapper = mount(Dropzone, {
        props: {
          empty: false,
          multiple: true,
        },
        slots: {
          default: "<button class='custom-button'>Custom action</button>",
        },
      });

      const customButton = wrapper.find(".custom-button");
      const input = wrapper.find('input[type="file"]');
      const inputClickSpy = vi.spyOn(input.element, "click");

      await customButton.trigger("click");
      expect(inputClickSpy).not.toHaveBeenCalled();
    });

    it("should trigger input click on Enter or Space key press", async () => {
      const wrapper = mount(Dropzone);

      const input = wrapper.find('input[type="file"]');
      const inputClickSpy = vi.spyOn(input.element, "click");

      await wrapper.trigger("keydown", { key: "Enter" });
      expect(inputClickSpy).toHaveBeenCalled();

      inputClickSpy.mockReset();
      await wrapper.trigger("keydown", { key: " " });
      expect(inputClickSpy).toHaveBeenCalled();
    });
  });
});
