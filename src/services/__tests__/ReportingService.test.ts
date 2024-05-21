import { describe, expect, it, vi } from "vitest";
import { UIExtensionServiceConfig } from "@/index";
import { setUpCustomEmbedderService } from "@/embedder";
import { ReportingService } from "../ReportingService";

import { extensionConfig } from "./mocks";

describe("ReportingService", () => {
  const constructReportingService = (
    extensionConfig: UIExtensionServiceConfig,
  ) => {
    const apiLayer = {
      setReportingContent: vi.fn(),
      getConfig: () => extensionConfig,
    };
    const baseService = setUpCustomEmbedderService(apiLayer);
    const reportingService = new ReportingService(baseService.service);
    return { reportingService, ...apiLayer };
  };

  it("sets isReportingActive to false if generateImageActionId is not set", () => {
    const { reportingService } = constructReportingService(extensionConfig);
    expect(reportingService.isReportingActive()).toBe(false);
  });

  it("sets isReportingActive to true if generateImageActionId is set", () => {
    const localExtensionConfig = {
      ...extensionConfig,
      generatedImageActionId: "dummyId",
    };
    const { reportingService } =
      constructReportingService(localExtensionConfig);

    expect(reportingService.isReportingActive()).toBe(true);
  });

  it("calls pushEventCallback when setting reporting content", () => {
    const { reportingService, setReportingContent } =
      constructReportingService(extensionConfig);

    const reportingContent = "<div>reporting content</div>";
    reportingService.setReportingContent(reportingContent);
    expect(setReportingContent).toHaveBeenCalledWith(reportingContent);
  });

  it("calls pushEventCallback when setting render completed", () => {
    const { reportingService, setReportingContent } =
      constructReportingService(extensionConfig);
    reportingService.setRenderCompleted();
    expect(setReportingContent).toHaveBeenCalledWith(false);
  });
});
