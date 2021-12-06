import { NodeServiceMethods } from '../types/ServiceMethods.js';
import { SelectionServiceTypes } from '../types/ServiceTypes.js';
import '../types/ExtensionTypes.js';
import '../types/ResourceTypes.js';
import { createJsonRpcRequest } from '../utils/createJsonRpcRequest.js';

/**
 * SelectionService provides methods to handle data selection.
 * To use it, the relating Java implementation also needs to use the SelectionService.
 */
class SelectionService {
    /**
     * @param {KnimeService} knimeService - instance should be provided to use notifications.
     */
    constructor(knimeService) {
        this.knimeService = knimeService;
    }
    /**
     * Calls the NodeService `selectDataPoints` method with request body. The selection service to call is
     * specified by the service type and needs to correspond directly to a {@see SelectionServiceTypes}.
     *
     * @param {SelectionServiceTypes} selectionService - the target selection service.
     * @param {string} request - the request payload.
     * @returns {Promise} rejected or resolved depending on backend response.
     */
    callSelectionService(selectionService, request) {
        return this.knimeService
            .callService(createJsonRpcRequest(NodeServiceMethods.CALL_NODE_SELECTION_SERVICE, [
            this.knimeService.extensionConfig.projectId,
            this.knimeService.extensionConfig.workflowId,
            this.knimeService.extensionConfig.nodeId,
            selectionService,
            request || ''
        ]));
    }
    /**
     * Adds data to currently selected data set.
     * @param {(string | key)[]} keys - will be passed as params to backend SelectionService add selection method
     * @returns {Promise<Object>} based on backend implementation.
     */
    add(keys) {
        return this.callSelectionService(SelectionServiceTypes.ADD, keys);
    }
    /**
     * Removes data from currently selected data set.
     * @param {(string | key)[]} keys - will be passed as params to backend SelectionService remove selection method.
     * @returns {Promise<Object>} - based on backend implementation.
     */
    remove(keys) {
        return this.callSelectionService(SelectionServiceTypes.REMOVE, keys);
    }
    /**
     * Replaces current selection with provided data.
     * @param {(string | key)[]} keys - will be passed as params to backend SelectionService replace selection method.
     * @returns {Promise<Object>} - based on backend implementation.
     */
    replace(keys) {
        return this.callSelectionService(SelectionServiceTypes.REPLACE, keys);
    }
    /**
     * Adds callback that will be triggered on data selection change by backend.
     * @param {function} callback - that need to be added. Will be triggered by backend implementation on selection change.
     * @param {Notification} response - object that backend will trigger callback with.
     * @returns {void}
     */
    addOnSelectionChangeCallback(callback) {
        this.knimeService.addNotificationCallback('SelectionEvent', callback);
    }
    /**
     * Removes previously added callback.
     * @param {function} callback - that needs to be removed from notifications.
     * @param {Notification} response - object that backend will trigger callback with.
     * @returns {void}
     */
    removeOnSelectionChangeCallback(callback) {
        this.knimeService.removeNotificationCallback('SelectionEvent', callback);
    }
}

export { SelectionService };
