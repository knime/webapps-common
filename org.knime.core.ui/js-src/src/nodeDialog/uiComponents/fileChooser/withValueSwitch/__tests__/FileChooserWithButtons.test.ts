import { shallowMount } from "@vue/test-utils";
import { describe, expect, it, vi, beforeEach, MockInstance } from "vitest";
import flushPromises from "flush-promises";
import type { Folder, PathAndError } from "../../types";

import FileChooserWithButtons from "../FileChooserWithButtons.vue";
import { FileExplorer, InputField, Button } from "@knime/components";
import DialogFileExplorer from "../../DialogFileExplorer.vue";

describe("FileChooserWithButtons.vue", () => {
  let dataServiceSpy: MockInstance;

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

  const shallowMountFileChooser = (
    props: {
      initialFilePath?: string;
      isWriter?: boolean;
      filteredExtensions?: string[];
      appendedExtension?: string;
    } = {},
    customDataServiceMethod?: MockInstance,
  ) => {
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
      props: {
        ...props,
        backendType: "local" as const,
      },
      global: {
        provide: {
          getData: dataServiceSpy,
          addStateProviderListener: vi.fn(),
        },
        stubs: {
          DialogFileExplorer,
          Button: {
            inheritAttrs: false,
            props: {
              disabled: {
                type: Boolean,
                required: false,
              },
            },
            template: "<slot/>",
          },
        },
      },
    };
    return shallowMount(FileChooserWithButtons, context);
  };

  it("renders", () => {
    const wrapper = shallowMountFileChooser();
    expect(wrapper.findComponent(DialogFileExplorer).exists()).toBeTruthy();
    const buttons = wrapper.findAllComponents(Button);
    expect(buttons.length).toBe(2);
    expect(buttons.at(1)!.props().disabled).toBe(true);
  });

  it("shows a cancel button", async () => {
    const wrapper = shallowMountFileChooser();
    const buttons = wrapper.findAllComponents(Button);
    const cancelButton = buttons.at(0);
    expect(cancelButton?.text()).toContain("Cancel");
    await cancelButton?.vm.$emit("click");
    expect(wrapper.emitted("cancel")).toStrictEqual([[]]);
  });

  it("shows a 'Choose' button when a file is selected", async () => {
    const wrapper = shallowMountFileChooser();
    await flushPromises();
    await wrapper
      .findComponent(FileExplorer)
      .vm.$emit("update:selectedItemIds", [fileName]);
    const buttons = wrapper.findAllComponents(Button);
    expect(buttons.length).toBe(2);
    const chooseButton = buttons.at(1);
    expect(chooseButton?.props().disabled).toBe(false);
    expect(chooseButton?.text()).toContain("Choose");
    await chooseButton?.vm.$emit("click");
    expect(dataServiceSpy).toHaveBeenCalledWith({
      method: "fileChooser.getFilePath",
      options: ["local", null, fileName, null],
    });
    await flushPromises();
    expect(wrapper.emitted("chooseFile")).toStrictEqual([[filePath]]);
  });

  it("enables choosing from custom text input if isWriter is true", async () => {
    const wrapper = shallowMountFileChooser({ isWriter: true });
    await flushPromises();
    const inputField = wrapper.findComponent(InputField);
    const inputText = "newFile.txt";
    await inputField.vm.$emit("update:model-value", inputText);
    expect(inputField.props().modelValue).toBe(inputText);

    const buttons = wrapper.findAllComponents(Button);
    expect(buttons.length).toBe(2);
    const chooseButton = buttons.at(1);
    expect(chooseButton?.props().disabled).toBe(false);
    expect(chooseButton?.text()).toContain("Choose");
    await chooseButton?.vm.$emit("click");

    expect(dataServiceSpy).toHaveBeenCalledWith({
      method: "fileChooser.getFilePath",
      options: ["local", null, inputText, null],
    });
    await flushPromises();
    expect(wrapper.emitted("chooseFile")).toStrictEqual([[filePath]]);
  });
});
