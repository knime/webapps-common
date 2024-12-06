import { describe, expect, it, vi } from "vitest";

import { type ImageGenerationRenderingConfig } from "@knime/ui-extension-renderer/api";
import { setUpCustomEmbedderService } from "@knime/ui-extension-renderer/testing";

import { ImageGenerationService } from "../ImageGenerationService";
import type { ImageGenerationServiceExtensionConfig } from "../types/serviceApiLayers";

import { extensionConfig } from "./mocks";

describe("ImageGenerationService", () => {
  const constructImageGenerationService = (
    extensionConfig: ImageGenerationServiceExtensionConfig,
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

  it("returns the image file format", () => {
    const imageFormat = "PNG";
    const localRenderingConfig: ImageGenerationRenderingConfig = {
      actionId: "actionId",
      type: "IMAGE",
      imageFormat,
    };
    const { imageGenerationService } = constructImageGenerationService({
      ...extensionConfig,
      renderingConfig: localRenderingConfig,
    });
    expect(imageGenerationService.getImageFormat()).toBe(imageFormat);
  });

  it("calls pushEventCallback when calling imageGenerated", () => {
    const { imageGenerationService, imageGenerated } =
      constructImageGenerationService(extensionConfig);

    const reportingContent = "<div>reporting content</div>";
    imageGenerationService.imageGenerated(reportingContent);
    expect(imageGenerated).toHaveBeenCalledWith(reportingContent);
  });

  it("sets isImageGenerationActive to false if the type in the renderingConfig is not IMAGE", () => {
    const localExtensionConfig: ImageGenerationServiceExtensionConfig = {
      ...extensionConfig,
      renderingConfig: { type: "DEFAULT" },
    };
    const { imageGenerationService } =
      constructImageGenerationService(localExtensionConfig);
    expect(imageGenerationService.isImageGenerationActive()).toBe(false);
  });

  it("sets isImageGenerationActive to true if the type in the renderingConfig is IMAGE", () => {
    const localExtensionConfig: ImageGenerationServiceExtensionConfig = {
      ...extensionConfig,
      renderingConfig: {
        actionId: "someActionId",
        type: "IMAGE",
        imageFormat: "PNG",
      },
    };
    const { imageGenerationService } =
      constructImageGenerationService(localExtensionConfig);

    expect(imageGenerationService.isImageGenerationActive()).toBe(true);
  });
});
