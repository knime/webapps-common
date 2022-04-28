import { IFrameKnimeService } from 'src/services';
import { Notification, NodeServices, SelectionModes, EventTypes } from 'src/types';
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
     * Replaces current selection with provided data.
     * @param {SelectionMode} mode - the selection mode.
     * @param selection - will be passed as params to backend SelectionService update selection method.
     * @returns {Promise<Object>} - based on backend implementation.
     */
    private updateSelection(mode: SelectionModes, selection: (string | string[])) {
        return this.knimeService.callService(
            [NodeServices.CALL_NODE_SELECTION_SERVICE, mode,
                Array.isArray(selection) ? JSON.stringify(selection) : selection]
        ).then((response) => typeof response === 'string' ? JSON.parse(response) : response);
    }

    /**
     * Adds data to currently selected data set.
     * @param selection - will be passed as params to backend SelectionService add selection method
     * @returns {Promise<Object>} based on backend implementation.
     */
    add(selection: (string | string[])) {
        return this.updateSelection(SelectionModes.ADD, selection);
    }

    /**
     * Removes data from currently selected data set.
     * @param selection - will be passed as params to backend SelectionService add selection method
     * @returns {Promise<Object>} based on backend implementation.
     */
    remove(selection: (string | string[])) {
        return this.updateSelection(SelectionModes.REMOVE, selection);
    }

    /**
     * Replaces current selection with provided data.
     * @param selection - will be passed as params to backend SelectionService add selection method
     * @returns {Promise<Object>} based on backend implementation.
     */
    replace(selection: (string | string[])) {
        return this.updateSelection(SelectionModes.REPLACE, selection);
    }

    /**
     * Adds callback that will be triggered on data selection change by backend.
     * @param {function} callback - that need to be added. Will be triggered by backend implementation on selection change.
     * @param {Notification} response - object that backend will trigger callback with.
     * @returns {void}
     */
    addOnSelectionChangeCallback(callback: (notification: Notification) => void): void {
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
