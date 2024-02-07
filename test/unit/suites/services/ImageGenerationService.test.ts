import { UIExtensionServiceConfig } from "src";
import { setUpCustomEmbedderService } from "src/embedder";
import { ImageGenerationService } from "src/services/ImageGenerationService";

import { extensionConfig } from "test/mocks";

describe("ImageGenerationService", () => {
  const constructReportingService = (
    extensionConfig: UIExtensionServiceConfig,
  ) => {
    const apiLayer = {
      imageGenerated: jest.fn(),
      getConfig: () => extensionConfig,
    };
    const baseService = setUpCustomEmbedderService(apiLayer);
    const imageGenerationService = new ImageGenerationService(
      baseService.service,
    );
    return { imageGenerationService, ...apiLayer };
  };

  it("returns the generatedImageActionId", () => {
    const generatedImageActionId = "123";
    const { imageGenerationService } = constructReportingService({
      ...extensionConfig,
      generatedImageActionId,
    });
    expect(imageGenerationService.getGeneratedImageActionId()).toBe(
      generatedImageActionId,
    );
  });

  it("calls pushEventCallback when calling imageGenerated", () => {
    const { imageGenerationService, imageGenerated } =
      constructReportingService(extensionConfig);

    const reportingContent = "<div>reporting content</div>";
    imageGenerationService.imageGenerated(reportingContent);
    expect(imageGenerated).toHaveBeenCalledWith(reportingContent);
  });
});
