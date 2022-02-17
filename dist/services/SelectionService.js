import { NodeServices } from '../types/NodeServices.js';
import '../types/DataServiceTypes.js';
import { SelectionModes } from '../types/SelectionModes.js';
import '../types/ExtensionTypes.js';
import { EventTypes } from '../types/EventTypes.js';
import '../types/ResourceTypes.js';

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
     * Calls a selection service via the node service `updateDataPointSelection` method with provided request body.
     * The selection service to call is specified by the service type and needs to correspond directly to
     * a {@see SelectionServices}.
     *
     * @param {SelectionMode} selectionMode - the selection mode.
     * @param {string} request - the request payload.
     * @returns {Promise} rejected or resolved depending on backend response.
     */
    callSelectionService(selectionMode, request) {
        return this.knimeService.callService([NodeServices.CALL_NODE_SELECTION_SERVICE, selectionMode, request]).then((response) => typeof response === 'string' ? JSON.parse(response) : response);
    }
    /**
     * Adds data to currently selected data set.
     * @param {(string | key)[]} keys - will be passed as params to backend SelectionService add selection method
     * @returns {Promise<Object>} based on backend implementation.
     */
    add(keys) {
        return this.callSelectionService(SelectionModes.ADD, keys);
    }
    /**
     * Removes data from currently selected data set.
     * @param {(string | key)[]} keys - will be passed as params to backend SelectionService remove selection method.
     * @returns {Promise<Object>} - based on backend implementation.
     */
    remove(keys) {
        return this.callSelectionService(SelectionModes.REMOVE, keys);
    }
    /**
     * Replaces current selection with provided data.
     * @param {(string | key)[]} keys - will be passed as params to backend SelectionService replace selection method.
     * @returns {Promise<Object>} - based on backend implementation.
     */
    replace(keys) {
        return this.callSelectionService(SelectionModes.REPLACE, keys);
    }
    /**
     * Adds callback that will be triggered on data selection change by backend.
     * @param {function} callback - that need to be added. Will be triggered by backend implementation on selection change.
     * @param {Notification} response - object that backend will trigger callback with.
     * @returns {void}
     */
    addOnSelectionChangeCallback(callback) {
        this.knimeService.addNotificationCallback(EventTypes.SelectionEvent, callback);
    }
    /**
     * Removes previously added callback.
     * @param {function} callback - that needs to be removed from notifications.
     * @param {Notification} response - object that backend will trigger callback with.
     * @returns {void}
     */
    removeOnSelectionChangeCallback(callback) {
        this.knimeService.removeNotificationCallback(EventTypes.SelectionEvent, callback);
    }
}

export { SelectionService };
