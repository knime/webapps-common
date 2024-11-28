import { DataServiceType } from "../types/DataServiceType";
import { AlertType } from "../types/alert";
import { createJsonRpcRequest, initialDataResponseToAlert } from "../utils";

import { AbstractService } from "./AbstractService";
import type { InitialDataResponse } from "./types/initialDataTypes";
import type { JSONRPCError, JSONRPCResponse } from "./types/jsonRPCTypes";
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
        ) as Promise<{ result?: any }>
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
      initialData = await this.callDataService(DataServiceType.INITIAL_DATA);
    }

    if (typeof initialData === "string") {
      initialData = JSON.parse(initialData);
    }
    if (!initialData) {
      // eslint-disable-next-line no-undefined
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
   * @param {any} [params.options] - optional options that should be passed to called method.
   * @returns {Promise} rejected or resolved depending on backend response.
   */
  async data(params: { method?: string; options?: any } = {}) {
    const response = await this.callDataService(
      DataServiceType.DATA,
      JSON.stringify(
        createJsonRpcRequest(params.method || "getData", params.options),
      ),
    );
    // https://www.jsonrpc.org/specification#response_object:~:text=method%27s%20expected%20parameters.-,5%20Response%20object,-When%20a%20rpc
    if (!response?.result) {
      // eslint-disable-next-line no-undefined
      return undefined;
    }
    const jsonRPCResponse: JSONRPCResponse =
      typeof response.result === "string"
        ? JSON.parse(response.result)
        : response.result;
    if (jsonRPCResponse.error) {
      this.handleError(jsonRPCResponse.error);
      // eslint-disable-next-line no-undefined
      return undefined;
    } else {
      const { result, warningMessages } = jsonRPCResponse;
      if (warningMessages) {
        this.handleWarnings(warningMessages);
      }
      return result;
    }
  }

  /**
   * Sends the current client-side data to the backend to be persisted. A data getter method which returns the
   * data to be applied/saved should be registered *prior* to invoking this method. If none is registered, a
   * default payload of "null" will be sent instead.
   *
   * @returns {Promise} rejected or resolved depending on backend response.
   */
  applyData(data: any) {
    return this.callDataService(
      DataServiceType.APPLY_DATA,
      JSON.stringify(data),
    );
  }

  private handleError(error: JSONRPCError) {
    if (error.data) {
      this.baseService.sendAlert({ type: AlertType.ERROR, ...error });
    }
    this.baseService.sendAlert({
      type: AlertType.ERROR,
      originalCode: error.code,
      message: error.message,
    });
  }

  private handleWarnings(warningMessages: string[]) {
    this.baseService.sendAlert({
      type: AlertType.WARN,
      warnings: warningMessages.map((message) => ({ message })),
    });
  }
}
