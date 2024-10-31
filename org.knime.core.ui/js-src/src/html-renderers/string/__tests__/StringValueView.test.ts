import {
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  MockInstance,
  vi,
} from "vitest";
import {
  StringValueView,
  StringValueViewInitialData,
} from "../StringValueView";
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
  let valueViewElement: HTMLElement, stringValueView: StringValueView;

  beforeAll(() => {
    Object.defineProperty(document, "fonts", {
      value: { load: vi.fn() },
    });
  });

  beforeEach(() => {
    valueViewElement = document.createElement("div");
    valueViewElement.id = "string-value-view";
    stringValueView = new StringValueView(valueViewElement);
  });

  const init = (initialData: StringValueViewInitialData) => {
    JsonDataService.getInstance = vi.fn().mockResolvedValue({
      initialData: vi.fn().mockResolvedValue(initialData),
    });
    return stringValueView.init();
  };

  it("creates the Monaco editor with given properties for regular strings", async () => {
    const value = "some string";
    await init({ value, format: "string" });
    expect(editorCreateMock).toHaveBeenCalledWith(valueViewElement, {
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

  it("sets the inner html to the given value for html-formatted strings", async () => {
    const value = "some string";
    await init({ value, format: "html" });
    expect(valueViewElement.innerHTML).toBe(value);
  });
});
