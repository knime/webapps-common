import { AbstractService } from "./AbstractService";

type DialogServiceExtensionConfig = {
  hasNodeView: boolean;
  writeProtected?: boolean;
};

type DialogServiceAPILayer = { getConfig: () => DialogServiceExtensionConfig };

/**
 * A utility class to interact with Dialog settings implemented by a UI Extension node.
 */
export class DialogService extends AbstractService<DialogServiceAPILayer> {
  /**
   * @returns {boolean} - true, if the node this dialog belongs to also has a node view, otherwise false
   */
  hasNodeView() {
    return this.baseService.getConfig().hasNodeView;
  }

  /**
   * @returns {boolean} - true, if the dialog settings can't be saved (e.g. meaning that the OK-button is disabled);
   *         otherwise false
   */
  isWriteProtected() {
    return this.baseService.getConfig().writeProtected;
  }
}
