import { IFrameKnimeService } from "../index-a3360790";
import { Notification } from "../index-b3e43760";
import { KnimeService } from "./KnimeService";
/**
 * SelectionService provides methods to handle data selection.
 * To use it, the relating Java implementation also needs to use the SelectionService.
 */
declare class SelectionService<T = any> {
    private knimeService;
    /**
     * @param {KnimeService} knimeService - instance should be provided to use notifications.
     */
    /**
     * @param {KnimeService} knimeService - instance should be provided to use notifications.
     */
    constructor(knimeService: IFrameKnimeService | KnimeService<T>);
    /**
     * Replaces current selection with provided data.
     * @param {SelectionMode} mode - the selection mode.
     * @param {string | string[]} selection - will be passed as params to backend NodeService.updateDataPointSelection.
     * @returns {Promise<Object>} - based on backend implementation.
     */
    /**
     * Replaces current selection with provided data.
     * @param {SelectionMode} mode - the selection mode.
     * @param {string | string[]} selection - will be passed as params to backend NodeService.updateDataPointSelection.
     * @returns {Promise<Object>} - based on backend implementation.
     */
    private updateSelection;
    /**
     * Adds data to currently selected data set.
     * @param {string | string[]} selection - will be passed as params to backend NodeService.updateDataPointSelection.
     * @returns {Promise<Object>} based on backend implementation.
     */
    /**
     * Adds data to currently selected data set.
     * @param {string | string[]} selection - will be passed as params to backend NodeService.updateDataPointSelection.
     * @returns {Promise<Object>} based on backend implementation.
     */
    add(selection: (string | string[])): Promise<object>;
    /**
     * Removes data from currently selected data set.
     * @param {string | string[]} selection - will be passed as params to backend NodeService.updateDataPointSelection.
     * @returns {Promise<Object>} based on backend implementation.
     */
    /**
     * Removes data from currently selected data set.
     * @param {string | string[]} selection - will be passed as params to backend NodeService.updateDataPointSelection.
     * @returns {Promise<Object>} based on backend implementation.
     */
    remove(selection: (string | string[])): Promise<object>;
    /**
     * Replaces current selection with provided data.
     * @param {string | string[]} selection - will be passed as params to backend NodeService.updateDataPointSelection.
     * @returns {Promise<Object>} based on backend implementation.
     */
    /**
     * Replaces current selection with provided data.
     * @param {string | string[]} selection - will be passed as params to backend NodeService.updateDataPointSelection.
     * @returns {Promise<Object>} based on backend implementation.
     */
    replace(selection: (string | string[])): Promise<object>;
    /**
     * Adds callback that will be triggered on data selection change by backend.
     * @param {function} callback - that need to be added. Will be triggered by backend implementation on selection change.
     * @param {Notification} response - object that backend will trigger callback with.
     * @returns {void}
     */
    /**
     * Adds callback that will be triggered on data selection change by backend.
     * @param {function} callback - that need to be added. Will be triggered by backend implementation on selection change.
     * @param {Notification} response - object that backend will trigger callback with.
     * @returns {void}
     */
    addOnSelectionChangeCallback(callback: (notification: Notification) => void): void;
    /**
     * Removes previously added callback.
     * @param {function} callback - that needs to be removed from notifications.
     * @param {Notification} response - object that backend will trigger callback with.
     * @returns {void}
     */
    /**
     * Removes previously added callback.
     * @param {function} callback - that needs to be removed from notifications.
     * @param {Notification} response - object that backend will trigger callback with.
     * @returns {void}
     */
    removeOnSelectionChangeCallback(callback: (notification: Notification) => void): void;
}
export { SelectionService };
