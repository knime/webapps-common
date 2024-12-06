import { describe, expect, it, vi } from "vitest";

import { type ReportRenderingConfig } from "@knime/ui-extension-renderer/api";
import { setUpCustomEmbedderService } from "@knime/ui-extension-renderer/testing";

import { ReportingService } from "../ReportingService";
import type { ReportingServiceExtensionConfig } from "../types/serviceApiLayers";

import { extensionConfig } from "./mocks";

describe("ReportingService", () => {
  const constructReportingService = (
    extensionConfig: ReportingServiceExtensionConfig,
  ) => {
    const apiLayer = {
      setReportingContent: vi.fn(),
      getConfig: () => extensionConfig,
    };
    const baseService = setUpCustomEmbedderService(apiLayer);
    const reportingService = new ReportingService(baseService.service);
    return { reportingService, ...apiLayer };
  };

  it("sets isReportingActive to false if the type of the renderingConfig is not REPORT", () => {
    const localExtensionConfig: ReportingServiceExtensionConfig = {
      ...extensionConfig,
      renderingConfig: {
        type: "DEFAULT",
      },
    };
    const { reportingService } =
      constructReportingService(localExtensionConfig);
    expect(reportingService.isReportingActive()).toBe(false);
  });

  it("sets isReportingActive to false if the type of the renderingConfig is REPORT but it cannot be used in report", () => {
    const localExtensionConfig: ReportingServiceExtensionConfig = {
      ...extensionConfig,
      renderingConfig: {
        type: "REPORT",
        canBeUsedInReport: false,
        imageFormat: "PNG",
      },
    };
    const { reportingService } =
      constructReportingService(localExtensionConfig);
    expect(reportingService.isReportingActive()).toBe(false);
  });

  it("sets isReportingActive to true if the type of the renderingConfig is REPORT and it can be used in report", () => {
    const localExtensionConfig: ReportingServiceExtensionConfig = {
      ...extensionConfig,
      renderingConfig: {
        type: "REPORT",
        canBeUsedInReport: true,
        imageFormat: "PNG",
      },
    };
    const { reportingService } =
      constructReportingService(localExtensionConfig);

    expect(reportingService.isReportingActive()).toBe(true);
  });

  it("returns the image file format", () => {
    const imageFormat = "PNG";
    const localRenderingConfig: ReportRenderingConfig = {
      type: "REPORT",
      imageFormat,
      canBeUsedInReport: true,
    };
    const { reportingService } = constructReportingService({
      ...extensionConfig,
      renderingConfig: localRenderingConfig,
    });
    expect(reportingService.getImageFormat()).toBe(imageFormat);
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
