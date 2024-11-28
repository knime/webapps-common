import { describe, expect, it, vi } from "vitest";

import { AlertingService } from "..";
import { setUpCustomEmbedderService } from "../../embedder";
import { AlertType, USER_ERROR_CODE } from "../../types/alert";

describe("AlertingService", () => {
  const constructAlertingService = () => {
    const apiLayer = {
      sendAlert: vi.fn(),
    };
    const embedder = setUpCustomEmbedderService(apiLayer);

    const alertingService = new AlertingService(embedder.service);
    return {
      alertingService,
      ...apiLayer,
    };
  };

  it("sends error alerts", () => {
    const { alertingService, sendAlert } = constructAlertingService();
    alertingService.sendAlert({
      message: "Hello",
      details: "World",
      type: AlertType.ERROR,
    });
    expect(sendAlert).toHaveBeenCalledWith({
      type: AlertType.ERROR,
      code: USER_ERROR_CODE,
      message: "Hello",
      data: {
        details: "World",
      },
    });
  });

  it("sends warning alerts", () => {
    const { alertingService, sendAlert } = constructAlertingService();
    alertingService.sendAlert({
      type: AlertType.WARN,
      message: "Hello",
      details: "World",
    });
    expect(sendAlert).toHaveBeenCalledWith({
      type: AlertType.WARN,
      warnings: [
        {
          message: "Hello",
          details: "World",
        },
      ],
    });
  });
});
