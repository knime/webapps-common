import { KnimeService } from "src";
import { ReportingService } from "src/services/ReportingService";

import { extensionConfig } from "test/mocks";

describe("ReportingService", () => {
  it("sets isReportingActive to false when extensionConfig is missing", () => {
    const reportingService = new ReportingService(new KnimeService());
    expect(reportingService.isReportingActive()).toBe(false);
  });

  it("sets isReportingActive to false if generateImageActionId is not set", () => {
    const reportingService = new ReportingService(
      new KnimeService(extensionConfig),
    );
    expect(reportingService.isReportingActive()).toBe(false);
  });

  it("sets isReportingActive to true if generateImageActionId is set", () => {
    const localExtensionConfig = {
      ...extensionConfig,
      generatedImageActionId: "dummyId",
    };
    const reportingService = new ReportingService(
      new KnimeService(localExtensionConfig),
    );
    expect(reportingService.isReportingActive()).toBe(true);
  });

  it("calls pushEventCallback when setting reporting content", () => {
    const pushEventCallback = jest.fn();
    const reportingService = new ReportingService(
      new KnimeService(extensionConfig, null, pushEventCallback),
    );
    const reportingContent = "<div>reporting content</div>";
    reportingService.setReportingContent(reportingContent);
    expect(pushEventCallback).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "reportingContent",
        reportingContent,
      }),
    );
  });

  it("calls pushEventCallback when setting render completed", () => {
    const pushEventCallback = jest.fn();
    const reportingService = new ReportingService(
      new KnimeService(extensionConfig, null, pushEventCallback),
    );
    reportingService.setRenderCompleted();
    expect(pushEventCallback).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "reportingContent",
        reportingContent: false,
      }),
    );
  });
});
