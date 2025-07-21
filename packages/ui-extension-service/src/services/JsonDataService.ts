import {
  type DataServiceType,
  USER_ERROR_CODE,
} from "@knime/ui-extension-renderer/api";

import { createJsonRpcRequest, initialDataResponseToAlert } from "../utils";

import { AbstractService } from "./AbstractService";
import type { ApplyDataResponse } from "./types/applyData";
import type { InitialDataResponse } from "./types/initialData";
import type { JSONRPCError, JSONRPCResponse } from "./types/jsonRPC";
import type { JsonDataServiceAPILayer } from "./types/serviceApiLayers";
/**
 * A utility class to interact with JsonDataServices implemented by a UI Extension node.
 */
export class JsonDataService extends AbstractService<JsonDataServiceAPILayer> {
  /**
   * Calls the node data service with optional request body. The service to call is specified by the service type
   * and needs to correspond directly to a @see DataServiceType supported by the node.
   *
   * @param {DataServiceType} dataServiceType - the data service type.
   * @param {string} [request] - an optional request payload.
   * @returns {Promise} rejected or resolved depending on backend response.
   */
  private callDataService(serviceType: DataServiceType, request = "") {
    const config = this.baseService.getConfig();
    return (
      this.baseService
        .callNodeDataService({
          serviceType,
          dataServiceRequest: request,
          extensionType: config.extensionType,
          nodeId: config.nodeId,
          projectId: config.projectId,
          workflowId: config.workflowId,
        })
        // empty string check is required because it cannot be parsed but is a valid/expected response
        .then((response) =>
          typeof response === "string" && response !== ""
            ? JSON.parse(response)
            : response,
        ) as Promise<{ result?: string }>
    );
  }

  /**
   * Retrieves the initial data for the client-side UI Extension implementation from either the local configuration
   * (if it exists) or by fetching the data from the node DataService implementation.
   *
   * @returns {Promise} node initial data provided by the local configuration or by fetching from the DataService.
   */
  async initialData() {
    let initialData;
    const initialDataPerConfig = this.baseService.getConfig().initialData;
    if (initialDataPerConfig) {
      initialData = initialDataPerConfig;
    } else {
      initialData = await this.callDataService("initial_data");
    }

    if (typeof initialData === "string") {
      initialData = JSON.parse(initialData);
    }
    if (!initialData) {
      return undefined;
    }
    initialData satisfies InitialDataResponse;
    const error = initialDataResponseToAlert(initialData);
    if (error) {
      this.handleError(error);
    }
    if (initialData.warningMessages) {
      this.handleWarnings(initialData.warningMessages);
    }
    return initialData.result;
  }

  /**
   * Retrieve data from the node using the @see DataServiceType.DATA api. Different method names can be registered
   * with the data service in the node implementation to provide targets (specified by the {@param method}). Any
   * optional parameter will be provided directly to the data service target and can be used to specify the nature of
   * the data returned.
   *
   * @param {Object} params - parameter options.
   * @param {string} [params.method] - optional target method in the node's DataService implementation
   *      (default 'getData').
   * @param {[]} [params.options] - optional options that should be passed to called method.
   * @returns {Promise} rejected or resolved depending on backend response.
   */
  async data<T = unknown>(
    params: { method?: string; options?: unknown[] } = {},
  ): Promise<T | undefined> {
    const response = await this.callDataService(
      "data",
      JSON.stringify(
        createJsonRpcRequest(params.method || "getData", params.options),
      ),
    );

    // https://www.jsonrpc.org/specification#response_object:~:text=method%27s%20expected%20parameters.-,5%20Response%20object,-When%20a%20rpc
    if (!response?.result) {
      return undefined;
    }

    const jsonRPCResponse: JSONRPCResponse =
      typeof response.result === "string"
        ? JSON.parse(response.result)
        : response.result;

    if (jsonRPCResponse.error) {
      this.handleError(jsonRPCResponse.error);

      return undefined;
    } else {
      const { result, warningMessages } = jsonRPCResponse;

      if (warningMessages) {
        this.handleWarnings(warningMessages);
      }

      return result as T;
    }
  }

  /**
   * Sends the current client-side data to the backend to be persisted. A data getter method which returns the
   * data to be applied/saved should be registered *prior* to invoking this method. If none is registered, a
   * default payload of "null" will be sent instead.
   *
   * @returns a boolean whether the data was successfully applied.
   */
  async applyData(data: unknown) {
    const internalResult = JSON.parse(
      // @ts-expect-error Argument of type 'string | undefined' is not assignable to parameter of type 'string'
      (await this.callDataService("apply_data", JSON.stringify(data))).result,
    ) satisfies ApplyDataResponse;
    if (!internalResult.isApplied) {
      this.handleError({
        code: USER_ERROR_CODE,
        message: internalResult.error,
        data: {},
      });
      return { isApplied: false };
    }
    if (internalResult.warningMessages) {
      this.handleWarnings(internalResult.warningMessages);
    }
    return { isApplied: true };
  }

  private handleError(error: JSONRPCError) {
    if (error.data) {
      this.baseService.sendAlert({ type: "error", ...error });
    }
    this.baseService.sendAlert({
      type: "error",
      originalCode: error.code,
      message: error.message,
    });
  }

  private handleWarnings(warningMessages: string[]) {
    this.baseService.sendAlert({
      type: "warn",
      warnings: warningMessages.map((message) => ({ message })),
    });
  }
}
