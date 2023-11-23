import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";

/*
vi.mock('vue-clickaway2', () => ({
    mixin: {}
}));
*/

import Dropdown from "../Dropdown.vue";

vi.useFakeTimers();

describe("Dropdown.vue", () => {
  let props;

  beforeEach(() => {
    props = {
      possibleValues: [
        {
          id: "test1",
          text: "Text 1",
        },
        {
          id: "test2",
          text: "Text 2",
        },
        {
          id: "test3",
          text: "Text 3",
        },
        {
          id: "test4",
          text: "Text 4",
        },
        {
          id: "test5",
          text: "Text 5",
        },
      ],
      ariaLabel: "Test Label",
    };
  });

  it("renders", () => {
    const wrapper = mount(Dropdown, {
      props,
    });
    expect(wrapper.html()).toBeTruthy();
    expect(wrapper.isVisible()).toBeTruthy();
    expect(wrapper.findAll("[role=option]").length).toBe(
      props.possibleValues.length,
    );
  });

  it("renders icon slots", () => {
    props.modelValue = "test1";
    const wrapper = mount(Dropdown, {
      props,
      slots: {
        "icon-right": "<div>Right</div>",
      },
    });
    expect(wrapper.find("[role=button]").text()).toBe("Text 1 Right");
  });

  it("sets the correct aria-* attributes", () => {
    const wrapper = mount(Dropdown, {
      props,
    });

    let button = wrapper.find("[role=button]");
    expect(button.attributes("aria-label")).toBe(props.ariaLabel);
  });

  it("sets titles from text or optional titles of items", () => {
    const wrapper = mount(Dropdown, {
      props: {
        possibleValues: [
          {
            id: "test1",
            text: "Text 1",
            title: "custom title",
          },
          {
            id: "test2",
            text: "Text 2",
          },
        ],
        ariaLabel: "Test Label",
      },
    });

    const options = wrapper.findAll("[role=option]");
    expect(options.map((li) => li.attributes().title)).toStrictEqual([
      "custom title",
      "Text 2",
    ]);
  });

  it("renders value text or placeholder if no or empty value set", async () => {
    let placeholder = "my-placeholder";
    const wrapper = mount(Dropdown, {
      props: {
        ...props,
        placeholder,
        modelValue: "test3",
      },
    });

    let button = wrapper.find("[role=button]");
    expect(button.text()).toBe("Text 3");
    expect(wrapper.vm.isMissing).toBeFalsy();

    await wrapper.setProps({ modelValue: null });
    expect(button.text()).toBe(placeholder);
    await wrapper.setProps({ modelValue: "" });
    expect(button.text()).toBe(placeholder);
  });

  it("renders a hidden input field to be able to read form data", () => {
    let placeholder = "my-placeholder";
    const wrapper = mount(Dropdown, {
      props: {
        ...props,
        placeholder,
        modelValue: "test66",
        name: "test-name",
      },
    });
    expect(wrapper.find("input").exists()).toBe(true);
    expect(wrapper.find("input").element.value).toBe("test66");
    expect(wrapper.find("input").attributes("name")).toBe("test-name");
  });

  it("renders invalid value if value is invalid", () => {
    const wrapper = mount(Dropdown, {
      props: {
        ...props,
        modelValue: "no",
      },
    });

    let button = wrapper.find("[role=button]");
    expect(button.text()).toBe("(MISSING) no");
  });

  it("detects that there is a missing value", () => {
    const wrapper = mount(Dropdown, {
      props: {
        ...props,
        modelValue: "no",
      },
    });

    expect(wrapper.vm.isMissing).toBeTruthy();
  });

  it("renders invalid style", () => {
    const wrapper = mount(Dropdown, {
      props: {
        ...props,
        isValid: false,
      },
    });

    let root = wrapper.find("div");
    expect(root.classes()).toContain("invalid");
  });

  it("opens the listbox on click of button and emits event for clicked value", async () => {
    const wrapper = mount(Dropdown, {
      props,
    });
    let newValueIndex = 1;
    let listbox = wrapper.find("[role=listbox]");

    // open list
    await wrapper.find("[role=button]").trigger("click");
    expect(listbox.isVisible()).toBe(true);

    let input = wrapper.findAll("li[role=option]")[newValueIndex];
    await input.trigger("click");

    expect(wrapper.emitted("update:modelValue")[0][0]).toEqual(
      props.possibleValues[newValueIndex].id,
    );

    // listbox closed
    expect(listbox.isVisible()).toBe(false);
  });

  it("provides a valid hasSelection method", async () => {
    const wrapper = mount(Dropdown, {
      props,
    });
    expect(wrapper.vm.hasSelection()).toBe(false);
    await wrapper.setProps({ modelValue: "test2" });
    expect(wrapper.vm.hasSelection()).toBe(true);
  });

  describe("keyboard navigation", () => {
    it("opens and closes the listbox on enter/esc", async () => {
      const wrapper = mount(Dropdown, {
        props,
      });

      let listbox = wrapper.find("[role=listbox]");

      // open list
      await wrapper.find("[role=button]").trigger("keydown", { key: "Enter" });
      expect(listbox.isVisible()).toBe(true);

      // close listbox
      await listbox.trigger("keydown", { key: "Escape" });
      expect(listbox.isVisible()).toBe(false);
    });

    it("sets the values on keydown navigation", () => {
      const wrapper = mount(Dropdown, {
        props: {
          ...props,
          modelValue: "test2", // defines start point
        },
      });

      let ul = wrapper.find("ul");
      ul.trigger("keydown", { key: "ArrowDown" });
      expect(wrapper.emitted("update:modelValue")[0][0]).toBe("test3");
    });

    it("sets the values on keyup navigation", () => {
      const wrapper = mount(Dropdown, {
        props: {
          ...props,
          modelValue: "test2", // defines start point
        },
      });

      let ul = wrapper.find("ul");
      ul.trigger("keydown", { key: "ArrowUp" });
      expect(wrapper.emitted("update:modelValue")[0][0]).toBe("test1");
    });

    it("sets no values on keyup navigation at the start", () => {
      const wrapper = mount(Dropdown, {
        props: {
          ...props,
          modelValue: "test1", // defines start point
        },
      });

      let ul = wrapper.find("ul");
      ul.trigger("keydown.up");
      expect(wrapper.emitted("update:modelValue")).toBeFalsy();
    });

    it("sets no values on keydown navigation at the end", () => {
      const wrapper = mount(Dropdown, {
        props: {
          ...props,
          modelValue: "test5", // defines start point
        },
      });

      let ul = wrapper.find("ul");
      ul.trigger("keydown.down");
      expect(wrapper.emitted("update:modelValue")).toBeFalsy();
    });

    it("sets the values to the first value on home key", () => {
      const wrapper = mount(Dropdown, {
        props: {
          ...props,
          modelValue: "test3", // defines start point
        },
      });

      let ul = wrapper.find("ul");
      ul.trigger("keydown", { key: "Home" });
      expect(wrapper.emitted("update:modelValue")[0][0]).toBe("test1");
    });

    it("sets the values to the last value on end key", () => {
      const wrapper = mount(Dropdown, {
        props: {
          ...props,
          modelValue: "test3", // defines start point
        },
      });

      let ul = wrapper.find("ul");
      ul.trigger("keydown", { key: "End" });
      expect(wrapper.emitted("update:modelValue")[0][0]).toBe("test5");
    });
  });

  describe("keyboard search", () => {
    it("finds the first matching item", () => {
      const wrapper = mount(Dropdown, {
        props: {
          ...props,
          modelValue: "test2", // defines start point
        },
      });

      let ul = wrapper.find("ul");
      ul.trigger("keydown", { key: "t" });

      expect(wrapper.emitted("update:modelValue")[0][0]).toBe("test1");
    });

    it("finds a more exact matching item", () => {
      const wrapper = mount(Dropdown, {
        props: {
          ...props,
          modelValue: "test2", // defines start point
        },
      });

      let ul = wrapper.find("ul");

      ul.trigger("keydown", { key: "t" });
      ul.trigger("keydown", { key: "e" });
      ul.trigger("keydown", { key: "x" });
      ul.trigger("keydown", { key: "t" });
      ul.trigger("keydown", { key: " " });
      ul.trigger("keydown", { key: "4" });

      expect(wrapper.emitted("update:modelValue")[5][0]).toBe("test4");
    });

    it("resets after stop typing", () => {
      const wrapper = mount(Dropdown, {
        props: {
          ...props,
          modelValue: "test2", // defines start point
        },
      });

      let ul = wrapper.find("ul");

      ul.trigger("keydown", { key: "t" });
      expect(wrapper.emitted("update:modelValue")[0][0]).toBe("test1");

      // stopping typing
      vi.runAllTimers();

      ul.trigger("keydown", { key: "t" });
      ul.trigger("keydown", { key: "e" });
      ul.trigger("keydown", { key: "x" });
      ul.trigger("keydown", { key: "t" });
      ul.trigger("keydown", { key: " " });
      ul.trigger("keydown", { key: "3" });

      expect(wrapper.emitted("update:modelValue")[6][0]).toBe("test3");
    });
  });
});
