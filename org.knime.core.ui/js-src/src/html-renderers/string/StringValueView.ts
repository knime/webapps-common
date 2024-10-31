import { editor } from "monaco-editor";
import "../styles.css";
import { JsonDataService } from "@knime/ui-extension-service";

/**
 * exported for testing purposes
 */
export interface StringValueViewInitialData {
  value: string;
  format: "string" | "html";
}

export class StringValueView {
  valueViewElement: HTMLElement;
  editor!: editor.IStandaloneCodeEditor;

  constructor(valueViewElement: HTMLElement) {
    this.valueViewElement = valueViewElement;
  }

  async init() {
    const jsonDataService = await JsonDataService.getInstance();

    const { value, format } =
      (await jsonDataService.initialData()) as StringValueViewInitialData;

    if (format === "string") {
      await document.fonts.load("400 1em Roboto");
      this.editor = editor.create(this.valueViewElement, {
        value,
        readOnly: true,
        scrollBeyondLastLine: false,
        lineNumbers: "off",
        showFoldingControls: "never",
        links: false,
        wordWrap: "on",
        wrappingStrategy: "advanced",
        automaticLayout: true,
        minimap: { enabled: false },
        fontFamily: "Roboto",
        fontWeight: "400",
      });
    } else {
      this.valueViewElement.innerHTML = value;
    }
  }
}
