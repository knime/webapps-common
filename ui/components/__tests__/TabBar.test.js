import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";
import { markRaw } from "vue";

import TabBar from "../TabBar.vue";
import WorkflowIcon from "../../assets/img/icons/workflow.svg";
import NodeIcon from "../../assets/img/icons/node.svg";
import Carousel from "../Carousel.vue";

describe("TabBar.vue", () => {
  let possibleValues = [
    {
      value: "all",
      label: "All",
      icon: null,
      disabled: true,
    },
    {
      value: "nodes",
      label: "Nodes",
      icon: markRaw(NodeIcon),
      title: "A title",
      disabled: true,
    },
    {
      value: "workflows",
      label: "Workflows",
      icon: markRaw(WorkflowIcon),
      disabled: false,
    },
  ];

  it("renders defaults", () => {
    let wrapper = shallowMount(TabBar);
    expect(wrapper.find("input").exists()).toBeFalsy();
  });

  it("renders", () => {
    let wrapper = shallowMount(TabBar, {
      props: {
        possibleValues,
        modelValue: "all",
      },
    });

    expect(wrapper.findComponent(Carousel).exists()).toBeTruthy();
    expect(wrapper.findComponent(NodeIcon).exists()).toBeTruthy();
    expect(wrapper.find(".tab-bar").exists()).toBeTruthy();
    expect(wrapper.find(".overflow").exists()).toBeTruthy();
    expect(wrapper.find("input:checked").attributes("value")).toBe("all");
  });

  it("does not emit if initial value is set", () => {
    let wrapper = shallowMount(TabBar, {
      props: {
        possibleValues,
        modelValue: "workflows",
      },
    });

    expect(wrapper.emitted("update:modelValue")).toBeFalsy();
  });

  it("can be disabled", () => {
    let wrapper = shallowMount(TabBar, {
      props: {
        possibleValues,
        modelValue: "all",
        disabled: true,
      },
    });
    wrapper.findAll('input[type="radio"]').forEach((input) => {
      expect(input.attributes("disabled")).toBeDefined();
    });
  });

  it("can be updated", async () => {
    let wrapper = shallowMount(TabBar, {
      props: {
        possibleValues,
        modelValue: "nodes",
      },
    });
    await wrapper.setProps({
      modelValue: "workflows",
    });
    expect(wrapper.find("input:checked").attributes("value")).toBe("workflows");
  });

  it("reacts to selections", async () => {
    let wrapper = shallowMount(TabBar, {
      props: {
        possibleValues,
        modelValue: "nodes",
      },
    });

    expect(wrapper.find("input:checked").attributes("value")).toBe("nodes");
    await wrapper.find('input[type="radio"][value="workflows"]').setChecked();
    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")[0]).toEqual(["workflows"]);
  });

  it("disables tab if empty", () => {
    let wrapper = shallowMount(TabBar, {
      props: {
        possibleValues,
      },
    });

    expect(wrapper.findAll("input[disabled]")).toHaveLength(2);
  });

  it("renders titles", () => {
    let wrapper = shallowMount(TabBar, {
      props: {
        possibleValues,
      },
    });
    let titledInputs = wrapper.findAll("label[title]");
    expect(titledInputs).toHaveLength(1);
    expect(titledInputs[0].element.title).toBe("A title");
  });
});
