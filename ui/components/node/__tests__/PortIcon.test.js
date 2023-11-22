import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";

import PortIcon from "../PortIcon.vue";
import * as portColors from "../../../colors/portColors.mjs";

describe("PortIcon", () => {
  let wrapper;

  it("renders holey port", () => {
    wrapper = shallowMount(PortIcon, {
      props: {
        type: "other",
        color: "yellow",
        filled: false,
      },
    });
    const attributes = wrapper.find("rect").attributes();
    expect(attributes.stroke).toBe("yellow");
    expect(attributes.fill).toBe("transparent");
  });

  it.each([
    ["table", "polygon", portColors.table],
    ["flowVariable", "circle", portColors.flowVariable],
    ["other", "rect", ""],
  ])("renders filled port: DataType %s", (type, tag, color) => {
    wrapper = shallowMount(PortIcon, {
      props: {
        type,
        filled: true,
      },
    });
    expect(wrapper.find(tag).exists()).toBeTruthy();
    const attributes = wrapper.find(tag).attributes();
    expect(attributes.stroke).toBe(color);
    expect(attributes.fill).toBe(color);
  });

  it("renders filled port: DataType report", () => {
    wrapper = shallowMount(PortIcon, {
      props: {
        type: "report",
        filled: true,
      },
    });
    expect(wrapper.find("g").exists()).toBeTruthy();
    const attributes = wrapper.find("g").attributes();
    expect(attributes.transform).toBe("translate(-4.5, -4.5)");
  });
});
