import { IFrameKnimeService } from 'src/services';
import { Notification, NodeServices, SelectionMode, SelectionModes, EventTypes } from 'src/types';
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
     * Calls a selection service via the node service `updateDataPointSelection` method with provided request body.
     * The selection service to call is specified by the service type and needs to correspond directly to
     * a {@see SelectionServices}.
     *
     * @param {SelectionMode} selectionMode - the selection mode.
     * @param {string} request - the request payload.
     * @returns {Promise} rejected or resolved depending on backend response.
     */
    private callSelectionService(selectionMode: SelectionMode, request) {
        return this.knimeService.callService(
            [NodeServices.CALL_NODE_SELECTION_SERVICE, selectionMode, request]
        ).then((response) => typeof response === 'string' ? JSON.parse(response) : response);
    }

    /**
     * Adds data to currently selected data set.
     * @param {(string | key)[]} keys - will be passed as params to backend SelectionService add selection method
     * @returns {Promise<Object>} based on backend implementation.
     */
    add(keys: (string | number)[]) {
        return this.callSelectionService(SelectionModes.ADD, keys);
    }

    /**
     * Removes data from currently selected data set.
     * @param {(string | key)[]} keys - will be passed as params to backend SelectionService remove selection method.
     * @returns {Promise<Object>} - based on backend implementation.
     */
    remove(keys: (string | number)[]) {
        return this.callSelectionService(SelectionModes.REMOVE, keys);
    }

    /**
     * Replaces current selection with provided data.
     * @param {(string | key)[]} keys - will be passed as params to backend SelectionService replace selection method.
     * @returns {Promise<Object>} - based on backend implementation.
     */
    replace(keys: (string | number)[]) {
        return this.callSelectionService(SelectionModes.REPLACE, keys);
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
