import { shallowMount } from "@vue/test-utils";
import { describe, expect, it, vi, type SpyInstance, beforeEach } from "vitest";
import FileChooser from "../FileChooser.vue";
import FileExplorer from "webapps-common/ui/components/FileExplorer/FileExplorer.vue";
import type { Folder } from "../types";
import flushPromises from "flush-promises";
import { toFileExplorerItem } from "../utils";

import Button from "@@/webapps-common/ui/components/Button.vue";
import LoadingIcon from "@@/webapps-common/ui/components/LoadingIcon.vue";
import InputField from "@@/webapps-common/ui/components/forms/InputField.vue";

describe("FileChooser.vue", () => {
  let dataServiceSpy: SpyInstance;

  const fileName = "aFile";
  const filePath = "/path/to/containing/folder/aFile";
  const directoryName = "aDirectory";
  let folderFromBackend: Folder;
  const getNewRootFolderMock = (): Folder => ({
    items: [
      { isDirectory: true, name: directoryName },
      { isDirectory: false, name: fileName },
    ],
    path: null,
  });

  beforeEach(() => {
    folderFromBackend = getNewRootFolderMock();
  });

  const shallowMountFileChooser = (
    props: { initialFilePath?: string; isWriter?: boolean } = {},
    customDataServiceMethod?: SpyInstance,
  ) => {
    dataServiceSpy =
      customDataServiceMethod ??
      vi.fn((params: { method?: string | undefined } | undefined) => {
        if (params?.method === "fileChooser.listItems") {
          return Promise.resolve({ folder: folderFromBackend });
        } else if (params?.method === "fileChooser.getFilePath") {
          return Promise.resolve(filePath);
        }
        return Promise.resolve(null);
      });
    const context = {
      props,
      global: {
        provide: {
          getJsonDataService: () => ({
            data: dataServiceSpy,
          }),
        },
        stubs: {
          Button: {
            inheritAttrs: false,
            template: "<slot/>",
          },
        },
      },
    };
    return shallowMount(FileChooser as any, context);
  };

  it("maps backend items to fileExplorer items", () => {
    expect(
      toFileExplorerItem({ isDirectory: true, name: "fileName" }),
    ).toStrictEqual({
      id: "fileName",
      name: "fileName",
      isDirectory: true,
      isOpen: false,
      isOpenableFile: true,
      canBeDeleted: false,
      canBeRenamed: false,
    });
  });

  it("renders", async () => {
    const wrapper = shallowMountFileChooser();
    expect(dataServiceSpy).toHaveBeenCalledWith({
      method: "fileChooser.listItems",
      options: ["local", null, ""],
    });
    expect(wrapper.findComponent(FileExplorer).exists()).toBeFalsy();
    expect(wrapper.findComponent(LoadingIcon).exists()).toBeTruthy();
    await flushPromises();
    expect(wrapper.find("span").text()).toBe("Root directories");
    expect(wrapper.findComponent(FileExplorer).exists()).toBeTruthy();
    const explorerProps = wrapper.findComponent(FileExplorer).props();
    expect(explorerProps.items).toStrictEqual(
      folderFromBackend.items.map(toFileExplorerItem),
    );
    expect(explorerProps.isRootFolder).toBeTruthy();

    const buttons = wrapper.findAllComponents(Button);
    expect(buttons.length).toBe(1);
  });

  it("loads initial file path", async () => {
    const initialFilePath = "myPath";
    folderFromBackend.path = "currentPath";
    const wrapper = shallowMountFileChooser({ initialFilePath });
    expect(dataServiceSpy).toHaveBeenCalledWith({
      method: "fileChooser.listItems",
      options: ["local", null, initialFilePath],
    });
    await flushPromises();
    expect(wrapper.find("span").text()).toBe(folderFromBackend.path);
  });

  it("shows error message", async () => {
    const errorMessage = "myErrorMessage";
    const errorReturningDataService = vi
      .fn()
      .mockResolvedValue({ folder: folderFromBackend, errorMessage });
    const wrapper = shallowMountFileChooser({}, errorReturningDataService);
    await flushPromises();
    const errorMessageSpan = wrapper.find("span.error");
    expect(errorMessageSpan.text()).toBe(`(${errorMessage})`);
  });

  it("shows a cancel button", async () => {
    const wrapper = shallowMountFileChooser();
    const buttons = wrapper.findAllComponents(Button);
    const cancelButton = buttons.at(0);
    expect(cancelButton?.text()).toContain("Cancel");
    await cancelButton?.vm.$emit("click");
    expect(wrapper.emitted("cancel")).toStrictEqual([[]]);
  });

  describe("choose file", () => {
    it("shows a 'Choose' button when a file is selected", async () => {
      const wrapper = shallowMountFileChooser();
      await flushPromises();
      await wrapper
        .findComponent(FileExplorer)
        .vm.$emit("changeSelection", [fileName]);
      const buttons = wrapper.findAllComponents(Button);
      expect(buttons.length).toBe(2);
      const chooseButton = buttons.at(1);
      expect(chooseButton?.text()).toContain("Choose");
      await chooseButton?.vm.$emit("click");
      expect(dataServiceSpy).toHaveBeenCalledWith({
        method: "fileChooser.getFilePath",
        options: ["local", null, fileName],
      });
      await flushPromises();
      expect(wrapper.emitted("chooseFile")).toStrictEqual([[filePath]]);
    });

    it("chooses files via FileExplorer event", async () => {
      const wrapper = shallowMountFileChooser();
      await flushPromises();
      await wrapper
        .findComponent(FileExplorer)
        .vm.$emit("openFile", toFileExplorerItem(folderFromBackend.items[1]));
      expect(dataServiceSpy).toHaveBeenCalledWith({
        method: "fileChooser.getFilePath",
        options: ["local", null, fileName],
      });
      await flushPromises();
      expect(wrapper.emitted("chooseFile")).toStrictEqual([[filePath]]);
    });
  });

  describe("open directory", () => {
    it("shows a 'Open' button when a directory is selected", async () => {
      const wrapper = shallowMountFileChooser();
      await flushPromises();
      await wrapper
        .findComponent(FileExplorer)
        .vm.$emit("changeSelection", [directoryName]);
      const buttons = wrapper.findAllComponents(Button);
      expect(buttons.length).toBe(2);
      const openButton = buttons.at(1);
      expect(openButton?.text()).toContain("Open");
      await openButton?.vm.$emit("click");
      expect(dataServiceSpy).toHaveBeenCalledWith({
        method: "fileChooser.listItems",
        options: ["local", folderFromBackend.path, directoryName],
      });
    });

    it("opens a directory via FileExplorer event", async () => {
      const wrapper = shallowMountFileChooser();
      await flushPromises();
      await wrapper
        .findComponent(FileExplorer)
        .vm.$emit("changeDirectory", directoryName);
      expect(dataServiceSpy).toHaveBeenCalledWith({
        method: "fileChooser.listItems",
        options: ["local", folderFromBackend.path, directoryName],
      });
    });
  });

  describe("writer", () => {
    it("shows an input field to write a field name and emits it on choose button click", async () => {
      const wrapper = shallowMountFileChooser({ isWriter: true });
      await flushPromises();
      const inputField = wrapper.findComponent(InputField);
      expect(inputField.exists()).toBeTruthy();
      expect(inputField.props().modelValue).toBe("");
      expect(wrapper.findAllComponents(Button).length).toBe(1);

      const inputText = "newFile.txt";
      await inputField.vm.$emit("update:model-value", inputText);
      expect(inputField.props().modelValue).toBe(inputText);
      const buttons = wrapper.findAllComponents(Button);
      expect(buttons.length).toBe(2);
      const chooseButton = buttons.at(1);
      expect(chooseButton?.text()).toContain("Choose");
      await chooseButton?.vm.$emit("click");
      expect(dataServiceSpy).toHaveBeenCalledWith({
        method: "fileChooser.getFilePath",
        options: ["local", null, inputText],
      });
      await flushPromises();
      expect(wrapper.emitted("chooseFile")).toStrictEqual([[filePath]]);
    });

    it("sets the value of the selected file as input", async () => {
      const wrapper = shallowMountFileChooser({ isWriter: true });
      await flushPromises();

      await wrapper
        .findComponent(FileExplorer)
        .vm.$emit("changeSelection", [fileName]);

      const inputField = wrapper.findComponent(InputField);
      expect(inputField.props().modelValue).toBe(fileName);
    });

    it("unsets the value of the selected file as input", async () => {
      const wrapper = shallowMountFileChooser({ isWriter: true });
      await flushPromises();

      const inputField = wrapper.findComponent(InputField);
      const inputText = "newFile.txt";
      await inputField.vm.$emit("update:model-value", inputText);

      await wrapper
        .findComponent(FileExplorer)
        .vm.$emit("changeSelection", [directoryName]);

      expect(inputField.props().modelValue).toBe("");
    });
  });
});
