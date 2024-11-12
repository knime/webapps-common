import "../styles.css";
import { JsonDataService } from "@knime/ui-extension-service";

/**
 * exported for testing purposes
 */
export interface StringCellViewInitialData {
  value: string;
  renderAsHTML: boolean;
}

const getInitialData = async () => {
  const jsonDataService = await JsonDataService.getInstance();
  return (await jsonDataService.initialData()) as StringCellViewInitialData;
};

const waitForFontToBeLoaded = () => document.fonts.load("400 1em Roboto");

export const addInnerHtml = async (element: HTMLElement) => {
  await waitForFontToBeLoaded();
  const { value, renderAsHTML } = await getInitialData();
  element[renderAsHTML ? "innerHTML" : "textContent"] = value;
};
