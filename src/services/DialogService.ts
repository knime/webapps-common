import { UIExtensionService } from "src/knime-svc/types";
import { getBaseService } from "./utils";

/**
 * A utility class to interact with Dialog settings implemented by a UI Extension node.
 */
export class DialogService<
  T extends {
    hasNodeView: boolean;
    writeProtected: boolean;
  } = any,
> {
  private knimeService: UIExtensionService<T>;

  /**
   * @param {UIExtensionService<T>} baseService - knimeService instance which is used to communicate
   *      with the framework.
   */
  constructor(baseService?: UIExtensionService<T>) {
    this.knimeService = getBaseService(baseService);
  }

  /**
   * @returns {boolean} - true, if the node this dialog belongs to also has a node view, otherwise false
   */
  hasNodeView() {
    return this.knimeService.getConfig()?.hasNodeView;
  }

  /**
   * @returns {boolean} - true, if the dialog settings can't be saved (e.g. meaning that the OK-button is disabled);
   *         otherwise false
   */
  isWriteProtected() {
    return this.knimeService.getConfig()?.writeProtected;
  }
}
