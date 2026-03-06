import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { nextTick } from "vue";
import type { VueWrapper } from "@vue/test-utils";

import { FileSelector } from "@knime/components";

import {
  type VueControlTestProps,
  getControlBase,
  mountJsonFormsControlLabelContent,
} from "../../../testUtils/component";
import FileUploadControl from "../FileUploadControl.vue";

describe("FileUploadControl", () => {
  let wrapper: VueWrapper,
    props: VueControlTestProps<typeof FileUploadControl>,
    handleChange: Mock;

  const path = "test";

  const createMockFile = (name: string): File => {
    return new File(["content"], name, { type: "text/plain" });
  };

  beforeEach(async () => {
    props = {
      control: {
        ...getControlBase(path),
        data: [],
        schema: {
          type: "array",
          title: "File Upload",
        },
        uischema: {
          type: "Control",
          scope: "#/properties/fileUpload",
          options: {},
        },
      },
      disabled: false,
      isValid: false,
      labelForId: "fileUpload",
    };
    const component = await mountJsonFormsControlLabelContent(
      FileUploadControl,
      {
        props,
      },
    );
    wrapper = component.wrapper;
    handleChange = component.handleChange;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders FileSelector component", () => {
    expect(wrapper.findComponent(FileSelector).exists()).toBe(true);
    expect(wrapper.findComponent(FileSelector).props("label")).toBe(
      props.control.label,
    );
    expect(wrapper.findComponent(FileSelector).props("acceptedFileTypes")).toBe(
      "*",
    );
    expect(wrapper.findComponent(FileSelector).props("multiple")).toBe(false);
  });

  it("uses custom acceptedFileTypes from uischema options", async () => {
    props.control.uischema.options = {
      accept: ".pdf,.doc",
    };
    const { wrapper } = await mountJsonFormsControlLabelContent(
      FileUploadControl,
      { props },
    );
    expect(wrapper.findComponent(FileSelector).props("acceptedFileTypes")).toBe(
      ".pdf,.doc",
    );
  });

  it("uses multiple from uischema options", async () => {
    props.control.uischema.options = {
      multiple: true,
    };
    const { wrapper } = await mountJsonFormsControlLabelContent(
      FileUploadControl,
      { props },
    );
    expect(wrapper.findComponent(FileSelector).props("multiple")).toBe(true);
  });

  it("calls handleChange when files are selected", async () => {
    const mockFile = createMockFile("test.txt");
    wrapper
      .findComponent(FileSelector)
      .vm.$emit("update:modelValue", [mockFile]);
    await nextTick();
    expect(handleChange).toHaveBeenCalledWith(path, [mockFile]);
  });

  it("calls handleChange with multiple files", async () => {
    props.control.uischema.options = {
      multiple: true,
    };
    const { wrapper, handleChange } = await mountJsonFormsControlLabelContent(
      FileUploadControl,
      { props },
    );
    const mockFiles = [
      createMockFile("file1.txt"),
      createMockFile("file2.txt"),
    ];
    wrapper
      .findComponent(FileSelector)
      .vm.$emit("update:modelValue", mockFiles);
    await nextTick();
    expect(handleChange).toHaveBeenCalledWith(path, mockFiles);
  });

  it("sets initial files from control data", async () => {
    const initialFiles = [createMockFile("initial.txt")];
    props.control.data = initialFiles;
    const { wrapper } = await mountJsonFormsControlLabelContent(
      FileUploadControl,
      { props },
    );
    expect(wrapper.findComponent(FileSelector).props("modelValue")).toEqual(
      initialFiles,
    );
  });

  it("does not call handleChange when files have not changed", async () => {
    const mockFile = createMockFile("test.txt");
    props.control.data = [mockFile];
    const { wrapper, handleChange } = await mountJsonFormsControlLabelContent(
      FileUploadControl,
      { props },
    );

    // Emit the same file again
    wrapper
      .findComponent(FileSelector)
      .vm.$emit("update:modelValue", [mockFile]);
    await nextTick();
    expect(handleChange).not.toHaveBeenCalled();
  });
});
