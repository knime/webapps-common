import {
  type Mock,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

import { setUpCustomEmbedderService } from "../../embedder";
import { DataServiceType } from "../../types/DataServiceType";
import { INTERNAL_ERROR_CODE, USER_ERROR_CODE } from "../../types/alert";
import { JsonDataService } from "../JsonDataService";
import type {
  JsonRpcOtherError,
  JsonRpcUserError,
} from "../types/jsonRPCTypes";

import { extensionConfig } from "./mocks";

describe("JsonDataService", () => {
  const defaultExtensionConfig = extensionConfig;

  const constructJsonDataService = (
    extensionConfig = defaultExtensionConfig,
  ) => {
    const apiLayer = {
      callNodeDataService: vi.fn().mockResolvedValue({}),
      publishData: vi.fn(),
      sendAlert: vi.fn(),
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
    it("creates data service", () => {
      const { jsonDataService } = constructJsonDataService();
      expect(jsonDataService).toHaveProperty("initialData");
    });
  });

  describe("service.initialData", () => {
    it("fetches initialData if it's passed to constructor", async () => {
      const { jsonDataService } = constructJsonDataService();
      const response = await jsonDataService.initialData();
      expect(response).toStrictEqual(extensionConfig.initialData.result);
    });

    it("fetches initialData via KnimeService", async () => {
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

  const getFirstCallParameter = (callNodeDataService: Mock) => {
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
      expect(response).toBe("");
    });
  });

  describe("service.applyData", () => {
    let jsonDataService: JsonDataService, callNodeDataService: Mock;

    beforeEach(() => {
      const constructed = constructJsonDataService();
      jsonDataService = constructed.jsonDataService;
      callNodeDataService = constructed.callNodeDataService;
    });

    afterEach(() => {
      vi.resetAllMocks();
    });

    it('calls the apply data service when "applyData" is called', async () => {
      const appliedData = { view: "123" };
      await jsonDataService.applyData(appliedData);
      const parameter = getFirstCallParameter(callNodeDataService);
      expect(parameter).toMatchObject({
        serviceType: DataServiceType.APPLY_DATA,
        dataServiceRequest: JSON.stringify(appliedData),
      });
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
        code: USER_ERROR_CODE,
        message: "Something went wrong",
        data: {
          details: "More information",
        },
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
        code: INTERNAL_ERROR_CODE,
        message: "Java heap space",
        data: {
          typeName: "OutOfMemoryError",
          stackTrace: ["Line 1", "Line 2"],
        },
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
        type: "warn",
        warnings: [{ message: "Warn" }, { message: "ing" }],
      });
    });

    it("handles errors during data service requests", async () => {
      const error = {
        code: USER_ERROR_CODE,
        message: "Frequency Column Universe_0_0 is not present in table.",
        data: {
          details: "More information",
        },
      } satisfies JsonRpcUserError;
      const { jsonDataService, callNodeDataService, sendAlert } =
        constructJsonDataService(extensionConfig);
      callNodeDataService.mockResolvedValue({
        result: { error },
      });
      const response = await jsonDataService.data();
      expect(response).toBeFalsy();
      expect(sendAlert).toBeCalledWith({
        code: USER_ERROR_CODE,
        message: error.message,
        type: "error",
        data: {
          details: error.data.details,
        },
      });
    });

    it("handles other errors during data service requests", async () => {
      const error = {
        code: 123,
        message: "Something went wrong",
        data: null,
      } satisfies JsonRpcOtherError;
      const { jsonDataService, callNodeDataService, sendAlert } =
        constructJsonDataService(extensionConfig);
      callNodeDataService.mockResolvedValue({
        result: { error },
      });
      const response = await jsonDataService.data();
      expect(response).toBeFalsy();
      expect(sendAlert).toBeCalledWith({
        originalCode: error.code,
        message: error.message,
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
        warnings: [{ message: "Warn" }, { message: "ing" }],
        type: "warn",
      });
    });
  });
});
