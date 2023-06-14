import { describe, expect, it, vi, type Mock, afterEach } from "vitest";
import { mount, VueWrapper } from "@vue/test-utils";
import { h, shallowRef, type Slot } from "vue";

import { useEditor } from "@tiptap/vue-3";

import FunctionButton from "../../FunctionButton.vue";

import RichTextEditor from "../RichTextEditor.vue";

// mock for editor's isActive function. declared separately due to mock hoisting via vi.mock
const isActive = vi.fn();

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
    isActive,
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
    doMount();

    expect(useEditor).toHaveBeenCalledWith(
      expect.objectContaining({
        content: defaultProps.modelValue,
        extensions: expect.any(Array),
        editable: true,
        onUpdate: expect.any(Function),
      })
    );

    expect(mockEditor.value.params.extensions.length).toBe(3);
  });

  it("should emit an 'update:modelValue' event", () => {
    const { wrapper } = doMount();

    // trigger update function
    mockEditor.value.params.onUpdate();

    expect(wrapper.emitted("update:modelValue")).toBeDefined();
  });

  describe("disabled tools", () => {
    it.each([
      ["bold"],
      ["italic"],
      ["bulletList"],
      ["orderedList"],
      ["heading"],
    ])(
      "should disable the tools specified via props (StarterKit)",
      (toolName) => {
        doMount({
          props: { disabledTools: { [toolName]: true } },
        });

        const [starterKitExtension] = mockEditor.value.params.extensions;
        expect(starterKitExtension.options[toolName]).toBe(false);
      }
    );

    it("should disable the underline tool", () => {
      doMount({
        props: { disabledTools: { underline: true } },
      });

      const underlineExtension = mockEditor.value.params.extensions.find(
        (extension: any) => extension.name === "underline"
      );
      expect(underlineExtension).toBeUndefined();
    });

    it("should disable the textAlign tool", () => {
      doMount({
        props: { disabledTools: { textAlign: true } },
      });

      const textAlignExtension = mockEditor.value.params.extensions.find(
        (extension: any) => extension.name === "textAlign"
      );
      expect(textAlignExtension).toBeUndefined();
    });
  });

  it("should set editable state", async () => {
    const { wrapper } = doMount();

    expect(useEditor).toHaveBeenCalledWith(
      expect.objectContaining({
        editable: true,
      })
    );

    await wrapper.setProps({ editable: false });

    expect(mockEditor.value.setEditable).toHaveBeenCalled();
  });

  it("should focus editor on mount", async () => {
    doMount();

    await new Promise((r) => setTimeout(r, 0));

    expect(mockEditor.value.commands.focus).toHaveBeenCalled();
  });

  describe("tool interactions", () => {
    it("should render all tools", () => {
      const { wrapper } = doMount();

      expect(wrapper.findAll(".tool").length).toBe(8);
    });

    it("should set the active state correctly", () => {
      isActive.mockImplementation((name) => name === "bold");
      const { wrapper } = doMount();

      expect(
        wrapper.findAllComponents(FunctionButton).at(0)?.props("active")
      ).toBe(true);
      expect(
        wrapper.findAllComponents(FunctionButton).at(1)?.props("active")
      ).toBe(false);
    });

    it("should execute the toolbar action", () => {
      const { wrapper } = doMount();

      const boldToolIndex = 0;

      wrapper
        .findAllComponents(FunctionButton)
        .at(boldToolIndex)
        ?.vm.$emit("click", { stopPropagation: vi.fn() });

      // bold is called
      expect(mockEditor.value.chain().focus().toggleBold).toHaveBeenCalled();

      // another tool is not
      expect(
        mockEditor.value.chain().focus().toggleBulletList
      ).not.toHaveBeenCalled();
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

      // @ts-ignore
      const { wrapper } = doMount({ slots: { customToolbar } });

      expect(getSlottedStubProp({ wrapper, propName: "editor" })).toEqual(
        mockEditor.value
      );

      expect(getSlottedStubProp({ wrapper, propName: "tools" })).toEqual(
        expect.any(Array)
      );
    });
  });
});
