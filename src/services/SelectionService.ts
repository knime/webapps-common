import { KnimeService } from 'src';
import { JSONRpcServices, SelectionServiceMethods, Notification } from 'src/types';

/**
 * SelectionService provides methods to handle data selection.
 * To use it, the relating Java implementation also needs to use the SelectionService.
 */
export class SelectionService {
    private knimeService: KnimeService;

    /**
     * @param {KnimeService} knimeService - instance should be provided to use notifications.
     */
    constructor(knimeService: KnimeService) {
        this.knimeService = knimeService;
    }

    private callSelectionService(serviceType: SelectionServiceMethods, request) {
        return this.knimeService.callService(
            JSONRpcServices.CALL_NODE_SELECT_DATA_POINTS,
            serviceType,
            request
        );
    }

    /**
     * Adds data to currently selected data set.
     * @param {(string | key)[]} keys - will be passed as params to backend SelectionService add selection method
     * @returns {Promise<Object>} based on backend implementation.
     */
    add(keys: (string | number)[]) {
        return this.callSelectionService(SelectionServiceMethods.ADD, keys);
    }

    /**
     * Removes data from currently selected data set.
     * @param {(string | key)[]} keys - will be passed as params to backend SelectionService remove selection method.
     * @returns {Promise<Object>} - based on backend implementation.
     */
    remove(keys: (string | number)[]) {
        return this.callSelectionService(SelectionServiceMethods.REMOVE, keys);
    }

    /**
     * Replaces current selection with provided data.
     * @param {(string | key)[]} keys - will be passed as params to backend SelectionService replace selection method.
     * @returns {Promise<Object>} - based on backend implementation.
     */
    replace(keys: (string | number)[]) {
        return this.callSelectionService(SelectionServiceMethods.REPLACE, keys);
    }

    /**
     * Adds callback that will be triggered on data selection change by backend.
     * @param {function} callback - that need to be added. Will be triggered by backend implementation on selection change.
     * @param {Notification} response - object that backend will trigger callback with.
     * @returns {void}
     */
    addOnSelectionChangeCallback(callback: (notification: Notification) => void) {
        this.knimeService.addNotificationCallback('SelectionEvent', callback);
    }

    /**
     * Removes previously added callback.
     * @param {function} callback - that needs to be removed from notifications.
     * @param {Notification} response - object that backend will trigger callback with.
     * @returns {void}
     */
    removeOnSelectionChangeCallback(callback: (notification: Notification) => void) {
        this.knimeService.removeNotificationCallback('SelectionEvent', callback);
    }
}
