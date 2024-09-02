import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { useLinkTool } from "../useLinkTool";
import { defaultLinkToolOptions } from "../../utils/custom-link";
import { defineComponent, h, ref, type Ref } from "vue";
import { mount } from "@vue/test-utils";

// simplified editor mock that allows chaining methods
const createEditorMock = () => {
  const editorMock: { [key: string]: any } = {};
  for (const method of [
    "getAttributes",
    "setTextSelection",
    "run",
    "unsetLink",
    "extendMarkRange",
    "command",
    "setLink",
    "focus",
    "chain",
    "insertContent",
    "insertContentAt",
  ]) {
    editorMock[method] = vi.fn(() => editorMock);
  }
  return editorMock;
};

describe("useLinkTool", () => {
  const setupMocks = ({
    selection = { from: 1, to: 2 },
    textBetween = "",
    currentLink = "",
    linkToolOptions = defaultLinkToolOptions,
    isRegistered = true,
  } = {}) => {
    const editorMock = createEditorMock();
    editorMock.view = { state: { selection } };
    editorMock.state = {
      doc: { textBetween: vi.fn().mockReturnValue(textBetween) },
    };
    editorMock.getAttributes.mockReturnValue({ href: currentLink });
    editorMock.commands = { setTextSelection: editorMock.setTextSelection };

    const runComposable = () =>
      useLinkTool({
        editor: editorMock as any,
        isRegistered,
        linkToolOptions,
      });

    return {
      runComposable,
      editorMock,
    };
  };

  beforeAll(() => {
    // supress warnings that occur when running composable with mounted hooks in tests
    global.console.warn = vi.fn();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("returns null if link tool is not registered", () => {
    const { runComposable } = setupMocks({ isRegistered: false });
    expect(runComposable()).toBeNull();
  });

  const getDummyComponent = (
    runComposable: () => any,
    composableResult: Ref<any>,
  ) =>
    defineComponent({
      setup: () => {
        composableResult.value = runComposable();
      },
      render: () => h("div"),
    });

  it("sets keyboard shortcut event listener", () => {
    const { runComposable } = setupMocks();
    const addEventListenerSpy = vi.spyOn(window, "addEventListener");
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    const wrapper = mount(getDummyComponent(runComposable, ref({})));

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function),
    );
    wrapper.unmount();
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function),
    );
  });

  describe("link tool click handler", () => {
    it("no selection, cursor position is not at link", () => {
      const { runComposable, editorMock } = setupMocks({
        selection: { from: 1, to: 1 },
        textBetween: "",
      });
      editorMock.getAttributes.mockReturnValue({ href: null });
      const {
        onLinkToolClick,
        props: { isActive, text, url },
      } = runComposable()!;

      onLinkToolClick();

      expect(isActive.value).toBe(true);
      expect(text.value).toBe("");
      expect(url.value).toBe("");
    });

    it("no selection, cursor position is at link", () => {
      const { runComposable } = setupMocks({
        selection: {
          from: 1,
          to: 1,
          $from: { nodeBefore: { textContent: "abc" } },
          $to: { nodeAfter: { textContent: "def" } },
        } as any,
        textBetween: "",
        currentLink: "https://knime.com",
      });
      const {
        onLinkToolClick,
        props: { isActive, text, url },
      } = runComposable()!;

      onLinkToolClick();

      expect(isActive.value).toBe(true);
      expect(text.value).toBe("abcdef");
      expect(url.value).toBe("https://knime.com");
    });

    it("selection, cursor position is not at link", () => {
      const { runComposable, editorMock } = setupMocks({
        selection: { from: 1, to: 4 },
        textBetween: "abc",
      });
      editorMock.getAttributes.mockReturnValue({ href: null });
      const {
        onLinkToolClick,
        props: { isActive, text, url },
      } = runComposable()!;

      onLinkToolClick();

      expect(isActive.value).toBe(true);
      expect(text.value).toBe("abc");
      expect(url.value).toBe("");
    });

    it("selection, cursor position is at link", () => {
      const { runComposable, editorMock } = setupMocks({
        selection: {
          from: 1,
          to: 4,
          $from: { nodeBefore: { textContent: "abc" } },
          $to: { nodeAfter: { textContent: "def" } },
        } as any,
        textBetween: "abc",
      });
      editorMock.getAttributes.mockReturnValue({ href: "https://knime.com" });
      const {
        onLinkToolClick,
        props: { isActive, text, url },
      } = runComposable()!;

      onLinkToolClick();

      expect(editorMock.setTextSelection).toHaveBeenCalledWith(2);
      expect(editorMock.run).toHaveBeenCalled();
      expect(isActive.value).toBe(true);
      expect(text.value).toBe("abcdef");
      expect(url.value).toBe("https://knime.com");
    });
  });

  describe("add link", () => {
    it("when editing existing text", () => {
      const { runComposable, editorMock } = setupMocks();
      const {
        props: { isActive },
        events: { addLink: onAddLink },
      } = runComposable()!;

      onAddLink("Link text", "https://knime.com");

      // unsets previous link if it exists
      expect(editorMock.unsetLink).toHaveBeenCalled();
      expect(editorMock.run).toHaveBeenCalled();

      // sets new link
      expect(editorMock.setLink).toHaveBeenCalledWith({
        href: "https://knime.com",
      });
      expect(editorMock.run).toHaveBeenCalled();

      // resets state
      expect(isActive.value).toBe(false);
    });

    it("inserting link with new text", () => {
      const { runComposable, editorMock } = setupMocks({
        selection: { from: 1, to: 10 },
      });
      const {
        props: { isActive },
        events: { addLink: onAddLink },
      } = runComposable()!;

      onAddLink("Link text", "https://knime.com");

      // unsets previous link if it exists
      expect(editorMock.unsetLink).toHaveBeenCalled();
      expect(editorMock.run).toHaveBeenCalled();

      // sets new link
      expect(editorMock.insertContentAt).toHaveBeenCalledWith(1, [
        { type: "text", text: "Link text" },
      ]);
      expect(editorMock.setTextSelection).toHaveBeenCalled();
      expect(editorMock.setLink).toHaveBeenCalledWith({
        href: "https://knime.com",
      });

      // resets state
      expect(isActive.value).toBe(false);
    });

    it("adds https to url if omitted when default sanitizer is used", () => {
      const { runComposable, editorMock } = setupMocks({
        selection: { from: 1, to: 10 },
      });
      const {
        events: { addLink: onAddLink },
      } = runComposable()!;

      onAddLink("Link text", "knime.com");

      // sets new link
      expect(editorMock.setLink).toHaveBeenCalledWith({
        href: "https://knime.com",
      });
    });

    it("sanitizes url according to custom sanitizer", () => {
      const { runComposable, editorMock } = setupMocks({
        selection: { from: 1, to: 10 },
        linkToolOptions: {
          urlValidator: defaultLinkToolOptions.urlValidator,
          sanitizeUrlText: (urlText: string) => {
            return `abc-${urlText}-def`;
          },
        },
      });
      const {
        events: { addLink: onAddLink },
      } = runComposable()!;

      onAddLink("Link text", "knime.com");

      // sets new link
      expect(editorMock.setLink).toHaveBeenCalledWith({
        href: "abc-knime.com-def",
      });
    });
  });

  it("remove link", () => {
    const { runComposable, editorMock } = setupMocks();
    const {
      events: { removeLink: onRemoveLink },
      props: { isActive },
    } = runComposable()!;
    onRemoveLink();
    expect(editorMock.unsetLink).toHaveBeenCalled();
    expect(editorMock.run).toHaveBeenCalled();

    // resets state
    expect(isActive.value).toBe(false);
  });

  it("cancel adding link", () => {
    const { runComposable, editorMock } = setupMocks();
    const {
      events: { cancelAddLink: onCancelAddLink },
      props: { isActive },
    } = runComposable()!;
    onCancelAddLink();

    expect(editorMock.setLink).not.toHaveBeenCalled();
    expect(editorMock.unsetLink).not.toHaveBeenCalled();

    // resets state
    expect(isActive.value).toBe(false);
  });
});
