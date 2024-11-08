import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  MockInstance,
  vi,
} from "vitest";
import { StringValueViewInitialData, createEditor } from "../StringValueView";
import { JsonDataService } from "@knime/ui-extension-service";

import { editor } from "monaco-editor";

const editorCreateMock = editor.create as any as MockInstance<
  typeof editor.create
>;

vi.mock("monaco-editor", () => ({
  editor: {
    create: vi.fn(),
  },
}));

describe("StringValueView", () => {
  let editorElement: HTMLElement;

  beforeAll(() => {
    Object.defineProperty(document, "fonts", {
      value: { load: vi.fn() },
    });
  });

  beforeEach(() => {
    editorElement = document.createElement("div");
  });

  const init = (initialData: StringValueViewInitialData) => {
    JsonDataService.getInstance = vi.fn().mockResolvedValue({
      initialData: vi.fn().mockResolvedValue(initialData),
    });
    return createEditor(editorElement);
  };

  it("creates the Monaco editor with given properties", async () => {
    const value = "some string";
    await init({ value });
    expect(editorCreateMock).toHaveBeenCalledWith(editorElement, {
      value,
      readOnly: true,
      scrollBeyondLastLine: false,
      lineNumbers: "off",
      showFoldingControls: "never",
      links: false,
      wordWrap: "on",
      automaticLayout: true,
      wrappingStrategy: "advanced",
      minimap: { enabled: false },
      fontFamily: "Roboto",
      fontWeight: "400",
    });
  });
});
