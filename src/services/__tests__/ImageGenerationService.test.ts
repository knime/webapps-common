import { describe, expect, it, vi } from "vitest";
import { UIExtensionServiceConfig } from "@/index";
import { setUpCustomEmbedderService } from "@/embedder";
import { ImageGenerationService } from "../ImageGenerationService";

import { extensionConfig } from "./mocks";
import {
  ImageFileFormat,
  ImageGenerationRenderingConfig,
  RenderingType,
} from "@/types/RenderingConfig";

describe("ImageGenerationService", () => {
  const constructImageGenerationService = (
    extensionConfig: UIExtensionServiceConfig,
  ) => {
    const apiLayer = {
      imageGenerated: vi.fn(),
      getConfig: () => extensionConfig,
    };
    const baseService = setUpCustomEmbedderService(apiLayer);
    const imageGenerationService = new ImageGenerationService(
      baseService.service,
    );
    return { imageGenerationService, ...apiLayer };
  };

  it("returns the actionId", () => {
    const actionId = "123";
    const localRenderingConfig: ImageGenerationRenderingConfig = {
      actionId,
      type: RenderingType.IMAGE,
      imageFileFormat: ImageFileFormat.PNG,
    };
    const { imageGenerationService } = constructImageGenerationService({
      ...extensionConfig,
      renderingConfig: localRenderingConfig,
    });
    expect(imageGenerationService.getActionId()).toBe(actionId);
  });

  it("returns the image file format", () => {
    const imageFileFormat = ImageFileFormat.PNG;
    const localRenderingConfig: ImageGenerationRenderingConfig = {
      actionId: "actionId",
      type: RenderingType.IMAGE,
      imageFileFormat,
    };
    const { imageGenerationService } = constructImageGenerationService({
      ...extensionConfig,
      renderingConfig: localRenderingConfig,
    });
    expect(imageGenerationService.getImageFileFormat()).toBe(imageFileFormat);
  });

  it("calls pushEventCallback when calling imageGenerated", () => {
    const { imageGenerationService, imageGenerated } =
      constructImageGenerationService(extensionConfig);

    const reportingContent = "<div>reporting content</div>";
    imageGenerationService.imageGenerated(reportingContent);
    expect(imageGenerated).toHaveBeenCalledWith(reportingContent);
  });

  it("sets isImageGenerationActive to false if the type in the renderingConfig is not IMAGE", () => {
    const localExtensionConfig = {
      ...extensionConfig,
      renderingConfig: { actionId: null, type: RenderingType.DEFAULT },
    };
    const { imageGenerationService } =
      constructImageGenerationService(localExtensionConfig);
    expect(imageGenerationService.isImageGenerationActive()).toBe(false);
  });

  it("sets isImageGenerationActive to true if the type in the renderingConfig is IMAGE", () => {
    const localExtensionConfig = {
      ...extensionConfig,
      renderingConfig: { actionId: null, type: RenderingType.IMAGE },
    };
    const { imageGenerationService } =
      constructImageGenerationService(localExtensionConfig);

    expect(imageGenerationService.isImageGenerationActive()).toBe(true);
  });
});
