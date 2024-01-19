import { JsonDataService } from "src/services/JsonDataService";
import { extensionConfig, longMessage } from "test/mocks";
import { DataServiceType } from "src/types/DataServiceType";
import { Alert, AlertType } from "src/types/alert";
import { setUpCustomEmbedderService } from "src/embedder";
import { UIExtensionPushEvents } from "src/types/pushEvents";

describe("JsonDataService", () => {
  const defaultExtensionConfig = extensionConfig;

  const constructJsonDataService = (
    extensionConfig = defaultExtensionConfig,
  ) => {
    const apiLayer = {
      callNodeDataService: jest.fn().mockResolvedValue({}),
      publishData: jest.fn(),
      sendAlert: jest.fn(),
      getConfig: () => extensionConfig,
    };
    const embedder = setUpCustomEmbedderService(apiLayer);

    const jsonDataService = new JsonDataService(embedder.service);
    return {
      jsonDataService,
      ...apiLayer,
      dispatchPushEvent: embedder.dispatchPushEvent,
    };
  };

  describe("initialization", () => {
    it("Creates data service", () => {
      const { jsonDataService } = constructJsonDataService();
      expect(jsonDataService).toHaveProperty("initialData");
    });
  });

  describe("service.initialData", () => {
    it("Fetches initialData if it's passed to constructor", async () => {
      const { jsonDataService } = constructJsonDataService();
      const response = await jsonDataService.initialData();
      expect(response).toStrictEqual(extensionConfig.initialData.result);
    });

    it("Fetches initialData via KnimeService", async () => {
      const localExtensionConfig = { ...extensionConfig };
      delete localExtensionConfig.initialData;
      const { jsonDataService, callNodeDataService } =
        constructJsonDataService(localExtensionConfig);
      callNodeDataService.mockResolvedValue({
        result: extensionConfig.initialData,
      });

      const response = await jsonDataService.initialData();
      expect(callNodeDataService).toHaveBeenCalledWith(
        expect.objectContaining({
          serviceType: DataServiceType.INITIAL_DATA,
        }),
      );
      expect(response).toStrictEqual(extensionConfig.initialData);
    });
  });

  const getFirstCallParameter = (callNodeDataService: jest.Mock) => {
    return callNodeDataService.mock.calls[0][0];
  };

  describe("service.data", () => {
    it("calls default data service", () => {
      const { jsonDataService, callNodeDataService } =
        constructJsonDataService();

      jsonDataService.data();

      const parameters = getFirstCallParameter(callNodeDataService);
      expect(parameters.serviceType).toBe(DataServiceType.DATA);
    });

    it("calls data service with options", () => {
      const options = {
        columns: [1, 2],
        rows: 500,
      };
      const { jsonDataService, callNodeDataService } =
        constructJsonDataService();

      jsonDataService.data({ options });

      const parameters = getFirstCallParameter(callNodeDataService);
      expect(parameters.dataServiceRequest).toContain(JSON.stringify(options));
    });

    it("calls data service by method", () => {
      const { jsonDataService, callNodeDataService } =
        constructJsonDataService();

      jsonDataService.data({ method: "nextPage" });

      const parameters = getFirstCallParameter(callNodeDataService);
      expect(parameters.dataServiceRequest).toContain("nextPage");
    });

    it("accepts empty string response from data request", async () => {
      const { jsonDataService, callNodeDataService } =
        constructJsonDataService(extensionConfig);
      callNodeDataService.mockResolvedValue({ result: { result: "" } });
      const response = await jsonDataService.data();
      expect(response).toEqual("");
    });
  });

  describe("service.applyData", () => {
    /* const mockData = {
      item1: true,
      item2: 10,
    }; */

    let jsonDataService: JsonDataService, callNodeDataService;

    beforeEach(() => {
      const constructed = constructJsonDataService();
      jsonDataService = constructed.jsonDataService;
      callNodeDataService = constructed.callNodeDataService;
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('calls the apply data service when "applyData" is called', async () => {
      const appliedData = { view: "123" };
      await jsonDataService.applyData(appliedData);
      const parameter = getFirstCallParameter(callNodeDataService);
      expect(parameter).toMatchObject({
        serviceType: DataServiceType.APPLY_DATA,
        dataServiceRequest: appliedData,
      });
    });
  });

  describe("callbacks and events", () => {
    it("adds callback to event with addOnDataChangeCallback", () => {
      const { jsonDataService, dispatchPushEvent } = constructJsonDataService();

      const mockDataChangeCallback = jest.fn();

      jsonDataService.addOnDataChangeCallback(mockDataChangeCallback);

      const payload = {};

      dispatchPushEvent({
        name: UIExtensionPushEvents.EventTypes.DataEvent,
        payload,
      });
      expect(mockDataChangeCallback).toHaveBeenCalledWith(payload);
    });

    it("publishes data via the knimeService", () => {
      const { jsonDataService, publishData } = constructJsonDataService();
      const testData = { agent: "007" };
      jsonDataService.publishData(testData);
      expect(publishData).toHaveBeenCalledWith(testData);
    });
  });

  describe("handling errors", () => {
    it("handles user errors during initial data service requests", async () => {
      const expectedError = {
        message: "Something went wrong",
        details: "More information",
      };
      const { jsonDataService, sendAlert } = constructJsonDataService({
        ...extensionConfig,
        initialData: { userError: expectedError },
      });
      const response = await jsonDataService.initialData();
      expect(response).toBeFalsy();
      expect(sendAlert).toBeCalledWith({
        code: undefined,
        message: "More information",
        nodeId: extensionConfig.nodeId,
        nodeInfo: extensionConfig.nodeInfo,
        subtitle: "Something went wrong",
        type: "error",
      });
    });

    it("handles internal errors during initial data service requests", async () => {
      const expectedError = {
        message: "Java heap space",
        typeName: "OutOfMemoryError",
        stackTrace: ["Line 1", "Line 2"],
      };
      const { jsonDataService, sendAlert } = constructJsonDataService({
        ...extensionConfig,
        initialData: { internalError: expectedError },
      });
      const response = await jsonDataService.initialData();
      expect(response).toBeFalsy();
      expect(sendAlert).toBeCalledWith({
        code: undefined,
        message: expect.stringContaining(expectedError.stackTrace.join("\n\t")),
        nodeId: extensionConfig.nodeId,
        nodeInfo: extensionConfig.nodeInfo,
        subtitle: "Java heap space",
        type: "error",
      });
    });

    it("handles warning messages during initial data service requests", async () => {
      const initialData = {
        result: "Some data",
        warningMessages: ["Warn", "ing"],
      };
      const { jsonDataService, sendAlert } = constructJsonDataService({
        ...extensionConfig,
        initialData,
      });
      const response = await jsonDataService.initialData();
      expect(response).toStrictEqual(initialData.result);
      expect(sendAlert).toBeCalledWith({
        code: undefined,
        message: initialData.warningMessages.join("\n\n"),
        nodeId: extensionConfig.nodeId,
        nodeInfo: extensionConfig.nodeInfo,
        subtitle: "2 messages",
        type: "warn",
      });
    });

    it("handles errors during data service requests", async () => {
      const expectedError = {
        code: -32001,
        message: "Frequency Column Universe_0_0 is not present in table.",
        data: {
          details: "More information",
        },
      };
      const { jsonDataService, callNodeDataService, sendAlert } =
        constructJsonDataService(extensionConfig);
      callNodeDataService.mockResolvedValue({
        result: { error: expectedError },
      });
      const response = await jsonDataService.data();
      expect(response).toBeFalsy();
      expect(sendAlert).toBeCalledWith({
        code: -32001,
        message: expectedError.data.details,
        nodeId: extensionConfig.nodeId,
        nodeInfo: extensionConfig.nodeInfo,
        subtitle: expectedError.message,
        type: "error",
      });
    });

    it("handles warning messages during data service requests", async () => {
      const data = {
        result: "Some data",
        warningMessages: ["Warn", "ing"],
      };
      const { jsonDataService, callNodeDataService, sendAlert } =
        constructJsonDataService(extensionConfig);
      callNodeDataService.mockResolvedValue({ result: data });
      const response = await jsonDataService.data();
      expect(response).toStrictEqual(data.result);
      expect(sendAlert).toBeCalledWith({
        code: undefined,
        message: data.warningMessages.join("\n\n"),
        nodeId: extensionConfig.nodeId,
        nodeInfo: extensionConfig.nodeInfo,
        subtitle: "2 messages",
        type: "warn",
      });
    });
  });

  describe("alert formatting", () => {
    let jsonDataService, sendAlertSpy;

    beforeEach(() => {
      const constructed = constructJsonDataService(extensionConfig);
      sendAlertSpy = constructed.sendAlert;
      jsonDataService = constructed.jsonDataService;
    });

    it("formats a single warning message", () => {
      jsonDataService.handleWarnings(["Message 1"]);
      const sentMessage = sendAlertSpy.mock.calls[0][0] as Alert;
      expect(sentMessage.message).toBe("Message 1");
      expect(sentMessage.type).toBe(AlertType.WARN);
      expect(sentMessage.subtitle).toBeFalsy();
    });

    it("formats multiple warning messages", () => {
      const warnings = ["Message 1", "Message 2"];
      jsonDataService.handleWarnings(warnings);
      const sentMessage = sendAlertSpy.mock.calls[0][0] as Alert;
      expect(sentMessage.message).toBe(warnings.join("\n\n"));
      expect(sentMessage.type).toBe(AlertType.WARN);
      expect(sentMessage.subtitle).toBe("2 messages");
    });

    it("formats long warning messages", () => {
      jsonDataService.handleWarnings([longMessage]);
      const sentMessage = sendAlertSpy.mock.calls[0][0] as Alert;
      expect(sentMessage.message).toBe(longMessage);
      expect(sentMessage.type).toBe(AlertType.WARN);
      expect(sentMessage.subtitle).toBe("Expand for details");
    });

    it("formats default error", () => {
      jsonDataService.handleError({});
      const sentMessage = sendAlertSpy.mock.calls[0][0] as Alert;
      expect(sentMessage.message).toBe(
        "No further information available. Please check the workflow configuration.",
      );
      expect(sentMessage.type).toBe(AlertType.ERROR);
      expect(sentMessage.subtitle).toBe("Something went wrong");
    });

    it("formats long error message", () => {
      jsonDataService.handleError({ message: longMessage });
      const sentMessage = sendAlertSpy.mock.calls[0][0] as Alert;
      expect(sentMessage.message).toBe(longMessage);
      expect(sentMessage.type).toBe(AlertType.ERROR);
      expect(sentMessage.subtitle).toBe("Something went wrong");
    });

    it("formats all error information", () => {
      jsonDataService.handleError({
        details: "Something went wrong",
        stackTrace: ["Line1", "Line2"],
        typeName: "NullPointerException",
        message: "Please check the workflow configuration",
        code: 401,
      });
      const sentMessage = sendAlertSpy.mock.calls[0][0] as Alert;
      expect(sentMessage).toStrictEqual({
        code: 401,
        nodeId: extensionConfig.nodeId,
        message: expect.any(String),
        nodeInfo: extensionConfig.nodeInfo,
        subtitle: "Please check the workflow configuration",
        type: AlertType.ERROR,
      });
      expect(sentMessage.message).toContain("NullPointerException");
      expect(sentMessage.message).toContain("Something went wrong");
      expect(sentMessage.message).toContain("Line1\n\tLine2");
    });
  });

  describe("dialog settings", () => {
    it("returns the supplied dialog settings", () => {
      const dialogSettings = { view: { foo: "bar" } };
      const localExtensionConfig = { ...extensionConfig, dialogSettings };
      const { jsonDataService } =
        constructJsonDataService(localExtensionConfig);
      expect(jsonDataService.getDialogSettings()).toStrictEqual(dialogSettings);
    });

    it("returns null if no dialog settings are supplied", () => {
      const { jsonDataService } = constructJsonDataService();
      expect(jsonDataService.getDialogSettings()).toBeNull();
    });
  });
});
