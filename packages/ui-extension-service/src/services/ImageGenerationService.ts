import { AbstractService } from "./AbstractService";
import type { ImageGenerationServiceAPILayer } from "./types/serviceApiLayers";

/**
 * ImageGenerationService is used in views in order to detect that the view is generated in an image generation context
 * and to communicate the generated image.
 * TODO: This should only be API once UIEXT-782 is tackled.
 */
export class ImageGenerationService extends AbstractService<ImageGenerationServiceAPILayer> {
  isImageGenerationActive() {
    return this.baseService.getConfig().renderingConfig?.type === "IMAGE";
  }

  /**
   * @throws {Error} if image generation is not active.
   */
  getImageFormat() {
    const renderingConfig = this.baseService.getConfig().renderingConfig;
    if (renderingConfig?.type !== "IMAGE") {
      throw new Error(
        "Image generation is not active. Check this via isImageGenerationActive first.",
      );
    }
    return renderingConfig.imageFormat;
  }

  /**
   * Called when an image has been generated.
   * @param {string} image - the generated image as string
   * @return {void}
   */
  imageGenerated(image: string): void {
    this.baseService.imageGenerated(image);
  }
}
