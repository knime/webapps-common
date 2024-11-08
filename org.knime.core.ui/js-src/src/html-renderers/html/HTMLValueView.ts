import "../styles.css";
import { JsonDataService } from "@knime/ui-extension-service";

/**
 * exported for testing purposes
 */
export interface HTMLValueViewInitialData {
  value: string;
}

const getHtmlValue = async () => {
  const jsonDataService = await JsonDataService.getInstance();
  const { value } =
    (await jsonDataService.initialData()) as HTMLValueViewInitialData;
  return value;
};

export const addInnerHtml = async (element: HTMLElement) => {
  const htmlValue = await getHtmlValue();
  element.innerHTML = htmlValue;
};
