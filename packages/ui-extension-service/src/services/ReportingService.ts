import { RenderingType, ReportRenderingConfig } from "@/types/RenderingConfig";
import { AbstractService } from "./AbstractService";
import { ReportingServiceAPILayer } from "./types/serviceApiLayers";

/**
 * ReportingService is used in views in order to detect that the view is generated in a reporting context
 * and to communicate that the view is rendered.
 */
export class ReportingService extends AbstractService<ReportingServiceAPILayer> {
  isReportingActive() {
    const { renderingConfig } = this.baseService.getConfig();
    return (
      renderingConfig?.type === RenderingType.REPORT &&
      (renderingConfig as ReportRenderingConfig).canBeUsedInReport
    );
  }

  getImageFormat() {
    return (
      this.baseService.getConfig().renderingConfig as ReportRenderingConfig
    ).imageFormat;
  }

  /**
   * Informs that the view is rendered and sets the respective reporting content.
   * @param {false | string} reportingContent - the reporting content (html as string) to be set or false if the reporting content is to be read from the dom.
   * @return {void}
   */
  setReportingContent(reportingContent: false | string): void {
    this.baseService.setReportingContent(reportingContent);
  }

  /**
   * Sets the view as rendered. The reporting content will be read from the dom.
   * @return {void}
   */
  setRenderCompleted(): void {
    this.setReportingContent(false);
  }
}
