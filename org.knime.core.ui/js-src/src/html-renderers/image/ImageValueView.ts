/* eslint-disable @typescript-eslint/no-unused-vars */
import { JsonDataService } from "@knime/ui-extension-service";
import "../styles.css";
import "@knime/styles/css/fonts.css";

/**
 * exported for testing purposes
 */
export interface ImageInitialData {
  data: string;
  mimeType: string;
}
const getImageSrc = async () => {
  const jsonDataService = await JsonDataService.getInstance();
  const { data, mimeType } =
    (await jsonDataService.initialData()) as ImageInitialData;
  return `data:${mimeType};base64, ${data}`;
};

const waitForFontsToBeLoaded = () =>
  Promise.all([
    document.fonts.load("400 1em Roboto"),
    document.fonts.load("700 1em Roboto"),
  ]);

export const addImageSrc = async (imageElement: HTMLImageElement) => {
  await waitForFontsToBeLoaded();
  const src = await getImageSrc();
  imageElement.src = src;
};
