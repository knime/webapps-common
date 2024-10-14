import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";

import CircleClose from "@knime/styles/img/icons/circle-close.svg";

import LoadingIcon from "../../LoadingIcon/LoadingIcon.vue"; // Ensure correct import paths
import ProgressItem from "../ProgressItem.vue"; // Adjust the import path as needed

describe("ProgressItem.vue", () => {
  it("displays the correct file name and formatted size", () => {
    const props = {
      fileName: "example.txt",
      fileSize: 1024, // size in bytes
      percentage: 50,
    };
    const wrapper = mount(ProgressItem, { props });

    // Assuming there's an element that displays the file name
    const fileName = wrapper.find(".file-name"); // Adjust selector
    const fileSize = wrapper.find(".file-size"); // Adjust selector

    expect(fileName.exists()).toBe(true);
    expect(fileName.text()).toBe("example.txt");
    expect(fileSize.exists()).toBe(true);
    expect(fileSize.text()).toBe("1 KB"); // Adjust based on your formatting logic
  });

  it("displays correct percentage", () => {
    const props = {
      percentage: 75,
    };
    const wrapper = mount(ProgressItem, { props });

    const percentageElement = wrapper.find(".percentage"); // Adjust selector
    expect(percentageElement.exists()).toBe(true);
    expect(percentageElement.text()).toBe("75%"); // Adjust based on your logic
  });

  it("shows the loading icon when status is loading", () => {
    const props = {
      status: "loading",
    };
    const wrapper = mount(ProgressItem, { props });

    expect(wrapper.findComponent(LoadingIcon).exists()).toBe(true);
  });

  it("shows the error icon when status is error", () => {
    const props = {
      status: "error",
    };
    const wrapper = mount(ProgressItem, { props });

    const icon = wrapper.find(`img[src='${CircleClose}']`);
    expect(icon.exists()).toBe(true);
  });
});
