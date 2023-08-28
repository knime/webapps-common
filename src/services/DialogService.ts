import { IFrameKnimeService } from "src";
import { KnimeService } from "./KnimeService";

/**
 * A utility class to interact with Dialog settings implemented by a UI Extension node.
 */
export class DialogService<T = any> {
  private knimeService: IFrameKnimeService | KnimeService<T>;

  /**
   * @param {KnimeService<T> | IFrameKnimeService} knimeService - knimeService instance which is used to communicate
   *      with the framework.
   */
  constructor(knimeService: IFrameKnimeService | KnimeService<T>) {
    this.knimeService = knimeService;
  }

  /**
   * @returns {boolean} - true, if the node this dialog belongs to also has a node view, otherwise false
   */
  hasNodeView() {
    return this.knimeService.extensionConfig?.hasNodeView;
  }
}
