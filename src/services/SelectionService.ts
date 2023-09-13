import { IFrameKnimeService } from "src/services";
import { Event, NodeServices, SelectionModes, EventTypes } from "src/types";
import { KnimeService } from "./KnimeService";

/**
 * SelectionService provides methods to handle data selection.
 * To use it, the relating Java implementation also needs to use the SelectionService.
 */
export class SelectionService<T = any> {
  private knimeService: IFrameKnimeService | KnimeService<T>;
  private callbackMap: Map<Function, Function>;
  private onSelectionChangeCallback: (any: any) => void;
  private currentPublishSelection: boolean;
  private currentSubscribeToSelection: boolean;
  private initialized = false;

  /**
   * @param {KnimeService} knimeService - instance should be provided to use events.
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
      initialSelection = await Promise.resolve(
        this.knimeService.extensionConfig?.initialSelection,
      );
    }

    if (typeof initialSelection === "string") {
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
  private updateSelection(
    mode: SelectionModes,
    selection: string[],
  ): Promise<any> {
    return this.knimeService
      .callService([NodeServices.CALL_NODE_SELECTION_SERVICE, mode, selection])
      .then((response) =>
        typeof response === "string" ? JSON.parse(response) : response,
      );
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
    const wrappedCallback = (event: Event): void => {
      const { nodeId, selection, mode } = event.payload || {};
      if (this.knimeService.extensionConfig.nodeId === nodeId) {
        callback({ selection, mode });
      }
    };
    this.callbackMap.set(callback, wrappedCallback);
    this.knimeService.addEventCallback(
      EventTypes.SelectionEvent,
      wrappedCallback,
    );
  }

  /**
   * Removes previously added callback.
   * @param {function} callback - that needs to be removed from events.
   * @returns {void}
   */
  removeOnSelectionChangeCallback(callback: (any) => void): void {
    const wrappedCallback = this.callbackMap.get(callback) as (
      event: Event,
    ) => void;
    this.knimeService.removeEventCallback(
      EventTypes.SelectionEvent,
      wrappedCallback,
    );
  }

  /**
   * Handles selection subscription on view initialization.
   * @param {function} onSelectionChangeCallback - that is used when the selection changes
   * @param {boolean} currentPublishSelection - whether to publish selection events or not
   * @param {boolean} currentSubscribeToSelection - whether to subscribe to selection events or not
   * @returns {void}
   */
  onInit(
    onSelectionChangeCallback: (any: any) => void,
    currentPublishSelection: boolean | undefined,
    currentSubscribeToSelection: boolean | undefined,
  ) {
    this.onSelectionChangeCallback = onSelectionChangeCallback;
    this.currentPublishSelection = currentPublishSelection;
    this.currentSubscribeToSelection = currentSubscribeToSelection;
    if (currentSubscribeToSelection) {
      this.addOnSelectionChangeCallback(this.onSelectionChangeCallback);
    }
    this.initialized = true;
  }

  /**
   * Handles publishing selection on selection change.
   * @param {SelectionModes} selectionMode - with which the selection should be updates
   * @param {array} rowKeys - data with which the selection should be updated
   * @returns {Promise<any>}
   */
  publishOnSelectionChange(selectionMode: SelectionModes, rowKeys: string[]) {
    if (this.currentPublishSelection) {
      return this[selectionMode.toLowerCase()](rowKeys);
    }
    return Promise.resolve();
  }

  /**
   * Handles publishing selection and selection subscription on settings change
   * @param {function} getCurrentSelectionCallback - that returns the current selection of a view
   * @param {function} clearSelectionCallback - that completely clears the selection in the view
   * @param {boolean} newPublishSelection - new values for publishSelection
   * @param {boolean} newSubscribeToSelection - new values for subscribeToSelection
   * @returns {void}
   */
  onSettingsChange(
    getCurrentSelectionCallback: Function,
    clearSelectionCallback: () => void,
    newPublishSelection: boolean,
    newSubscribeToSelection: boolean,
  ) {
    if (!this.initialized) {
      return;
    }
    if (!this.currentPublishSelection && newPublishSelection) {
      const currentSelection = getCurrentSelectionCallback();
      this.replace(currentSelection);
    }
    if (newSubscribeToSelection !== this.currentSubscribeToSelection) {
      const mode = newSubscribeToSelection
        ? "addOnSelectionChangeCallback"
        : "removeOnSelectionChangeCallback";
      this[mode](this.onSelectionChangeCallback);
      if (newSubscribeToSelection) {
        this.replace([]);
        clearSelectionCallback();
      }
    }
    this.currentPublishSelection = newPublishSelection;
    this.currentSubscribeToSelection = newSubscribeToSelection;
  }
}
