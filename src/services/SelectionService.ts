import { IFrameKnimeService } from 'src/services';
import { Notification, NodeServices, SelectionModes, EventTypes } from 'src/types';
import { KnimeService } from './KnimeService';

/**
 * SelectionService provides methods to handle data selection.
 * To use it, the relating Java implementation also needs to use the SelectionService.
 */
export class SelectionService<T = any> {
    private knimeService: IFrameKnimeService | KnimeService<T>;
    private callbackMap: Map<Function, Function>;
    private onSelectionChangeCallback: (any: any) => void;

    /**
     * @param {KnimeService} knimeService - instance should be provided to use notifications.
     */
    constructor(knimeService: IFrameKnimeService | KnimeService<T>) {
        this.knimeService = knimeService;
        this.callbackMap = new Map();
    }

    /**
     * Retrieves the initial data for the client-side UI Extension implementation from the extension configuration
     * if it exists.
     *
     * @returns {Promise} node initial selection provided by the extension configuration.
     */
    async initialSelection() {
        let initialSelection;
        if (this.knimeService.extensionConfig?.initialData) {
            initialSelection = await Promise.resolve(this.knimeService.extensionConfig?.initialSelection);
        }

        if (typeof initialSelection === 'string') {
            initialSelection = JSON.parse(initialSelection);
        }
        return Promise.resolve(initialSelection);
    }

    /**
     * Replaces current selection with provided data.
     * @param {SelectionMode} mode - the selection mode.
     * @param {string[]} selection - will be passed as params to backend NodeService.updateDataPointSelection.
     * @returns {Promise<any>} - based on backend implementation.
     */
    private updateSelection(mode: SelectionModes, selection: string[]): Promise<any> {
        return this.knimeService.callService(
            [NodeServices.CALL_NODE_SELECTION_SERVICE, mode, selection]
        ).then((response) => typeof response === 'string' ? JSON.parse(response) : response);
    }

    /**
     * Adds data to currently selected data set.
     * @param {string[]} selection - will be passed as params to backend NodeService.updateDataPointSelection.
     * @returns {Promise<any>} based on backend implementation.
     */
    add(selection: string[]): Promise<any> {
        return this.updateSelection(SelectionModes.ADD, selection);
    }

    /**
     * Removes data from currently selected data set.
     * @param {string[]} selection - will be passed as params to backend NodeService.updateDataPointSelection.
     * @returns {Promise<any>} based on backend implementation.
     */
    remove(selection: string[]): Promise<any> {
        return this.updateSelection(SelectionModes.REMOVE, selection);
    }

    /**
     * Replaces current selection with provided data.
     * @param {string[]} selection - will be passed as params to backend NodeService.updateDataPointSelection.
     * @returns {Promise<any>} based on backend implementation.
     */
    replace(selection: string[]): Promise<any> {
        return this.updateSelection(SelectionModes.REPLACE, selection);
    }

    /**
     * Adds callback that will be triggered on data selection change outside the scope of the view.
     * @param {function} callback - that need to be added. Will be triggered by the framework on selection change.
     * @returns {void}
     */
    addOnSelectionChangeCallback(callback: (any) => void): void {
        const wrappedCallback = (notification: Notification): void => {
            const { nodeId, selection, mode } = notification.params[0] || {};
            if (this.knimeService.extensionConfig.nodeId === nodeId) {
                callback({ selection, mode });
            }
        };
        this.callbackMap.set(callback, wrappedCallback);
        this.knimeService.addNotificationCallback(EventTypes.SelectionEvent, wrappedCallback);
    }

    /**
     * Removes previously added callback.
     * @param {function} callback - that needs to be removed from notifications.
     * @returns {void}
     */
    removeOnSelectionChangeCallback(callback: (any) => void): void {
        const wrappedCallback = this.callbackMap.get(callback) as (notification: Notification) => void;
        this.knimeService.removeNotificationCallback(EventTypes.SelectionEvent, wrappedCallback);
    }

    /**
     * Handles selection subscription on view initialization.
     * @param onSelectionChangeCallback - that is used when the selection changes
     * @param currentSubscribeToSelection - whether to subscribe to selection events or not
     */
    onInit(onSelectionChangeCallback: (any: any) => void, currentSubscribeToSelection: boolean | undefined) {
        this.onSelectionChangeCallback = onSelectionChangeCallback;
        if (currentSubscribeToSelection) {
            this.addOnSelectionChangeCallback(this.onSelectionChangeCallback);
        }
    }

    /**
     * Handles publishing selection on selection change.
     * @param selectionMode - with which the selection should be updates
     * @param rowKeys - data with which the selection should be updated
     * @param currentPublishSelection - whether to publish the selection or not
     */
    onSelectionChange(selectionMode: SelectionModes, rowKeys: string[], currentPublishSelection: boolean | undefined) {
        if (currentPublishSelection) {
            this[selectionMode.toLowerCase()](rowKeys);
        }
    }

    /**
     * Handles publishing selection and selection subscription on settings change
     * @param getCurrentSelectionCallback - that returns the current selection of a view
     * @param previousPublishSelection - old value for publishSelection
     * @param clearSelectionCallback - that completely clears the selection in the view
     * @param previousSubscribeToSelection - old value for subscribeToSelection
     * @param viewSettings - new values for publishSelection and subscribeToSelection
     */
    onSettingsChange(getCurrentSelectionCallback: Function, previousPublishSelection: boolean | undefined,
        clearSelectionCallback: () => void, previousSubscribeToSelection: boolean | undefined, viewSettings: any) {
        const { publishSelection, subscribeToSelection } = viewSettings;
        if (!previousPublishSelection && publishSelection) {
            const currentSelection = getCurrentSelectionCallback();
            this.replace(currentSelection);
        }

        if (subscribeToSelection !== previousSubscribeToSelection) {
            const mode = subscribeToSelection ? 'addOnSelectionChangeCallback' : 'removeOnSelectionChangeCallback';
            this[mode](this.onSelectionChangeCallback);
            if (subscribeToSelection) {
                this.replace([]);
                clearSelectionCallback();
            }
        }
    }
}
