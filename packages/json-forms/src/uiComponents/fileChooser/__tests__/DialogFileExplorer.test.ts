import {
  type MockInstance,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { shallowMount } from "@vue/test-utils";
import flushPromises from "flush-promises";

import {
  Breadcrumb,
  FileExplorer,
  InputField,
  LoadingIcon,
} from "@knime/components";
import HouseIcon from "@knime/styles/img/icons/house.svg";

import DialogFileExplorer, {
  type DialogFileExplorerProps,
} from "../DialogFileExplorer.vue";
import type { Folder, PathAndError } from "../types";
import { toFileExplorerItem } from "../utils";

describe("DialogFileExplorer.vue", () => {
  let dataServiceSpy: MockInstance, props: DialogFileExplorerProps;

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
    parentFolders: [],
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
    expect(wrapper.findComponent(Breadcrumb).exists()).toBeFalsy();
    expect(wrapper.findComponent(FileExplorer).exists()).toBeFalsy();
    expect(wrapper.findComponent(LoadingIcon).exists()).toBeTruthy();
    await flushPromises();
    expect(wrapper.findComponent(Breadcrumb).exists()).toBeTruthy();
    expect(wrapper.findComponent(FileExplorer).exists()).toBeTruthy();
    const explorerProps = wrapper.findComponent(FileExplorer).props();
    expect(explorerProps.items).toStrictEqual(
      folderFromBackend.items.map(toFileExplorerItem),
    );
    expect(explorerProps.isRootFolder).toBeTruthy();
  });

  describe("breadcrumbs", () => {
    it.each([
      {
        parentFolders: [
          {
            name: null,
            path: null,
          },
        ],
        breadcrumbItems: [
          {
            icon: HouseIcon,
            clickable: false,
            title: "Root",
            path: null,
          },
        ],
      },
      {
        parentFolders: [
          {
            name: null,
            path: "/",
          },
          {
            name: "parent",
            path: "/parent",
          },
          {
            name: "folder",
            path: "/parent/folder",
          },
        ],
        breadcrumbItems: [
          {
            text: "/",
            clickable: true,
            title: "/",
            path: "/",
          },
          {
            text: "parent",
            clickable: true,
            title: "parent",
            path: "/parent",
          },
          {
            text: "folder",
            clickable: false,
            title: "folder",
            path: "/parent/folder",
          },
        ],
      },
    ])(
      "shows parent folders as breadcrumbs",
      async ({ parentFolders, breadcrumbItems }) => {
        const initialFilePath = "myPath";
        folderFromBackend.path = "currentPath";
        folderFromBackend.parentFolders = parentFolders;
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
        expect(wrapper.findComponent(Breadcrumb).props().items).toStrictEqual(
          breadcrumbItems,
        );
      },
    );

    it("shows breadcrumbRoot as root path of breadcrumb", async () => {
      const breadcrumbRoot = "/mySpace";
      props.breadcrumbRoot = breadcrumbRoot;
      folderFromBackend.parentFolders = [{ path: null, name: null }];
      const wrapper = shallowMountFileChooser();
      await flushPromises();
      expect(wrapper.findComponent(Breadcrumb).props().items).toStrictEqual([
        {
          text: breadcrumbRoot,
          clickable: false,
          title: breadcrumbRoot,
          path: null,
        },
      ]);
    });

    it("navigates to parent folder on breadcrumb click", async () => {
      const wrapper = shallowMountFileChooser();
      await flushPromises();
      const parentFolderPath = "/parent";
      wrapper
        .findComponent(Breadcrumb)
        .vm.$emit("click-item", { path: parentFolderPath });
      expect(dataServiceSpy).toHaveBeenCalledWith({
        method: "fileChooser.listItems",
        options: [
          expect.any(String),
          parentFolderPath,
          null,
          expect.any(Object),
        ],
      });
    });
  });

  it("reloads initial file path on backend change", async () => {
    const wrapper = shallowMountFileChooser();
    expect(dataServiceSpy).toHaveBeenCalledTimes(1);
    const newBackendType = "notLocalAnymore" as any;
    await wrapper.setProps({
      backendType: newBackendType,
    });
    expect(dataServiceSpy).toHaveBeenNthCalledWith(2, {
      method: "fileChooser.listItems",
      options: [newBackendType, null, "", { extensions: [], isWriter: false }],
    });
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
