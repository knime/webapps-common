import { IFrameKnimeService } from "../index";
import { KnimeService } from "./KnimeService";
/**
 * A utility class to interact with Dialog settings implemented by a UI Extension node.
 */
declare class DialogService<T = any> {
    private knimeService;
    /**
     * @param {KnimeService<T> | IFrameKnimeService} knimeService - knimeService instance which is used to communicate
     *      with the framework.
     */
    /**
     * @param {KnimeService<T> | IFrameKnimeService} knimeService - knimeService instance which is used to communicate
     *      with the framework.
     */
    constructor(knimeService: IFrameKnimeService | KnimeService<T>);
    /**
     * @returns {FlowVariableSettings | null} - maps of model and view flow variables settings.
     */
    /**
     * @returns {FlowVariableSettings | null} - maps of model and view flow variables settings.
     */
    getFlowVariableSettings(): Promise<any>;
}
export { DialogService };
