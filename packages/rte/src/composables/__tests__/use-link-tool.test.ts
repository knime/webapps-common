import { describe, expect, it, vi } from "vitest";
import { useLinkTool } from "../use-link-tool";
import { defaultLinkToolOptions } from "../../utils/custom-link";

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
    sanitizeUrlText = defaultLinkToolOptions.sanitizeUrlText,
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
        sanitizeUrlText,
      });

    return {
      runComposable,
      editorMock,
    };
  };

  describe("link tool click handler", () => {
    it("no selection, cursor position is not at link", () => {
      const { runComposable, editorMock } = setupMocks({
        selection: { from: 1, to: 1 },
        textBetween: "",
      });
      editorMock.getAttributes.mockReturnValue({ href: null });
      const {
        onLinkToolClick,
        isReplacingText,
        showCreateLinkModal,
        text,
        url,
      } = runComposable();

      onLinkToolClick();

      expect(isReplacingText.value).toBe(false);
      expect(showCreateLinkModal.value).toBe(true);
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
        isReplacingText,
        showCreateLinkModal,
        text,
        url,
      } = runComposable();

      onLinkToolClick();

      expect(isReplacingText.value).toBe(true);
      expect(showCreateLinkModal.value).toBe(true);
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
        isReplacingText,
        showCreateLinkModal,
        text,
        url,
      } = runComposable();

      onLinkToolClick();

      expect(isReplacingText.value).toBe(true);
      expect(showCreateLinkModal.value).toBe(true);
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
        isReplacingText,
        showCreateLinkModal,
        text,
        url,
      } = runComposable();

      onLinkToolClick();

      expect(isReplacingText.value).toBe(true);
      expect(editorMock.setTextSelection).toHaveBeenCalledWith(2);
      expect(editorMock.run).toHaveBeenCalled();
      expect(showCreateLinkModal.value).toBe(true);
      expect(text.value).toBe("abcdef");
      expect(url.value).toBe("https://knime.com");
    });
  });

  describe("add link", () => {
    it("when editing existing text", () => {
      const { runComposable, editorMock } = setupMocks();
      const { addLink, isReplacingText, showCreateLinkModal } = runComposable();
      isReplacingText.value = true;

      addLink("Link text", "https://knime.com");

      // unsets previous link if it exists
      expect(editorMock.unsetLink).toHaveBeenCalled();
      expect(editorMock.run).toHaveBeenCalled();

      // sets new link
      expect(editorMock.setLink).toHaveBeenCalledWith({
        href: "https://knime.com",
      });
      expect(editorMock.run).toHaveBeenCalled();

      // resets state
      expect(showCreateLinkModal.value).toBe(false);
      expect(isReplacingText.value).toBe(false);
    });

    it("inserting link with new text", () => {
      const { runComposable, editorMock } = setupMocks({
        selection: { from: 1, to: 10 },
      });
      const { addLink, isReplacingText, showCreateLinkModal } = runComposable();
      isReplacingText.value = false;

      addLink("Link text", "https://knime.com");

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
      expect(showCreateLinkModal.value).toBe(false);
      expect(isReplacingText.value).toBe(false);
    });

    it("adds https to url if omitted when default sanitizer is used", () => {
      const { runComposable, editorMock } = setupMocks({
        selection: { from: 1, to: 10 },
      });
      const { addLink, isReplacingText } = runComposable();
      isReplacingText.value = false;

      addLink("Link text", "knime.com");

      // sets new link
      expect(editorMock.setLink).toHaveBeenCalledWith({
        href: "https://knime.com",
      });
    });

    it("sanitizes url according to custom sanitizer", () => {
      const { runComposable, editorMock } = setupMocks({
        selection: { from: 1, to: 10 },
        sanitizeUrlText: (urlText: string) => {
          return `abc-${urlText}-def`;
        },
      });
      const { addLink, isReplacingText } = runComposable();
      isReplacingText.value = false;

      addLink("Link text", "knime.com");

      // sets new link
      expect(editorMock.setLink).toHaveBeenCalledWith({
        href: "abc-knime.com-def",
      });
    });
  });

  it("remove link", () => {
    const { runComposable, editorMock } = setupMocks();
    const { removeLink, isReplacingText, showCreateLinkModal } =
      runComposable();
    removeLink();
    expect(editorMock.unsetLink).toHaveBeenCalled();
    expect(editorMock.run).toHaveBeenCalled();

    // resets state
    expect(showCreateLinkModal.value).toBe(false);
    expect(isReplacingText.value).toBe(false);
  });

  it("cancel adding link", () => {
    const { runComposable, editorMock } = setupMocks();
    const { cancelAddLink, isReplacingText, showCreateLinkModal } =
      runComposable();
    cancelAddLink();

    expect(editorMock.setLink).not.toHaveBeenCalled();
    expect(editorMock.unsetLink).not.toHaveBeenCalled();

    // resets state
    expect(showCreateLinkModal.value).toBe(false);
    expect(isReplacingText.value).toBe(false);
  });
});
