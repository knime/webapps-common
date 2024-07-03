import { describe, it, expect, beforeEach, vi } from "vitest";
import { mount } from "@vue/test-utils";

import CloseIcon from "@knime/styles/img/icons/close.svg";
import LensIcon from "@knime/styles/img/icons/lens.svg";
import InverseSearchIcon from "@knime/styles/img/icons/arrows-order-left-right.svg";
import UpperLowerCaseIcon from "@knime/styles/img/icons/upper-lower-case.svg";
import FunctionButton from "../../../Buttons/FunctionButton.vue";

import InputField from "../../InputField/InputField.vue";
import SearchInput from "../SearchInput.vue";

describe("SearchInput", () => {
  let doMount, wrapper, props;

  beforeEach(() => {
    wrapper = null;

    doMount = () => {
      wrapper = mount(SearchInput, { props });
    };
  });

  it("renders", () => {
    doMount();

    expect(wrapper.findComponent(LensIcon).exists()).toBeTruthy();
    expect(wrapper.findComponent(SearchInput).exists()).toBeTruthy();
    expect(wrapper.findComponent(InputField).exists()).toBeTruthy();
    expect(wrapper.findComponent(CloseIcon).exists()).toBeFalsy();
    expect(wrapper.find(".spacer").exists()).toBeFalsy();
    // Since there is no text entered into the search input yet, there
    // should be no clear-all button.
    expect(wrapper.findComponent(FunctionButton).exists()).toBeFalsy();
  });

  it("sets placeholder", () => {
    props = {
      placeholder: "type something",
    };
    doMount();

    expect(wrapper.find("input").attributes("placeholder")).toBe(
      "type something",
    );
  });

  it("can be focused via public method", () => {
    doMount();

    let focusMock = vi.fn();
    wrapper.find("input").element.focus = focusMock;
    wrapper.vm.focus();

    expect(focusMock).toHaveBeenCalled();
  });

  describe("clear-all button and spacer", () => {
    it("doesn't show spacer if there are no extra buttons besides clear-all", () => {
      props = {
        modelValue: "Some node",
      };
      doMount();
      expect(wrapper.findComponent(CloseIcon).exists()).toBeTruthy();
      expect(wrapper.find(".spacer").exists()).toBeFalsy();
    });

    it("shows spacer if there is one extra button besides clear-all", () => {
      props = {
        modelValue: "Some node",
        showCaseSensitiveSearchButton: true,
      };
      doMount();

      expect(wrapper.findComponent(CloseIcon).exists()).toBeTruthy();
      expect(wrapper.find(".spacer").exists()).toBeTruthy();
    });

    it("shows spacer if there are two extra buttons besides clear-all", () => {
      props = {
        modelValue: "Some node",
        showCaseSensitiveSearchButton: true,
        showInverseSearchButton: true,
      };
      doMount();

      expect(wrapper.findComponent(CloseIcon).exists()).toBeTruthy();
      expect(wrapper.find(".spacer").exists()).toBeTruthy();
    });
  });

  describe("searching event", () => {
    it("searches on input in search box", async () => {
      doMount();

      const input = wrapper.find("input");
      await input.setValue("some node");

      expect(wrapper.emitted("update:modelValue")).toStrictEqual([
        ["some node"],
      ]);
    });

    it("clears on clear button click", async () => {
      props = {
        modelValue: "Test",
      };
      doMount();

      const closeButton = wrapper.findComponent(FunctionButton);
      await closeButton.vm.$emit("click");
      expect(wrapper.emitted("update:modelValue")).toStrictEqual([[""]]);
      expect(wrapper.emitted("clear")).toBeTruthy();
    });
  });

  describe("search options", () => {
    it("can show a case-sensitive button and inverse button", () => {
      props = {
        showCaseSensitiveSearchButton: true,
        showInverseSearchButton: true,
      };

      doMount();

      expect(wrapper.findComponent(UpperLowerCaseIcon).exists()).toBeTruthy();
      expect(wrapper.findComponent(InverseSearchIcon).exists()).toBeTruthy();
    });

    it("sets case-sensitive on case-sensitive button click", async () => {
      props = {
        showCaseSensitiveSearchButton: true,
      };

      doMount();

      const caseSensitiveButton = wrapper
        .findAllComponents(FunctionButton)
        .at(0);
      expect(
        caseSensitiveButton.findComponent(UpperLowerCaseIcon).exists(),
      ).toBeTruthy();

      await caseSensitiveButton.vm.$emit("click");
      expect(wrapper.emitted("toggle-case-sensitive-search")).toStrictEqual([
        [true],
      ]);
    });

    it("sets inverse search on inverse search button click", async () => {
      props = {
        showInverseSearchButton: true,
      };

      doMount();

      const inverseSearchButton = wrapper
        .findAllComponents(FunctionButton)
        .at(0);
      expect(
        inverseSearchButton.findComponent(InverseSearchIcon).exists(),
      ).toBeTruthy();

      await inverseSearchButton.vm.$emit("click");
      expect(wrapper.emitted("toggle-inverse-search")).toStrictEqual([[true]]);
    });

    it("sets custom tooltips", () => {
      props = {
        showInverseSearchButton: true,
        showCaseSensitiveSearchButton: true,
        modelValue: "Some node",
        tooltips: {
          clear: "custom clear",
          caseSensitive: "custom sensitive",
          inverseSearch: "custom inverse",
        },
      };

      doMount();

      const clearButton = wrapper.findAllComponents(FunctionButton).at(0);
      expect(clearButton.attributes("title")).toBe("custom clear");

      const caseSensitiveButton = wrapper
        .findAllComponents(FunctionButton)
        .at(1);
      expect(caseSensitiveButton.attributes("title")).toBe("custom sensitive");

      const inverseSearchButton = wrapper
        .findAllComponents(FunctionButton)
        .at(2);
      expect(inverseSearchButton.attributes("title")).toBe("custom inverse");
    });
  });
});
