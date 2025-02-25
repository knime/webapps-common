import { describe, expect, it } from "vitest";
import { shallowMount } from "@vue/test-utils";

import PortGroup from "../PortGroup.vue";
import PortsList from "../PortsList.vue";

describe("PortsList.vue", () => {
  it("renders", () => {
    const wrapper = shallowMount(PortsList);
    expect(wrapper.findComponent(PortsList)).toBeTruthy();
  });

  it("accepts inPorts", () => {
    const wrapper = shallowMount(PortsList, {
      props: {
        inPorts: [
          {
            foo: "bar",
          },
        ],
      },
    });
    expect(wrapper.element.tagName).toBe("DIV");
    expect(wrapper.findAllComponents(PortGroup).length).toBe(1);
    expect(wrapper.findComponent(PortGroup).props("ports")).toEqual([
      { foo: "bar" },
    ]);
  });

  it("accepts outPorts", () => {
    const wrapper = shallowMount(PortsList, {
      props: {
        outPorts: [
          {
            baz: "qux",
          },
        ],
      },
    });
    expect(wrapper.findAllComponents(PortGroup).length).toBe(1);
    expect(wrapper.findComponent(PortGroup).props("ports")).toEqual([
      { baz: "qux" },
    ]);
  });

  it("accepts inPorts and outPorts", () => {
    const wrapper = shallowMount(PortsList, {
      props: {
        inPorts: [
          {
            foo: "bar",
          },
        ],
        outPorts: [
          {
            baz: "qux",
          },
        ],
      },
    });
    let allPortsListItems = wrapper.findAllComponents(PortGroup);
    expect(allPortsListItems.length).toBe(2);
    expect(allPortsListItems[0].props("ports")).toEqual([{ foo: "bar" }]);
    expect(allPortsListItems[1].props("ports")).toEqual([{ baz: "qux" }]);
  });

  it("accepts dynInPorts and dynOutPorts", () => {
    const wrapper = shallowMount(PortsList, {
      props: {
        dynInPorts: [
          {
            types: [{ foo: "bar" }],
          },
        ],
        dynOutPorts: [
          {
            types: [{ baz: "qux" }],
          },
        ],
        inPorts: [
          {
            foo: "foo",
          },
        ],
        outPorts: [
          {
            baz: "baz",
          },
        ],
      },
    });
    let allPortsListItems = wrapper.findAllComponents(PortGroup);

    expect(allPortsListItems.length).toBe(4);
    expect(allPortsListItems[2].props("ports")).toEqual([{ foo: "bar" }]);

    expect(allPortsListItems[3].props("ports")).toEqual([{ baz: "qux" }]);
  });
});
