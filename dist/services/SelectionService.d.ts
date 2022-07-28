import { IFrameKnimeService } from "../index-fdcc8875";
import { SelectionModes } from "../index-92dc325b";
import { KnimeService } from "./KnimeService";
/**
 * SelectionService provides methods to handle data selection.
 * To use it, the relating Java implementation also needs to use the SelectionService.
 */
declare class SelectionService<T = any> {
    private knimeService;
    private callbackMap;
    private onSelectionChangeCallback;
    private currentPublishSelection;
    private currentSubscribeToSelection;
    /**
     * @param {KnimeService} knimeService - instance should be provided to use notifications.
     */
    /**
     * @param {KnimeService} knimeService - instance should be provided to use notifications.
     */
    constructor(knimeService: IFrameKnimeService | KnimeService<T>);
    /**
     * Retrieves the initial data for the client-side UI Extension implementation from the extension configuration
     * if it exists.
     *
     * @returns {Promise} node initial selection provided by the extension configuration.
     */
    /**
     * Retrieves the initial data for the client-side UI Extension implementation from the extension configuration
     * if it exists.
     *
     * @returns {Promise} node initial selection provided by the extension configuration.
     */
    initialSelection(): Promise<any>;
    /**
     * Replaces current selection with provided data.
     * @param {SelectionMode} mode - the selection mode.
     * @param {string[]} selection - will be passed as params to backend NodeService.updateDataPointSelection.
     * @returns {Promise<any>} - based on backend implementation.
     */
    /**
     * Replaces current selection with provided data.
     * @param {SelectionMode} mode - the selection mode.
     * @param {string[]} selection - will be passed as params to backend NodeService.updateDataPointSelection.
     * @returns {Promise<any>} - based on backend implementation.
     */
    private updateSelection;
    /**
     * Adds data to currently selected data set.
     * @param {string[]} selection - will be passed as params to backend NodeService.updateDataPointSelection.
     * @returns {Promise<any>} based on backend implementation.
     */
    /**
     * Adds data to currently selected data set.
     * @param {string[]} selection - will be passed as params to backend NodeService.updateDataPointSelection.
     * @returns {Promise<any>} based on backend implementation.
     */
    add(selection: string[]): Promise<any>;
    /**
     * Removes data from currently selected data set.
     * @param {string[]} selection - will be passed as params to backend NodeService.updateDataPointSelection.
     * @returns {Promise<any>} based on backend implementation.
     */
    /**
     * Removes data from currently selected data set.
     * @param {string[]} selection - will be passed as params to backend NodeService.updateDataPointSelection.
     * @returns {Promise<any>} based on backend implementation.
     */
    remove(selection: string[]): Promise<any>;
    /**
     * Replaces current selection with provided data.
     * @param {string[]} selection - will be passed as params to backend NodeService.updateDataPointSelection.
     * @returns {Promise<any>} based on backend implementation.
     */
    /**
     * Replaces current selection with provided data.
     * @param {string[]} selection - will be passed as params to backend NodeService.updateDataPointSelection.
     * @returns {Promise<any>} based on backend implementation.
     */
    replace(selection: string[]): Promise<any>;
    /**
     * Adds callback that will be triggered on data selection change outside the scope of the view.
     * @param {function} callback - that need to be added. Will be triggered by the framework on selection change.
     * @returns {void}
     */
    /**
     * Adds callback that will be triggered on data selection change outside the scope of the view.
     * @param {function} callback - that need to be added. Will be triggered by the framework on selection change.
     * @returns {void}
     */
    addOnSelectionChangeCallback(callback: (any: any) => void): void;
    /**
     * Removes previously added callback.
     * @param {function} callback - that needs to be removed from notifications.
     * @returns {void}
     */
    /**
     * Removes previously added callback.
     * @param {function} callback - that needs to be removed from notifications.
     * @returns {void}
     */
    removeOnSelectionChangeCallback(callback: (any: any) => void): void;
    /**
     * Handles selection subscription on view initialization.
     * @param {function} onSelectionChangeCallback - that is used when the selection changes
     * @param {boolean} currentPublishSelection - whether to publish selection events or not
     * @param {boolean} currentSubscribeToSelection - whether to subscribe to selection events or not
     * @returns {void}
     */
    /**
     * Handles selection subscription on view initialization.
     * @param {function} onSelectionChangeCallback - that is used when the selection changes
     * @param {boolean} currentPublishSelection - whether to publish selection events or not
     * @param {boolean} currentSubscribeToSelection - whether to subscribe to selection events or not
     * @returns {void}
     */
    onInit(onSelectionChangeCallback: (any: any) => void, currentPublishSelection: boolean | undefined, currentSubscribeToSelection: boolean | undefined): void;
    /**
     * Handles publishing selection on selection change.
     * @param {SelectionModes} selectionMode - with which the selection should be updates
     * @param {array} rowKeys - data with which the selection should be updated
     * @returns {void}
     */
    /**
     * Handles publishing selection on selection change.
     * @param {SelectionModes} selectionMode - with which the selection should be updates
     * @param {array} rowKeys - data with which the selection should be updated
     * @returns {void}
     */
    publishOnSelectionChange(selectionMode: SelectionModes, rowKeys: string[]): void;
    /**
     * Handles publishing selection and selection subscription on settings change
     * @param {function} getCurrentSelectionCallback - that returns the current selection of a view
     * @param {function} clearSelectionCallback - that completely clears the selection in the view
     * @param {boolean} newPublishSelection - new values for publishSelection
     * @param {boolean} newSubscribeToSelection - new values for subscribeToSelection
     * @returns {void}
     */
    /**
     * Handles publishing selection and selection subscription on settings change
     * @param {function} getCurrentSelectionCallback - that returns the current selection of a view
     * @param {function} clearSelectionCallback - that completely clears the selection in the view
     * @param {boolean} newPublishSelection - new values for publishSelection
     * @param {boolean} newSubscribeToSelection - new values for subscribeToSelection
     * @returns {void}
     */
    onSettingsChange(getCurrentSelectionCallback: Function, clearSelectionCallback: () => void, newPublishSelection: boolean, newSubscribeToSelection: boolean): void;
}
export { SelectionService };
