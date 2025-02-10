import { describe, expect, it, vi } from "vitest";

import { setUpCustomEmbedderService } from "@knime/ui-extension-renderer/testing";

import { AlertingService } from "..";
import {
  USER_ERROR_CODE,
  USER_ERROR_CODE_BLOCKING,
} from "../types/jsonRPCTypes";

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
      type: "error",
    });
    expect(sendAlert).toHaveBeenCalledWith({
      type: "error",
      code: USER_ERROR_CODE,
      message: "Hello",
      data: {
        details: "World",
      },
    });
  });

  it("sends error alerts with a custom error code", () => {
    const { alertingService, sendAlert } = constructAlertingService();
    alertingService.sendAlert({
      message: "Hello",
      details: "World",
      type: "error",
      isBlocking: true,
    });
    expect(sendAlert).toHaveBeenCalledWith({
      type: "error",
      code: USER_ERROR_CODE_BLOCKING,
      message: "Hello",
      data: {
        details: "World",
      },
    });
  });

  it("sends warning alerts", () => {
    const { alertingService, sendAlert } = constructAlertingService();
    alertingService.sendAlert({
      type: "warn",
      message: "Hello",
      details: "World",
    });
    expect(sendAlert).toHaveBeenCalledWith({
      type: "warn",
      warnings: [
        {
          message: "Hello",
          details: "World",
        },
      ],
    });
  });
});
