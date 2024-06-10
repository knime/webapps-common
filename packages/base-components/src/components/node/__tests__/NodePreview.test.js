import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";

import NodePreview from "../NodePreview.vue";
import NodeTorsoNormal from "../NodeTorsoNormal.vue";
import PortIcon from "../PortIcon.vue";

describe("NodePreview.vue", () => {
  it("renders node torso", () => {
    const wrapper = shallowMount(NodePreview, {
      props: {
        type: "A",
        isComponent: true,
        icon: "data:image/icon",
      },
    });
    expect(wrapper.findComponent(NodeTorsoNormal).props()).toStrictEqual({
      type: "A",
      isComponent: true,
      icon: "data:image/icon",
    });
  });

  it("creates port icons", () => {
    const wrapper = shallowMount(NodePreview, {
      props: {
        inPorts: [
          {
            color: "#000",
            optional: true,
            type: "flowVariable",
          },
        ],
        outPorts: [
          {
            color: "#fff",
            optional: false,
            type: "table",
          },
          {
            color: "#888",
            optional: true,
            type: "other",
          },
        ],
      },
    });
    let portIcons = wrapper.findAllComponents(PortIcon);
    expect(portIcons[0].props()).toStrictEqual({
      color: "#000",
      filled: false,
      type: "flowVariable",
    });
    expect(portIcons[0].attributes().transform).toBe("translate(-4.5, 16)");

    expect(portIcons[1].props()).toStrictEqual({
      color: "#fff",
      filled: true,
      type: "table",
    });
    expect(portIcons[1].attributes().transform).toBe("translate(36.5, 5.5)");

    expect(portIcons[2].props()).toStrictEqual({
      color: "#888",
      filled: false,
      type: "other",
    });
    expect(portIcons[2].attributes().transform).toBe("translate(36.5, 26.5)");
  });

  it("renders dynamic Ports indicator", () => {
    const wrapper = shallowMount(NodePreview, {
      props: {
        hasDynPorts: true,
      },
    });

    // eslint-disable-next-line no-magic-numbers
    expect(wrapper.findAll("circle").length).toBe(3);
  });
});
