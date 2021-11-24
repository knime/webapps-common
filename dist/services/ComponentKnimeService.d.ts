import { ExtensionConfig } from "../index-af6571f7";
import { KnimeService } from "./KnimeService";
/**
 * The main API entry point for component-based UI extensions. This class consumes the initial information about a
 * UI Extension (via the {@type ExtensionConfig}) and handles all of the communication between the environment
 * (e.g. KNIME Analytics Platform) and the registered services.
 *
 * Other services should be initialized with instance of the class.
 */
declare class ComponentKnimeService extends KnimeService {
    constructor(extensionConfig?: ExtensionConfig);
    /**
     * Overrides method of KnimeService to implement how request should be processed for component UI Extensions.
     * @param {JsonRpcRequest} jsonRpcRequest - to be executed by KnimeService callService method.
     * @returns {Promise<string>} - promise that resolves with JsonRpcResponse string or error message.
     */
    /**
     * Overrides method of KnimeService to implement how request should be processed for component UI Extensions.
     * @param {JsonRpcRequest} jsonRpcRequest - to be executed by KnimeService callService method.
     * @returns {Promise<string>} - promise that resolves with JsonRpcResponse string or error message.
     */
    /* eslint-disable-next-line class-methods-use-this */
    protected executeServiceCall(jsonRpcRequest: any): Promise<string>;
}
export { ComponentKnimeService };
