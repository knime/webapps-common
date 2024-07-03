import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";

import PortIcon from "../PortIcon.vue";
import * as portColors from "@knime/styles/colors/portColors.mjs";

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
});
