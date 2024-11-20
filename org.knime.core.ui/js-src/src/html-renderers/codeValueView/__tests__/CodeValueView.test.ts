import {
  type MockInstance,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";
import { editor } from "monaco-editor";

import { JsonDataService } from "@knime/ui-extension-service";

import { CodeValueView, type CodeValueViewInitialData } from "../CodeValueView";

const editorCreateMock = editor.create as any as MockInstance<
  typeof editor.create
>;

vi.mock("monaco-editor", () => ({
  editor: {
    create: vi.fn(),
  },
}));

describe("CodeValueView", () => {
  let container: HTMLElement, codeValueView: CodeValueView;

  beforeAll(() => {
    Object.defineProperty(document, "fonts", {
      value: { load: vi.fn() },
    });
  });

  beforeEach(() => {
    container = document.createElement("div");
    container.id = "container";
    const editor = document.createElement("div");
    editor.id = "editor";
    container.appendChild(editor);
    codeValueView = new CodeValueView(container);
  });

  const init = (initialData: CodeValueViewInitialData) => {
    JsonDataService.getInstance = vi.fn().mockResolvedValue({
      initialData: vi.fn().mockResolvedValue(initialData),
    });
    return codeValueView.init();
  };

  it("creates the editor with given properties", async () => {
    const code = "code snippet";
    const language = "json";
    await init({ code, language });
    expect(editorCreateMock).toHaveBeenCalledWith(container, {
      automaticLayout: true,
      language,
      lineNumbersMinChars: 1,
      minimap: {
        enabled: false,
      },
      readOnly: true,
      scrollBeyondLastLine: false,
      value: code,
      fontFamily: "Roboto Mono",
      fontWeight: "400",
    });
  });
});
