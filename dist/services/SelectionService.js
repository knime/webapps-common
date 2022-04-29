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
     * Replaces current selection with provided data.
     * @param {SelectionMode} mode - the selection mode.
     * @param {string | string[]} selection - will be passed as params to backend NodeService.updateDataPointSelection.
     * @returns {Promise<Object>} - based on backend implementation.
     */
    async updateSelection(mode, selection) {
        const response = await this.knimeService.callService([NodeServices.CALL_NODE_SELECTION_SERVICE, mode,
            Array.isArray(selection) ? JSON.stringify(selection) : selection]);
        return typeof response === 'string' ? JSON.parse(response) : response;
    }
    /**
     * Adds data to currently selected data set.
     * @param {string | string[]} selection - will be passed as params to backend NodeService.updateDataPointSelection.
     * @returns {Promise<Object>} based on backend implementation.
     */
    add(selection) {
        return this.updateSelection(SelectionModes.ADD, selection);
    }
    /**
     * Removes data from currently selected data set.
     * @param {string | string[]} selection - will be passed as params to backend NodeService.updateDataPointSelection.
     * @returns {Promise<Object>} based on backend implementation.
     */
    remove(selection) {
        return this.updateSelection(SelectionModes.REMOVE, selection);
    }
    /**
     * Replaces current selection with provided data.
     * @param {string | string[]} selection - will be passed as params to backend NodeService.updateDataPointSelection.
     * @returns {Promise<Object>} based on backend implementation.
     */
    replace(selection) {
        return this.updateSelection(SelectionModes.REPLACE, selection);
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
