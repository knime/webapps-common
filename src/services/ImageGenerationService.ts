import { AbstractService } from "./AbstractService";
import { ImageGenerationServiceAPILayer } from "./types/serviceApiLayers";

/**
 * ImageGenerationService is used in views in order to detect that the view is generated in an image generation context
 * and to communicate the generated image.
 */
export class ImageGenerationService extends AbstractService<ImageGenerationServiceAPILayer> {
  getGeneratedImageActionId() {
    return this.baseService.getConfig().generatedImageActionId;
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
