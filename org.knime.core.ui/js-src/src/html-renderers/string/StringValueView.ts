import { editor } from "monaco-editor";
import "../styles.css";
import { JsonDataService } from "@knime/ui-extension-service";

/**
 * exported for testing purposes
 */
export interface StringValueViewInitialData {
  value: string;
}

const getStringValue = async () => {
  const jsonDataService = await JsonDataService.getInstance();
  const { value } =
    (await jsonDataService.initialData()) as StringValueViewInitialData;
  return value;
};

export const createEditor = async (editorElement: HTMLElement) => {
  await document.fonts.load("400 1em Roboto");
  const value = await getStringValue();
  editor.create(editorElement, {
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
};
