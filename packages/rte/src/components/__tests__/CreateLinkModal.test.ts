import { expect, describe, it, vi } from "vitest";
import * as Vue from "vue";
import { mount } from "@vue/test-utils";

import { InputField } from "@knime/components";

import CreateLinkModal from "../CreateLinkModal.vue";
import { defaultLinkToolOptions } from "../../utils/custom-link";
import { nextTick } from "vue";

describe("CreateWorkflowModal.vue", () => {
  const doMount = ({
    url = "https://mock.url",
    text = "mock url",
    isActive = true,
    isEdit = false,
    urlValidator = defaultLinkToolOptions.urlValidator,
  } = {}) => {
    const wrapper = mount(CreateLinkModal, {
      props: {
        url,
        text,
        isActive,
        isEdit,
        urlValidator,
      },
      global: {
        stubs: { BaseModal: true },
      },
    });

    return { wrapper };
  };

  describe("createWorkflowModal", () => {
    it("should create link", async () => {
      const { wrapper } = await doMount();

      const newName = "Test name";
      const input = wrapper.findAll("input").at(0)!;
      input.element.value = newName;
      input.trigger("input");
      await Vue.nextTick();

      await wrapper.findAll("button").at(-1)!.trigger("click");
      expect(wrapper.emitted("addLink")).toBeTruthy();
    });

    it("should show error message when url is invalid", async () => {
      const { wrapper } = await doMount();

      const input = wrapper.findAll("input").at(1)!;
      input.element.value = "ftp://invalid.url";
      input.trigger("input");
      await Vue.nextTick();

      const errorMessage = wrapper.find(".item-error");
      expect(errorMessage.text()).toMatch("Invalid URL");
    });

    it("should respect custom url validator", async () => {
      let { wrapper } = await doMount();

      let input = wrapper.findAll("input").at(1)!;
      input.element.value = "ftp://invalid.url";
      input.trigger("input");
      await nextTick();

      const errorMessage = wrapper.find(".item-error");
      expect(errorMessage.text()).toMatch("Invalid URL");

      ({ wrapper } = await doMount({
        urlValidator: (url: string) => url === "ftp://invalid.url",
      }));

      input = wrapper.findAll("input").at(1)!;
      input.element.value = "ftp://invalid.url";
      input.trigger("input");
      await nextTick();

      expect(wrapper.find(".item-error").exists()).toBe(false);
    });

    it("should focus the input", async () => {
      vi.useFakeTimers();
      const { wrapper } = await doMount();

      const input = wrapper.findAll("input").at(0)!;
      const focusSpy = vi.spyOn(input.element, "focus");

      await wrapper.setProps({ text: "new text" });

      vi.runAllTimers();

      expect(focusSpy).toHaveBeenCalled();
    });

    describe("hotkeys", () => {
      it("should submit on keypress enter and with a valid name", async () => {
        const { wrapper } = doMount();

        const newName = "A valid name";
        const input = wrapper.findAll("input").at(0)!;
        input.element.value = newName;
        input.trigger("input");
        await Vue.nextTick();

        const inputField = wrapper.findAllComponents(InputField).at(0)!;
        await inputField.vm.$emit("keyup", { key: "Enter" });
        expect(wrapper.emitted("addLink")).toBeTruthy();
      });

      it("should not submit on keypress enter when nothing changed", async () => {
        const { wrapper } = doMount();

        const inputField = wrapper.findAllComponents(InputField).at(1)!;
        await inputField.vm.$emit("keyup", { key: "Enter" });
        expect(wrapper.emitted("addLink")).toBeFalsy();
      });
    });
  });
});
