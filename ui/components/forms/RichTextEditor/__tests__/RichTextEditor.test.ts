import { describe, expect, it, vi, type Mock, afterEach } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import { h, shallowRef, type Slot } from "vue";

import { useEditor } from "@tiptap/vue-3";

import FunctionButton from "../../../FunctionButton.vue";

import RichTextEditor from "../RichTextEditor.vue";
import SubMenu from "../../../SubMenu.vue";

// mock for editor's isActive function. declared separately due to mock hoisting via vi.mock
const mockEditorIsActive = vi.fn();

const createMockEditor = (params: any) => {
  const actionNames = [
    "toggleBold",
    "toggleItalic",
    "toggleUnderline",
    "toggleBulletList",
    "toggleOrderedList",
    "setTextAlign",
    "setTextAlign",
    "setTextAlign",
    "setHeading",
    "setFontSize",
    "unsetFontSize",
    "setLink",
    "unsetLink",
    "insertContent",
    "insertContentAt",
  ] as const;

  type Actions = Record<
    (typeof actionNames)[number],
    Mock<any[], { run: () => void }>
  >;

  const actions: Actions = actionNames.reduce((acc, action) => {
    acc[action] = vi.fn(() => ({ run: () => {} }));
    return acc;
  }, {} as Actions);

  return shallowRef({
    isActive: mockEditorIsActive,
    chain: () => ({
      focus: () => ({
        ...actions,
        extendMarkRange: vi.fn(() => ({ unsetLink: actions.unsetLink })),
      }),
    }),
    setEditable: vi.fn(),
    getHTML: () => "<p>mock html</p>",
    commands: {
      insertContent: vi.fn(),
      setTextSelection: vi.fn(),
      focus: vi.fn(),
    },
    view: { state: { selection: { from: 5 } } },
    params,
  });
};

let mockEditor: ReturnType<typeof createMockEditor>;

vi.mock("@tiptap/vue-3", () => {
  return {
    EditorContent: {
      template: "<div></div>",
    },
    useEditor: vi.fn((params) => {
      mockEditor = createMockEditor(params);
      return mockEditor;
    }),
  };
});

describe("RichTextEditor.vue", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps = {
    modelValue: "<p>Hello world</p>",
  };

  const doMount = ({
    props = {},
    slots = {
      customToolbar: null,
    },
  } = {}) => {
    const _slots = {
      ...(slots.customToolbar ? { customToolbar: slots.customToolbar } : {}),
    } as Record<string, Slot>;

    const wrapper = mount(RichTextEditor, {
      props: { ...defaultProps, ...props },
      global: {
        stubs: {
          EditorContent: true,
        },
      },
      slots: _slots,
    });

    return { wrapper };
  };

  it("should initialize the editor correctly", () => {
    const { wrapper } = doMount({ props: { baseExtensions: { all: true } } });

    expect(useEditor).toHaveBeenCalledWith(
      expect.objectContaining({
        content: defaultProps.modelValue,
        extensions: expect.any(Array),
        editable: true,
        onUpdate: expect.any(Function),
      }),
    );

    expect(mockEditor.value.params.extensions.length).toBe(4);
    expect(wrapper.classes("with-border")).toBeTruthy();
    expect(wrapper.classes("disabled")).toBeFalsy();
  });

  it("renders without border", () => {
    const { wrapper } = doMount({ props: { withBorder: false } });

    expect(wrapper.classes("with-border")).toBeFalsy();
  });

  it("renders disabled", () => {
    const { wrapper } = doMount({ props: { disabled: true } });

    expect(wrapper.classes("disabled")).toBeTruthy();
  });

  it("should emit an 'update:modelValue' event", () => {
    const { wrapper } = doMount({ props: { baseExtensions: { all: true } } });

    // trigger update function
    mockEditor.value.params.onUpdate();

    expect(wrapper.emitted("update:modelValue")).toBeDefined();
  });

  describe("base extensions", () => {
    it("should not have extensions enabled by default", () => {
      doMount({
        props: { baseExtensions: {} },
      });

      const baseExtensions = [
        "bold",
        "italic",
        "bulletList",
        "orderedList",
        "heading",
      ];

      const [starterKitExtension] = mockEditor.value.params.extensions;

      baseExtensions.forEach((toolName) => {
        expect(starterKitExtension.options[toolName]).toBe(false);
      });

      const underlineExtension = mockEditor.value.params.extensions.find(
        (extension: any) => extension.name === "underline",
      );
      expect(underlineExtension).toBeUndefined();

      const textAlignExtension = mockEditor.value.params.extensions.find(
        (extension: any) => extension.name === "textAlign",
      );
      expect(textAlignExtension).toBeUndefined();
    });

    it.each([
      ["bold"],
      ["italic"],
      ["bulletList"],
      ["orderedList"],
      ["heading"],
    ])(
      "should enable the tools specified via props (StarterKit)",
      (toolName) => {
        doMount({
          props: { baseExtensions: { [toolName]: true } },
        });

        const [starterKitExtension] = mockEditor.value.params.extensions;
        // undefined means enabled
        expect(starterKitExtension.options[toolName]).toBeUndefined();
      },
    );

    it("should enable the underline tool", () => {
      doMount({
        props: { baseExtensions: { underline: true } },
      });

      const underlineExtension = mockEditor.value.params.extensions.find(
        (extension: any) => extension.name === "underline",
      );
      expect(underlineExtension).toBeDefined();
    });

    describe("textAlign", () => {
      it("should enable the textAlign tool (with heading)", () => {
        doMount({
          props: { baseExtensions: { textAlign: true, heading: true } },
        });

        const textAlignExtension = mockEditor.value.params.extensions.find(
          (extension: any) => extension.name === "textAlign",
        );

        expect(textAlignExtension).toBeDefined();
        expect(textAlignExtension.options.types).toEqual([
          "heading",
          "paragraph",
        ]);
      });

      it("should enable the textAlign tool (without heading)", () => {
        doMount({
          props: { baseExtensions: { textAlign: true } },
        });

        const textAlignExtension = mockEditor.value.params.extensions.find(
          (extension: any) => extension.name === "textAlign",
        );
        expect(textAlignExtension).toBeDefined();
        expect(textAlignExtension.options.types).toEqual(["paragraph"]);
      });
    });
  });

  it("should set editable state", async () => {
    const { wrapper } = doMount({ props: { baseExtensions: { all: true } } });

    expect(useEditor).toHaveBeenCalledWith(
      expect.objectContaining({
        editable: true,
      }),
    );

    await wrapper.setProps({ editable: false });
    expect(mockEditor.value.setEditable).toHaveBeenCalledWith(false);
  });

  it("is not editable if editor is in disabled state", async () => {
    const { wrapper } = doMount({
      props: {
        baseExtensions: { all: true },
        disabled: true,
      },
    });

    expect(useEditor).toHaveBeenCalledWith(
      expect.objectContaining({
        editable: false,
      }),
    );

    await wrapper.setProps({ editable: true });
    expect(mockEditor.value.setEditable).not.toHaveBeenCalled();
    await wrapper.setProps({ disabled: false });
    expect(mockEditor.value.setEditable).toHaveBeenCalledWith(true);
  });

  it("disabled state also sets not editable state", async () => {
    const { wrapper } = doMount({ props: { baseExtensions: { all: true } } });

    expect(useEditor).toHaveBeenCalledWith(
      expect.objectContaining({
        editable: true,
      }),
    );
    await wrapper.setProps({ disabled: true });
    expect(mockEditor.value.setEditable).toHaveBeenCalledWith(false);
  });

  it("should focus editor on mount", async () => {
    doMount({ props: { autofocus: true, baseExtensions: { all: true } } });

    await new Promise((r) => setTimeout(r, 0));

    expect(mockEditor.value.commands.focus).toHaveBeenCalled();
  });

  it("should focus editor if editable prop changes", async () => {
    const { wrapper } = doMount({
      props: {
        editable: false,
        autofocus: true,
        baseExtensions: { all: true },
      },
    });

    expect(mockEditor.value.commands.focus).not.toHaveBeenCalled();

    await wrapper.setProps({ editable: true });

    expect(mockEditor.value.commands.focus).toHaveBeenCalled();
  });

  describe("tool interactions", () => {
    const findToolComponentById = (_wrapper: VueWrapper<any>, id: string) => {
      const foundComponent = _wrapper
        .findAllComponents(FunctionButton)
        .find((_componentWrapper) => {
          return _componentWrapper.find(`[data-testid="${id}"]`).exists();
        });

      return foundComponent;
    };

    it("should render all tools", () => {
      const { wrapper } = doMount({ props: { baseExtensions: { all: true } } });

      expect(wrapper.findAll(".tool").length).toBe(8);
      const secondaryItemsMenu = wrapper.findComponent(SubMenu);
      expect(secondaryItemsMenu.exists()).toBeTruthy();
      expect(secondaryItemsMenu.props().items.length).toBe(5);
    });

    it("should set the active state correctly", () => {
      mockEditorIsActive.mockImplementation((name) => name === "bold");
      const { wrapper } = doMount({ props: { baseExtensions: { all: true } } });

      expect(findToolComponentById(wrapper, "bold")?.props("active")).toBe(
        true,
      );
      expect(findToolComponentById(wrapper, "italic")?.props("active")).toBe(
        false,
      );
    });

    it("should not allow text alignment when lists are active", () => {
      // mock the isActive state of the editor to simulate both the
      // lists and the text alignment as being active
      mockEditorIsActive.mockImplementation((param) => {
        // eslint-disable-next-line vitest/no-conditional-tests
        return typeof param === "string"
          ? // eslint-disable-next-line vitest/no-conditional-tests
            param === "bulletList" || param === "orderedList"
          : Boolean(param.textAlign);
      });

      const { wrapper } = doMount({ props: { baseExtensions: { all: true } } });

      const textAlignLeft = findToolComponentById(wrapper, "align-left");
      const textAlignCenter = findToolComponentById(wrapper, "align-center");
      const textAlignRight = findToolComponentById(wrapper, "align-right");

      expect(textAlignLeft?.props("active")).toBe(false);
      expect(textAlignCenter?.props("active")).toBe(false);
      expect(textAlignRight?.props("active")).toBe(false);
    });

    describe("execute", () => {
      it("should execute the toolbar action", () => {
        const { wrapper } = doMount({
          props: { baseExtensions: { all: true } },
        });

        findToolComponentById(wrapper, "bold")?.vm.$emit("click", {
          stopPropagation: vi.fn(),
        });

        // bold is called
        expect(mockEditor.value.chain().focus().toggleBold).toHaveBeenCalled();

        // another tool is not
        expect(
          mockEditor.value.chain().focus().toggleBulletList,
        ).not.toHaveBeenCalled();
      });

      it.each([
        ["bulletList", "toggleBulletList"] as const,
        ["orderedList", "toggleOrderedList"] as const,
      ])(
        "should call textAlign left when toggling %s",
        (extensionName, commandName) => {
          const { wrapper } = doMount({
            props: {
              baseExtensions: { [extensionName]: true, textAlign: true },
            },
          });

          findToolComponentById(wrapper, extensionName)?.vm.$emit("click", {
            stopPropagation: vi.fn(),
          });

          expect(
            mockEditor.value.chain().focus().setTextAlign,
          ).toHaveBeenCalled();
          expect(
            mockEditor.value.chain().focus()[commandName],
          ).toHaveBeenCalled();
        },
      );

      it.each([
        ["bulletList", "toggleBulletList"] as const,
        ["orderedList", "toggleOrderedList"] as const,
      ])(
        "should not call textAlign left when toggling %s",
        (extensionName, commandName) => {
          const { wrapper } = doMount({
            props: {
              baseExtensions: { [extensionName]: true },
            },
          });

          findToolComponentById(wrapper, extensionName)?.vm.$emit("click", {
            stopPropagation: vi.fn(),
          });

          expect(
            mockEditor.value.chain().focus().setTextAlign,
          ).not.toHaveBeenCalled();
          expect(
            mockEditor.value.chain().focus()[commandName],
          ).toHaveBeenCalled();
        },
      );
    });
  });

  describe("customToolbar slot", () => {
    const componentInSlot = `<div
        id="slotted-component"
        v-bind="scope"
      ></div>`;

    const getScopedComponent = {
      name: "SlottedChild",
      template: componentInSlot,
      props: {
        scope: {
          type: Object,
          required: true,
        },
      },
    };
    const getSlottedChildComponent = (wrapper: VueWrapper<any>) =>
      wrapper.findComponent({ name: "SlottedChild" });

    const getSlottedStubProp = ({
      wrapper,
      propName,
    }: {
      wrapper: VueWrapper<any>;
      propName: string;
    }) => {
      // access the `scope` prop of the dummy slotted component and get value that was injected
      // via the slot props
      return getSlottedChildComponent(wrapper).props("scope")[propName];
    };

    it("should render custom toolbar", () => {
      const customToolbar = (props: any) =>
        h(getScopedComponent, { scope: props });

      const { wrapper } = doMount({
        // @ts-ignore
        slots: { customToolbar },
        props: { baseExtensions: { all: true } },
      });

      expect(getSlottedStubProp({ wrapper, propName: "editor" })).toEqual(
        mockEditor.value,
      );

      expect(getSlottedStubProp({ wrapper, propName: "tools" })).toEqual(
        expect.any(Array),
      );
    });
  });
});
