import { IFrameKnimeService } from "../index-a3360790";
import { Notification } from "../index-692f6f4e";
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
     * Calls the NodeService `selectDataPoints` method with request body. The selection service to call is
     * specified by the service type and needs to correspond directly to a {@see SelectionServiceTypes}.
     *
     * @param {SelectionServiceTypes} selectionService - the target selection service.
     * @param {string} request - the request payload.
     * @returns {Promise} rejected or resolved depending on backend response.
     */
    /**
     * Calls the NodeService `selectDataPoints` method with request body. The selection service to call is
     * specified by the service type and needs to correspond directly to a {@see SelectionServiceTypes}.
     *
     * @param {SelectionServiceTypes} selectionService - the target selection service.
     * @param {string} request - the request payload.
     * @returns {Promise} rejected or resolved depending on backend response.
     */
    private callSelectionService;
    /**
     * Adds data to currently selected data set.
     * @param {(string | key)[]} keys - will be passed as params to backend SelectionService add selection method
     * @returns {Promise<Object>} based on backend implementation.
     */
    /**
     * Adds data to currently selected data set.
     * @param {(string | key)[]} keys - will be passed as params to backend SelectionService add selection method
     * @returns {Promise<Object>} based on backend implementation.
     */
    add(keys: (string | number)[]): Promise<any>;
    /**
     * Removes data from currently selected data set.
     * @param {(string | key)[]} keys - will be passed as params to backend SelectionService remove selection method.
     * @returns {Promise<Object>} - based on backend implementation.
     */
    /**
     * Removes data from currently selected data set.
     * @param {(string | key)[]} keys - will be passed as params to backend SelectionService remove selection method.
     * @returns {Promise<Object>} - based on backend implementation.
     */
    remove(keys: (string | number)[]): Promise<any>;
    /**
     * Replaces current selection with provided data.
     * @param {(string | key)[]} keys - will be passed as params to backend SelectionService replace selection method.
     * @returns {Promise<Object>} - based on backend implementation.
     */
    /**
     * Replaces current selection with provided data.
     * @param {(string | key)[]} keys - will be passed as params to backend SelectionService replace selection method.
     * @returns {Promise<Object>} - based on backend implementation.
     */
    replace(keys: (string | number)[]): Promise<any>;
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
