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
     * @param onSelectionChangeCallback - that is used when the selection changes
     * @param currentSubscribeToSelection - whether to subscribe to selection events or not
     */
    /**
     * Handles selection subscription on view initialization.
     * @param onSelectionChangeCallback - that is used when the selection changes
     * @param currentSubscribeToSelection - whether to subscribe to selection events or not
     */
    onInit(onSelectionChangeCallback: (any: any) => void, currentSubscribeToSelection: boolean | undefined): void;
    /**
     * Handles publishing selection on selection change.
     * @param selectionMode - with which the selection should be updates
     * @param rowKeys - data with which the selection should be updated
     * @param currentPublishSelection - whether to publish the selection or not
     */
    /**
     * Handles publishing selection on selection change.
     * @param selectionMode - with which the selection should be updates
     * @param rowKeys - data with which the selection should be updated
     * @param currentPublishSelection - whether to publish the selection or not
     */
    onSelectionChange(selectionMode: SelectionModes, rowKeys: string[], currentPublishSelection: boolean | undefined): void;
    /**
     * Handles publishing selection and selection subscription on settings change
     * @param getCurrentSelectionCallback - that returns the current selection of a view
     * @param previousPublishSelection - old value for publishSelection
     * @param clearSelectionCallback - that completely clears the selection in the view
     * @param previousSubscribeToSelection - old value for subscribeToSelection
     * @param viewSettings - new values for publishSelection and subscribeToSelection
     */
    /**
     * Handles publishing selection and selection subscription on settings change
     * @param getCurrentSelectionCallback - that returns the current selection of a view
     * @param previousPublishSelection - old value for publishSelection
     * @param clearSelectionCallback - that completely clears the selection in the view
     * @param previousSubscribeToSelection - old value for subscribeToSelection
     * @param viewSettings - new values for publishSelection and subscribeToSelection
     */
    onSettingsChange(getCurrentSelectionCallback: Function, previousPublishSelection: boolean | undefined, clearSelectionCallback: () => void, previousSubscribeToSelection: boolean | undefined, viewSettings: any): void;
}
export { SelectionService };
