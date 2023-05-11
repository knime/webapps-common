/* eslint-disable no-magic-numbers */
import { describe, it, expect, beforeEach } from "vitest";
import { shallowMount } from "@vue/test-utils";

import PortGroup from "../PortGroup.vue";
import PortIcon from "../PortIcon.vue";
import Description from "../../Description.vue";

describe("PortsListItem.vue", () => {
  let props, wrapper;

  beforeEach(() => {
    props = {
      ports: [
        {
          color: "#cccccc",
          type: "table",
          typeName: "Table",
          optional: true,
          description: "Hello world!",
          name: "Name1",
        },
        {
          color: "#abcdef",
          type: "flowVariable",
          typeName: "Flow Variable",
          optional: false,
          description: "Whatever",
          name: "Porty",
        },
        {},
      ],
      title: "Output Ports",
    };
  });

  describe("renders independent ports", () => {
    beforeEach(() => {
      wrapper = shallowMount(PortGroup, { props });
    });

    it("renders title", () => {
      expect(wrapper.find("h6").text()).toBe("Output Ports");
    });

    it("renders PortIcons", () => {
      const PortIcons = wrapper.findAllComponents(PortIcon);

      expect(PortIcons[0].props()).toStrictEqual({
        color: "#cccccc",
        filled: false,
        type: "table",
      });
      expect(PortIcons[1].props()).toStrictEqual({
        color: "#abcdef",
        filled: true,
        type: "flowVariable",
      });
      expect(PortIcons[2].props().type).toBe("table"); // default prop value
    });

    it("renders Port Names", () => {
      const PortNames = wrapper.findAll(".port-name");

      expect(PortNames.length).toBe(2);
      expect(PortNames[0].text()).toBe("Name1");
      expect(PortNames[1].text()).toBe("Porty");
    });

    it("renders thick Type Names", () => {
      const PortTypes = wrapper.findAll(".port-type.fat");

      expect(PortTypes.length).toBe(3);
      expect(PortTypes[0].text()).toBe("Type: Table");
      expect(PortTypes[1].text()).toBe("Type: Flow Variable");
      expect(PortTypes[2].text()).toBe("Type:");
    });

    it("renders Port Descriptions", () => {
      const PortDescriptions = wrapper.findAllComponents(Description);

      expect(PortDescriptions.length).toBe(2);
      expect(PortDescriptions[0].props("text")).toBe("Hello world!");
      expect(PortDescriptions[1].props("text")).toBe("Whatever");
    });
  });

  describe("renders port group", () => {
    beforeEach(() => {
      props.groupDescription = "group";
      wrapper = shallowMount(PortGroup, { props });
    });

    it("doesn't render Port Names", () => {
      const PortNames = wrapper.findAll(".port-name");
      expect(PortNames.length).toBe(0);
    });

    it("renders Type Names", () => {
      const PortTypes = wrapper.findAll(".port-type");

      expect(PortTypes.length).toBe(3);
      expect(PortTypes[0].text()).toBe("Type: Table");
      expect(PortTypes[1].text()).toBe("Type: Flow Variable");
      expect(PortTypes[2].text()).toBe("Type:");
    });

    it("renders thin typeNames", () => {
      expect(wrapper.find(".port-type.fat").exists()).toBe(false);
    });

    it("renders group description, doesn't render port descriptions", () => {
      const PortDescriptions = wrapper.findAllComponents(Description);
      expect(PortDescriptions.length).toBe(1);

      expect(PortDescriptions[0].props("text")).toBe("group");
    });
  });
});
