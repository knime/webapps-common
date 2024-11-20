import { editor } from "monaco-editor";
import EditorWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import JSONWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";

import "../styles.css";
import { JsonDataService } from "@knime/ui-extension-service";

self.MonacoEnvironment = {
  getWorker: (_workerId: string, label: string) =>
    label === "json" ? new JSONWorker() : new EditorWorker(),
};

/**
 * exported for testing purposes
 */
export interface CodeValueViewInitialData {
  code: string;
  language: "json" | "xml";
}

export class CodeValueView {
  editorElement: HTMLElement;
  editor!: editor.IStandaloneCodeEditor;
  jsonDataService!: JsonDataService;

  constructor(editorElement: HTMLElement) {
    this.editorElement = editorElement;
  }

  async init() {
    await document.fonts.load("400 1em Roboto Mono");
    this.jsonDataService = await JsonDataService.getInstance();
    const { code, language } =
      (await this.jsonDataService.initialData()) as CodeValueViewInitialData;

    this.editor = editor.create(this.editorElement, {
      value: code,
      language,
      readOnly: true,
      scrollBeyondLastLine: false,
      lineNumbersMinChars: 1,
      automaticLayout: true,
      minimap: { enabled: false },
      fontFamily: "Roboto Mono",
      fontWeight: "400",
    });
  }
}
