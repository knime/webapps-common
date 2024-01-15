import { SelectionModes, EventTypes } from "src/types";
import type {
  CustomUIExtensionService,
  Identifiers,
  UIExtensionAPILayer,
} from "src/serviceTypes";
import { AbstractService } from "./AbstractService";

export interface SelectionEventCallbackParams {
  mode: SelectionModes;
  selection?: string[];
}

interface SelectionEvent {
  projectId: string;
  workflowId: string;
  nodeId: string;
  mode: SelectionModes;
  selection?: string[];
  error: string | null;
}

type SelectionServiceExtensionConfig = Identifiers & {
  initialData?: unknown;
  initialSelection?: unknown;
};

type SelectionServiceAPILayer = Pick<
  UIExtensionAPILayer,
  "updateDataPointSelection"
> & { getConfig: () => SelectionServiceExtensionConfig };

/**
 * SelectionService provides methods to handle data selection.
 * To use it, the relating Java implementation also needs to use the SelectionService.
 */
export class SelectionService extends AbstractService<SelectionServiceAPILayer> {
  private removeCallbacksMap: Map<Function, () => void>;

  constructor(baseService: CustomUIExtensionService<SelectionServiceAPILayer>) {
    super(baseService);
    this.removeCallbacksMap = new Map();
  }

  /**
   * Retrieves the initial data for the client-side UI Extension implementation from the extension configuration
   * if it exists.
   *
   * @returns {Promise} node initial selection provided by the extension configuration.
   */
  async initialSelection() {
    let initialSelection;
    if (this.baseService.getConfig().initialData) {
      initialSelection = await Promise.resolve(
        this.baseService.getConfig()?.initialSelection,
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
    const config = this.baseService.getConfig();
    return this.baseService
      .updateDataPointSelection({
        projectId: config.projectId,
        workflowId: config.workflowId,
        nodeId: config.nodeId,
        mode,
        selection,
      })
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
   */
  addOnSelectionChangeCallback(
    callback: (event: SelectionEventCallbackParams) => void,
  ): void {
    const wrappedCallback = (event?: SelectionEvent): void => {
      const { nodeId, selection, mode } = event || {};
      if (this.baseService.getConfig().nodeId === nodeId) {
        callback({ selection, mode });
      }
    };
    const removeCallback = this.baseService.addPushEventListener(
      EventTypes.SelectionEvent,
      wrappedCallback,
    );
    this.removeCallbacksMap.set(callback, removeCallback);
  }

  /**
   * Removes previously added callback.
   * @param {function} callback - that needs to be removed from events.
   * @returns {void}
   */
  removeOnSelectionChangeCallback(
    callback: (event: SelectionEventCallbackParams) => void,
  ): void {
    this.removeCallbacksMap.get(callback)();
    this.removeCallbacksMap.delete(callback);
  }

  /**
   * Handles publishing selection on selection change.
   * @param {SelectionModes} selectionMode - with which the selection should be updates
   * @param {array} rowKeys - data with which the selection should be updated
   * @returns {Promise<any>}
   */
  publishOnSelectionChange(selectionMode: SelectionModes, rowKeys: string[]) {
    return this[selectionMode.toLowerCase()](rowKeys);
  }
}
