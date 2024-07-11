import { AbstractService } from "./AbstractService";
import { ImageGenerationServiceAPILayer } from "./types/serviceApiLayers";
import {
  ImageGenerationRenderingConfig,
  RenderingType,
} from "@/types/RenderingConfig";

/**
 * ImageGenerationService is used in views in order to detect that the view is generated in an image generation context
 * and to communicate the generated image.
 */
export class ImageGenerationService extends AbstractService<ImageGenerationServiceAPILayer> {
  isImageGenerationActive() {
    return (
      this.baseService.getConfig().renderingConfig?.type === RenderingType.IMAGE
    );
  }

  getActionId() {
    return (
      this.baseService.getConfig()
        .renderingConfig as ImageGenerationRenderingConfig
    ).actionId;
  }

  getImageFileFormat() {
    return (
      this.baseService.getConfig()
        .renderingConfig as ImageGenerationRenderingConfig
    ).imageFileFormat;
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
