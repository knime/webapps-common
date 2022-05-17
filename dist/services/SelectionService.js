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
     * Retrieves the initial data for the client-side UI Extension implementation from the extension configuration
     * if it exists.
     *
     * @returns {Promise} node initial selection provided by the extension configuration.
     */
    async initialSelection() {
        var _a, _b;
        let initialSelection;
        if ((_a = this.knimeService.extensionConfig) === null || _a === void 0 ? void 0 : _a.initialData) {
            initialSelection = await Promise.resolve((_b = this.knimeService.extensionConfig) === null || _b === void 0 ? void 0 : _b.initialSelection);
        }
        if (typeof initialSelection === 'string') {
            initialSelection = JSON.parse(initialSelection);
        }
        return Promise.resolve(initialSelection);
    }
    /**
     * Replaces current selection with provided data.
     * @param {SelectionMode} mode - the selection mode.
     * @param {string | string[]} selection - will be passed as params to backend NodeService.updateDataPointSelection.
     * @returns {Promise<any>} - based on backend implementation.
     */
    updateSelection(mode, selection) {
        return this.knimeService.callService([NodeServices.CALL_NODE_SELECTION_SERVICE, mode,
            Array.isArray(selection) ? JSON.stringify(selection) : selection]).then((response) => typeof response === 'string' ? JSON.parse(response) : response);
    }
    /**
     * Adds data to currently selected data set.
     * @param {string | string[]} selection - will be passed as params to backend NodeService.updateDataPointSelection.
     * @returns {Promise<any>} based on backend implementation.
     */
    add(selection) {
        return this.updateSelection(SelectionModes.ADD, selection);
    }
    /**
     * Removes data from currently selected data set.
     * @param {string | string[]} selection - will be passed as params to backend NodeService.updateDataPointSelection.
     * @returns {Promise<any>} based on backend implementation.
     */
    remove(selection) {
        return this.updateSelection(SelectionModes.REMOVE, selection);
    }
    /**
     * Replaces current selection with provided data.
     * @param {string | string[]} selection - will be passed as params to backend NodeService.updateDataPointSelection.
     * @returns {Promise<any>} based on backend implementation.
     */
    replace(selection) {
        return this.updateSelection(SelectionModes.REPLACE, selection);
    }
    /**
     * Adds callback that will be triggered on data selection change outside the scope of the view.
     * @param {function} callback - that need to be added. Will be triggered by the framework on selection change.
     * @returns {void}
     */
    addOnSelectionChangeCallback(callback) {
        const wrappedCallback = (notification) => {
            const { nodeId, keys, mode } = notification.params[0] || {};
            if (this.knimeService.extensionConfig.nodeId === nodeId) {
                callback({ keys, mode });
            }
        };
        this.knimeService.addNotificationCallback(EventTypes.SelectionEvent, wrappedCallback);
    }
    /**
     * Removes previously added callback.
     * @param {function} callback - that needs to be removed from notifications.
     * @returns {void}
     */
    removeOnSelectionChangeCallback(callback) {
        this.knimeService.removeNotificationCallback(EventTypes.SelectionEvent, callback);
    }
}

export { SelectionService };
