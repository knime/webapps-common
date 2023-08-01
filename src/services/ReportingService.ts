import { KnimeService } from "./KnimeService";

/**
 * ReportingService is used in views in order to detect that the view is generated in a reporting context
 * and to communicate that the view is rendered.
 */
export class ReportingService {
  private knimeService: KnimeService;

  /**
   * @param {KnimeService} knimeService
   */
  constructor(knimeService: KnimeService) {
    this.knimeService = knimeService;
  }

  isReportingActive() {
    return Boolean(this.knimeService.extensionConfig?.generatedImageActionId);
  }

  /**
   * Informs that the view is rendered and sets the respective reporting content.
   * @param {false | string} reportingContent - the reporting content (html as string) to be set or false if the reporting content is to be read from the dom.
   * @return {void}
   */
  setReportingContent(reportingContent: false | string): void {
    this.knimeService.pushEvent({
      type: "reportingContent",
      reportingContent,
    });
  }

  /**
   * Sets the view as rendered. The reporting content will be read from the dom.
   * @return {void}
   */
  setRenderCompleted(): void {
    this.setReportingContent(false);
  }
}
