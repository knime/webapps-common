import { shallowMount } from "@vue/test-utils";
import { describe, expect, it, vi, beforeEach, MockInstance } from "vitest";
import flushPromises from "flush-promises";
import type { Folder, PathAndError } from "../types";
import { toFileExplorerItem } from "../utils";

import DialogFileExplorer, { type Props } from "../DialogFileExplorer.vue";
import FileExplorer from "webapps-common/ui/components/FileExplorer/FileExplorer.vue";
import LoadingIcon from "webapps-common/ui/components/LoadingIcon.vue";
import InputField from "webapps-common/ui/components/forms/InputField.vue";

describe("DialogFileExplorer.vue", () => {
  let dataServiceSpy: MockInstance, props: Props;

  const fileName = "aFile";
  const filePath = "/path/to/containing/folder/aFile";
  const directoryName = "aDirectory";
  const filePathRelativeToFolderFromBackend = "aFile";

  const getNewRootFolderMock = (): Folder => ({
    items: [
      { isDirectory: true, name: directoryName },
      { isDirectory: false, name: fileName },
    ],
    path: null,
  });

  let getFilePathResult: PathAndError, folderFromBackend: Folder;

  beforeEach(() => {
    getFilePathResult = { path: filePath, errorMessage: null };
    folderFromBackend = getNewRootFolderMock();
  });

  const shallowMountFileChooser = (customDataServiceMethod?: MockInstance) => {
    dataServiceSpy =
      customDataServiceMethod ??
      vi.fn((params: { method?: string | undefined } | undefined) => {
        if (params?.method === "fileChooser.listItems") {
          return Promise.resolve({
            folder: folderFromBackend,
            filePathRelativeToFolder: filePathRelativeToFolderFromBackend,
          });
        } else if (params?.method === "fileChooser.getFilePath") {
          return Promise.resolve(getFilePathResult);
        }
        return Promise.resolve(null);
      });
    const context = {
      props,
      global: {
        provide: {
          getData: dataServiceSpy,
          addStateProviderListener: vi.fn(),
        },
      },
    };
    return shallowMount(DialogFileExplorer, context);
  };

  beforeEach(() => {
    props = {
      backendType: "local",
    };
  });

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
      options: ["local", null, "", { extensions: [], isWriter: false }],
    });
    expect(wrapper.findComponent(FileExplorer).exists()).toBeFalsy();
    expect(wrapper.findComponent(LoadingIcon).exists()).toBeTruthy();
    await flushPromises();
    expect(wrapper.find("span").text()).toBe("");
    expect(wrapper.findComponent(FileExplorer).exists()).toBeTruthy();
    const explorerProps = wrapper.findComponent(FileExplorer).props();
    expect(explorerProps.items).toStrictEqual(
      folderFromBackend.items.map(toFileExplorerItem),
    );
    expect(explorerProps.isRootFolder).toBeTruthy();
  });

  it("loads initial file path", async () => {
    const initialFilePath = "myPath";
    folderFromBackend.path = "currentPath";
    props.initialFilePath = initialFilePath;
    const wrapper = shallowMountFileChooser();
    expect(dataServiceSpy).toHaveBeenCalledWith({
      method: "fileChooser.listItems",
      options: [
        "local",
        null,
        initialFilePath,
        { extensions: [], isWriter: false },
      ],
    });
    await flushPromises();
    expect(wrapper.find("span").text()).toBe(folderFromBackend.path);
  });

  it("shows error message", async () => {
    const errorMessage = "myErrorMessage";
    const errorReturningDataService = vi
      .fn()
      .mockResolvedValue({ folder: folderFromBackend, errorMessage });
    const wrapper = shallowMountFileChooser(errorReturningDataService);
    await flushPromises();
    const errorMessageSpan = wrapper.find("span.error");
    expect(errorMessageSpan.text()).toBe(`(${errorMessage})`);
  });

  describe("choose file", () => {
    it("exposes a method to open the current file", async () => {
      const wrapper = shallowMountFileChooser();
      await flushPromises();
      await wrapper
        .findComponent(FileExplorer)
        .vm.$emit("update:selectedItemIds", [fileName]);

      wrapper.vm.openFile();

      expect(dataServiceSpy).toHaveBeenCalledWith({
        method: "fileChooser.getFilePath",
        options: ["local", null, fileName, null],
      });
      await flushPromises();
      expect(wrapper.emitted("chooseFile")).toStrictEqual([[filePath]]);
    });

    it("emits whether a file is selected", async () => {
      const wrapper = shallowMountFileChooser();
      await flushPromises();
      await wrapper
        .findComponent(FileExplorer)
        .vm.$emit("update:selectedItemIds", [fileName]);
      await flushPromises();
      expect(wrapper.emitted("fileIsSelected")).toStrictEqual([[true]]);
      await wrapper
        .findComponent(FileExplorer)
        .vm.$emit("update:selectedItemIds", []);
      expect(wrapper.emitted("fileIsSelected")).toStrictEqual([
        [true],
        [false],
      ]);
    });

    it("does not choose files via FileExplorer event pre default", async () => {
      const wrapper = shallowMountFileChooser();
      await flushPromises();
      await wrapper
        .findComponent(FileExplorer)
        .vm.$emit("openFile", toFileExplorerItem(folderFromBackend.items[1]));
      expect(dataServiceSpy).not.toHaveBeenCalledWith({
        method: "fileChooser.getFilePath",
        options: ["local", null, fileName, null],
      });
      await flushPromises();
      expect(wrapper.emitted("chooseFile")).toBeUndefined();
    });

    it("chooses files via FileExplorer event if desired", async () => {
      props.openFileByExplorer = true;
      const wrapper = shallowMountFileChooser();
      await flushPromises();
      await wrapper
        .findComponent(FileExplorer)
        .vm.$emit("openFile", toFileExplorerItem(folderFromBackend.items[1]));
      expect(dataServiceSpy).toHaveBeenCalledWith({
        method: "fileChooser.getFilePath",
        options: ["local", null, fileName, null],
      });
      await flushPromises();
      expect(wrapper.emitted("chooseFile")).toStrictEqual([[filePath]]);
    });

    it("does not choose invalid files displaying an error instead", async () => {
      props.openFileByExplorer = true;
      const wrapper = shallowMountFileChooser();
      const errorMessage = "myErrorMessage";
      getFilePathResult = { path: null, errorMessage };
      await flushPromises();
      await wrapper
        .findComponent(FileExplorer)
        .vm.$emit("openFile", toFileExplorerItem(folderFromBackend.items[1]));
      expect(dataServiceSpy).toHaveBeenCalledWith({
        method: "fileChooser.getFilePath",
        options: ["local", null, fileName, null],
      });
      await flushPromises();
      expect(wrapper.emitted("chooseFile")).toBeUndefined();
      const errorMessageSpan = wrapper.find("span.error");
      expect(errorMessageSpan.text()).toBe(`(${errorMessage})`);
    });
  });

  describe("open directory", () => {
    it("opens a directory via FileExplorer event", async () => {
      const wrapper = shallowMountFileChooser();
      await flushPromises();
      await wrapper
        .findComponent(FileExplorer)
        .vm.$emit("changeDirectory", directoryName);
      expect(dataServiceSpy).toHaveBeenCalledWith({
        method: "fileChooser.listItems",
        options: [
          "local",
          folderFromBackend.path,
          directoryName,
          { extensions: [], isWriter: false },
        ],
      });
    });
  });

  describe("file extensions", () => {
    it("uses file extensions when requesting listed items", () => {
      props.filteredExtensions = ["pdf"];
      shallowMountFileChooser();
      expect(dataServiceSpy).toHaveBeenCalledWith({
        method: "fileChooser.listItems",
        options: [
          "local",
          null,
          "",
          { extensions: props.filteredExtensions, isWriter: false },
        ],
      });
    });

    it("uses file extensions when requesting file name", async () => {
      props.appendedExtension = "pdf";
      props.openFileByExplorer = true;
      const wrapper = shallowMountFileChooser();
      await flushPromises();
      await wrapper
        .findComponent(FileExplorer)
        .vm.$emit("openFile", toFileExplorerItem(folderFromBackend.items[1]));
      expect(dataServiceSpy).toHaveBeenCalledWith({
        method: "fileChooser.getFilePath",
        options: ["local", null, fileName, props.appendedExtension],
      });
    });
  });

  describe("writer", () => {
    beforeEach(() => {
      props.isWriter = true;
    });

    it("shows an input field to write a field name and emits it on choose", async () => {
      const wrapper = shallowMountFileChooser();
      await flushPromises();
      expect(dataServiceSpy).toHaveBeenCalledWith({
        method: "fileChooser.listItems",
        options: ["local", null, "", { isWriter: true, extensions: [] }],
      });
      const inputField = wrapper.findComponent(InputField);
      expect(inputField.exists()).toBeTruthy();
      // Predefined file name from input path
      expect(inputField.props().modelValue).toBe(
        filePathRelativeToFolderFromBackend,
      );
      // Deselect the predefined file name
      await inputField.vm.$emit("update:model-value", "");
      const inputText = "newFile.txt";
      await inputField.vm.$emit("update:model-value", inputText);
      expect(inputField.props().modelValue).toBe(inputText);
      await wrapper.vm.openFile();
      expect(dataServiceSpy).toHaveBeenCalledWith({
        method: "fileChooser.getFilePath",
        options: ["local", null, inputText, null],
      });
      await flushPromises();
      expect(wrapper.emitted("chooseFile")).toStrictEqual([[filePath]]);
    });

    it("sets the value of the selected file as input", async () => {
      const wrapper = shallowMountFileChooser();
      await flushPromises();

      await wrapper
        .findComponent(FileExplorer)
        .vm.$emit("update:selectedItemIds", [fileName]);

      const inputField = wrapper.findComponent(InputField);
      expect(inputField.props().modelValue).toBe(fileName);
    });

    it("unsets the value of the selected file as input", async () => {
      const wrapper = shallowMountFileChooser();
      await flushPromises();

      const inputField = wrapper.findComponent(InputField);
      const inputText = "newFile.txt";
      await inputField.vm.$emit("update:model-value", inputText);

      await wrapper
        .findComponent(FileExplorer)
        .vm.$emit("update:selectedItemIds", [directoryName]);

      expect(inputField.props().modelValue).toBe("");
    });
  });
});
