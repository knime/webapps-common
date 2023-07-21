import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";

import NodeFeatureList from "../NodeFeatureList.vue";
import TabBar from "../../TabBar.vue";
import PortsList from "../PortsList.vue";
import DialogOptions from "../DialogOptions.vue";
import ViewsList from "../ViewsList.vue";

describe("NodeFeatureList.vue", () => {
  it("renders ports and options", async () => {
    const wrapper = shallowMount(NodeFeatureList, {
      props: {
        inPorts: [
          {
            dummy: "inPort",
          },
        ],
        outPorts: [
          {
            dummy: "outPort",
          },
        ],
        dynInPorts: [
          {
            dummy: "dynInPort",
          },
        ],
        dynOutPorts: [
          {
            dummy: "dynOutPort",
          },
        ],
        options: [
          {
            dummy: "dialog",
          },
        ],
        views: [
          {
            dummy: "view",
          },
        ],
      },
      global: {
        stubs: {
          TabBar: false,
        },
      },
    });
    await wrapper.vm.$nextTick(); // to make sure TabBar.created() was called
    expect(wrapper.findComponent(TabBar).props("modelValue")).toBe("ports");
    expect(wrapper.findComponent(PortsList).props("inPorts")).toEqual([
      { dummy: "inPort" },
    ]);
    expect(wrapper.findComponent(PortsList).props("outPorts")).toEqual([
      { dummy: "outPort" },
    ]);
    expect(wrapper.findComponent(PortsList).props("dynInPorts")).toEqual([
      { dummy: "dynInPort" },
    ]);
    expect(wrapper.findComponent(PortsList).props("dynOutPorts")).toEqual([
      { dummy: "dynOutPort" },
    ]);
    await wrapper
      .findComponent(TabBar)
      .vm.$emit("update:modelValue", "node-dialog-options");
    expect(wrapper.findComponent(DialogOptions).props("options")).toEqual([
      { dummy: "dialog" },
    ]);
    await wrapper.findComponent(TabBar).vm.$emit("update:modelValue", "views");
    expect(wrapper.findComponent(ViewsList).props("views")).toEqual([
      { dummy: "view" },
    ]);
  });

  it("displays default placeholder if all tabs are empty", () => {
    const wrapper = shallowMount(NodeFeatureList);
    expect(wrapper.findComponent(TabBar).props("modelValue")).toBeNull();
    expect(wrapper.find(".placeholder").text()).toBe(
      "This node does not provide any ports, options or views.",
    );
  });

  it("displays custom placeholder text if all tabs are empty", () => {
    const wrapper = shallowMount(NodeFeatureList, {
      props: {
        emptyText: "This is a placeholder text!",
      },
    });
    expect(wrapper.findComponent(TabBar).props("modelValue")).toBeNull();
    expect(wrapper.find(".placeholder").text()).toBe(
      "This is a placeholder text!",
    );
  });

  it("selects second tab if first is empty", async () => {
    const wrapper = shallowMount(NodeFeatureList, {
      props: {
        options: [
          {
            dummy: "dialog",
          },
        ],
      },
      global: {
        stubs: {
          TabBar: false,
        },
      },
    });
    await wrapper.vm.$nextTick(); // to make sure TabBar.created() was called

    expect(wrapper.findComponent(TabBar).props("modelValue")).toBe(
      "node-dialog-options",
    );
  });

  it("disables ports tab if there are no ports", () => {
    const wrapper = shallowMount(NodeFeatureList, {
      props: {
        options: [
          {
            dummy: "dialog",
          },
        ],
      },
    });
    expect(
      wrapper.vm.possibleTabValues.find((cfg) => cfg.value === "ports")
        .disabled,
    ).toBe(true);
  });

  it("enables ports tab if there are ports", () => {
    const wrapper = shallowMount(NodeFeatureList, {
      props: {
        inPorts: [
          {
            dummy: "port",
          },
        ],
      },
    });
    expect(
      wrapper.vm.possibleTabValues.find((cfg) => cfg.value === "ports")
        .disabled,
    ).toBe(false);
  });

  it("disables views tab if there are no views", () => {
    const wrapper = shallowMount(NodeFeatureList, {
      props: {
        options: [
          {
            dummy: "dialog",
          },
        ],
      },
    });
    expect(
      wrapper.vm.possibleTabValues.find((cfg) => cfg.value === "views")
        .disabled,
    ).toBe(true);
  });

  it("enables views tab if there are views", () => {
    const wrapper = shallowMount(NodeFeatureList, {
      props: {
        views: [
          {
            dummy: "view",
          },
        ],
      },
    });
    expect(
      wrapper.vm.possibleTabValues.find((cfg) => cfg.value === "views")
        .disabled,
    ).toBe(false);
  });

  it("disables options tab if there are no options", () => {
    const wrapper = shallowMount(NodeFeatureList, {
      props: {
        views: [
          {
            dummy: "dialog",
          },
        ],
      },
    });
    expect(
      wrapper.vm.possibleTabValues.find(
        (cfg) => cfg.value === "node-dialog-options",
      ).disabled,
    ).toBe(true);
  });

  it("enables options tab if there are options", () => {
    const wrapper = shallowMount(NodeFeatureList, {
      props: {
        options: [
          {
            dummy: "view",
          },
        ],
      },
    });
    expect(
      wrapper.vm.possibleTabValues.find(
        (cfg) => cfg.value === "node-dialog-options",
      ).disabled,
    ).toBe(false);
  });
});
