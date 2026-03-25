import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import type { VueWrapper } from "@vue/test-utils";

import { KdsButton } from "@knime/kds-components";

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

  const getFileInput = (wrapper: VueWrapper) =>
    wrapper.find('input[type="file"]');

  const getFilenameSpan = (wrapper: VueWrapper) => wrapper.find(".filename");

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

  it("renders file input and button", () => {
    expect(getFileInput(wrapper).exists()).toBe(true);
    expect(wrapper.findComponent(KdsButton).exists()).toBe(true);
    expect(wrapper.findComponent(KdsButton).props("label")).toBe("Select file");
    expect(getFileInput(wrapper).attributes("multiple")).toBeUndefined();
    expect(getFilenameSpan(wrapper).text()).toBe("No file selected");
    expect(getFileInput(wrapper).attributes("aria-label")).toBe(
      props.control.label,
    );
  });

  it("uses default accept attribute '*' on file input", () => {
    expect(getFileInput(wrapper).attributes("accept")).toBe("*");
  });

  it("uses custom accept from uischema options", async () => {
    props.control.uischema.options = {
      accept: ".pdf,.doc",
    };
    const { wrapper } = await mountJsonFormsControlLabelContent(
      FileUploadControl,
      { props },
    );
    expect(getFileInput(wrapper).attributes("accept")).toBe(".pdf,.doc");
  });

  it("uses multiple from uischema options", async () => {
    props.control.uischema.options = {
      multiple: true,
    };
    const { wrapper } = await mountJsonFormsControlLabelContent(
      FileUploadControl,
      { props },
    );
    expect(getFileInput(wrapper).attributes("multiple")).toBeDefined();
    expect(wrapper.findComponent(KdsButton).props("label")).toBe(
      "Select files",
    );
  });

  it("calls handleChange when files are selected", async () => {
    const mockFile = createMockFile("test.txt");
    const fileInput = getFileInput(wrapper);

    const mockFileList = {
      0: mockFile,
      length: 1,
      item: (index: number) => (index === 0 ? mockFile : null),
    };

    Object.defineProperty(fileInput.element, "files", {
      value: mockFileList,
      writable: true,
    });

    await fileInput.trigger("change");

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
    const fileInput = getFileInput(wrapper);

    const mockFileList = {
      0: mockFiles[0],
      1: mockFiles[1],
      length: 2,
      item: (index: number) => mockFiles[index] ?? null,
    };

    Object.defineProperty(fileInput.element, "files", {
      value: mockFileList,
      writable: true,
    });

    await fileInput.trigger("change");

    expect(handleChange).toHaveBeenCalledWith(path, mockFiles);
  });

  it("displays initial filename from control data", async () => {
    const initialFiles = [createMockFile("initial.txt")];
    props.control.data = initialFiles;
    const { wrapper } = await mountJsonFormsControlLabelContent(
      FileUploadControl,
      { props },
    );
    expect(getFilenameSpan(wrapper).text()).toBe("initial.txt");
  });

  it("displays multiple filenames separated by comma", async () => {
    const initialFiles = [
      createMockFile("file1.txt"),
      createMockFile("file2.txt"),
    ];
    props.control.data = initialFiles;
    const { wrapper } = await mountJsonFormsControlLabelContent(
      FileUploadControl,
      { props },
    );
    expect(getFilenameSpan(wrapper).text()).toBe("file1.txt, file2.txt");
  });
});
