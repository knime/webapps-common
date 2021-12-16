import { IFrameKnimeService } from 'src/services';
import { Notification, NodeServiceMethods, SelectionServiceTypes, EventTypes } from 'src/types';
import { createJsonRpcRequest } from 'src/utils';
import { KnimeService } from './KnimeService';

/**
 * SelectionService provides methods to handle data selection.
 * To use it, the relating Java implementation also needs to use the SelectionService.
 */
export class SelectionService<T = any> {
    private knimeService: IFrameKnimeService | KnimeService<T>;

    /**
     * @param {KnimeService} knimeService - instance should be provided to use notifications.
     */
    constructor(knimeService: IFrameKnimeService | KnimeService<T>) {
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
    private callSelectionService(selectionService: SelectionServiceTypes, request) {
        return this.knimeService
            .callService(createJsonRpcRequest(NodeServiceMethods.CALL_NODE_SELECTION_SERVICE, [
                this.knimeService.extensionConfig.projectId,
                this.knimeService.extensionConfig.workflowId,
                this.knimeService.extensionConfig.nodeId,
                selectionService,
                request || ''
            ])).then((response) => typeof response === 'string' ? JSON.parse(response) : response);
    }

    /**
     * Adds data to currently selected data set.
     * @param {(string | key)[]} keys - will be passed as params to backend SelectionService add selection method
     * @returns {Promise<Object>} based on backend implementation.
     */
    add(keys: (string | number)[]) {
        return this.callSelectionService(SelectionServiceTypes.ADD, keys);
    }

    /**
     * Removes data from currently selected data set.
     * @param {(string | key)[]} keys - will be passed as params to backend SelectionService remove selection method.
     * @returns {Promise<Object>} - based on backend implementation.
     */
    remove(keys: (string | number)[]) {
        return this.callSelectionService(SelectionServiceTypes.REMOVE, keys);
    }

    /**
     * Replaces current selection with provided data.
     * @param {(string | key)[]} keys - will be passed as params to backend SelectionService replace selection method.
     * @returns {Promise<Object>} - based on backend implementation.
     */
    replace(keys: (string | number)[]) {
        return this.callSelectionService(SelectionServiceTypes.REPLACE, keys);
    }

    /**
     * Adds callback that will be triggered on data selection change by backend.
     * @param {function} callback - that need to be added. Will be triggered by backend implementation on selection change.
     * @param {Notification} response - object that backend will trigger callback with.
     * @returns {void}
     */
    addOnSelectionChangeCallback(callback: (notification: Notification) => void) {
        this.knimeService.addNotificationCallback(EventTypes.SelectionEvent, callback);
    }

    /**
     * Removes previously added callback.
     * @param {function} callback - that needs to be removed from notifications.
     * @param {Notification} response - object that backend will trigger callback with.
     * @returns {void}
     */
    removeOnSelectionChangeCallback(callback: (notification: Notification) => void) {
        this.knimeService.removeNotificationCallback(EventTypes.SelectionEvent, callback);
    }
}
