import { describe, vi, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import FileSelector from "./../FileSelector.vue";
import Button from "./../Button.vue";
import LensIcon from "./../../assets/img/icons/lens.svg";

describe("FileSelector.vue", () => {
  it("renders correctly with no selected file", () => {
    const wrapper = mount(FileSelector, {
      propsData: {
        label: "Select file",
        acceptedFileTypes: "*",
        multiple: false,
      },
    });

    expect(wrapper.findComponent(Button).exists()).toBeTruthy();
    expect(wrapper.findComponent(LensIcon).exists()).toBeTruthy();
    expect(wrapper.find("label").exists()).toBeTruthy();
    expect(wrapper.find(".filename").text()).toContain("No file selected");
  });

  it("opens file selector on button click", async () => {
    const wrapper = mount(FileSelector, {
      propsData: {
        label: "Select file",
        acceptedFileTypes: "*",
        multiple: false,
      },
    });
    const fileSelectorClickspy = vi.spyOn(
      wrapper.vm.$refs.fileSelector,
      "click",
    );

    await wrapper.findComponent(Button).trigger("click");
    expect(fileSelectorClickspy).toHaveBeenCalled();
  });

  it("updates displayed filename on file selection", async () => {
    const wrapper = mount(FileSelector, {
      propsData: {
        label: "Select file",
        acceptedFileTypes: "*",
        multiple: false,
      },
    });

    const file = new File(["test file"], "test-file.txt", {
      type: "text/plain",
    });

    await wrapper.setProps({
      value: [file],
    });
    expect(wrapper.find(".filename").text()).toContain("test-file.txt");
  });

  it("renders correctly with given file", () => {
    const fileName = "not-the-file-you-are-looking-for.zip";
    const file = new File(["test file"], fileName, {
      type: "text/plain",
    });

    const wrapper = mount(FileSelector, {
      propsData: {
        label: "Select file",
        acceptedFileTypes: "*",
        multiple: false,
        value: [file],
      },
    });
    expect(wrapper.find(".filename").text()).toBe(fileName);
  });
});
