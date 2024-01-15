import { DataServiceType, ExtensionTypes } from "src/types";
import { AlertTypes } from "src/types/AlertTypes";
import { DialogSettings } from "src/types/DialogSettings";
import { createJsonRpcRequest } from "src/utils";
import {
  CustomUIExtensionService,
  Identifiers,
  UIExtensionAPILayer,
  UIExtensionPushEvents,
} from "src/serviceTypes";
import { createAlert } from "./utils";
import type { AlertConfig } from "src/types/Alert";
import { AbstractService } from "./AbstractService";

const MAX_MESSAGE_LEN = 160;

type JsonDataServiceExtensionConfig = AlertConfig &
  Identifiers & {
    extensionType: ExtensionTypes;
    initialData?: any;
    dialogSettings?: DialogSettings;
  };

type JsonDataServiceAPILayer = Pick<
  UIExtensionAPILayer,
  "callNodeDataService" | "publishData" | "sendAlert"
> & { getConfig: () => JsonDataServiceExtensionConfig };

export type JsonDataServiceUIExtensionService =
  CustomUIExtensionService<JsonDataServiceAPILayer>;

/**
 * A utility class to interact with JsonDataServices implemented by a UI Extension node.
 */
export class JsonDataService extends AbstractService<JsonDataServiceAPILayer> {
  /**
   * 
  // TODO: could detect BE service type / (endpoint) based on config
  // and call specific service.(...)
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
          request,
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
        )
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
    const { result, warningMessages, userError, internalError } =
      initialData || {};
    if (userError || internalError) {
      this.handleError(userError || internalError);
    }
    if (warningMessages) {
      this.handleWarnings(warningMessages);
    }
    return Promise.resolve(result);
  }

  /**
   * The state of the settings in a coexisting dialog (if any) when the extension is first loaded.
   * More precisely, this is the state of the settings on the last clean state of the dialog before
   * the initialization of the knime service.
   * It is null if there is no dialog or there was no such state before the initialization.
   * In particular it is null if the knime service of the view and the dialog are consturcted at the same time.
   * @returns {DialogSettings | null} the initial dialog state
   */
  getDialogSettings(): DialogSettings | null {
    return this.baseService.getConfig().dialogSettings || null;
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
    let wrappedResult = response?.result || {};
    if (typeof wrappedResult === "string") {
      wrappedResult = JSON.parse(wrappedResult);
    }
    const { error, warningMessages, result } = wrappedResult;
    if (error) {
      this.handleError({ ...(error.data || {}), ...error });
    }
    if (warningMessages) {
      this.handleWarnings(warningMessages);
    }
    return Promise.resolve(result);
  }

  /**
   * Sends the current client-side data to the backend to be persisted. A data getter method which returns the
   * data to be applied/saved should be registered *prior* to invoking this method. If none is registered, a
   * default payload of "null" will be sent instead.
   *
   * @returns {Promise} rejected or resolved depending on backend response.
   */
  applyData(data: any) {
    return this.callDataService(DataServiceType.APPLY_DATA, data);
  }

  /**
   * Adds callback that will be triggered when data changes.
   * @param {Function} callback - called on data change.
   * @param {Event} response - the data update event object.
   * @returns {() => void} - method for removing the listener again
   */
  addOnDataChangeCallback(
    callback: UIExtensionPushEvents.PushEventListenerCallback<any>,
  ) {
    return this.baseService.addPushEventListener("data-change", callback);
  }

  /**
   * Publish a data update event to other UIExtensions registered in the current page.
   * @param {any} data - the data to send.
   * @returns {void}
   */
  publishData(data: any) {
    this.baseService.publishData(data);
  }

  private handleError(
    error: {
      details?: string;
      stackTrace?: any;
      typeName?: string;
      message?: string;
      code?: string | number;
    } = {},
  ) {
    const {
      details = "",
      stackTrace = "",
      typeName = "",
      message = "",
      code,
    } = error;
    let messageSubject = "";
    let messageBody = "";
    if (message) {
      if (message.length <= MAX_MESSAGE_LEN) {
        messageSubject = message;
      } else {
        messageBody = message;
      }
    }
    if (typeName) {
      if (messageSubject) {
        messageBody = typeName;
      } else {
        messageSubject = typeName;
      }
    }
    if (details) {
      messageBody = messageBody ? `${messageBody}\n\n${details}` : details;
    }
    if (Array.isArray(stackTrace)) {
      const formattedStack = stackTrace.join("\n\t");
      messageBody = messageBody
        ? `${messageBody}\n\n${formattedStack}`
        : formattedStack;
    }
    messageBody = messageBody.trim();
    this.baseService.sendAlert(
      createAlert(this.baseService.getConfig(), {
        subtitle: messageSubject || "Something went wrong",
        message:
          messageBody ||
          "No further information available. Please check the workflow configuration.",
        type: AlertTypes.ERROR,
        code,
      }),
    );
  }

  private handleWarnings(warningMessages: [string]) {
    let subtitle;
    const message = warningMessages?.join("\n\n");
    if (warningMessages?.length > 1) {
      subtitle = `${warningMessages?.length} messages`;
    } else if (message?.length > MAX_MESSAGE_LEN) {
      subtitle = "Expand for details";
    }
    this.baseService.sendAlert(
      createAlert(this.baseService.getConfig(), {
        type: AlertTypes.WARN,
        message,
        subtitle,
      }),
    );
  }
}
