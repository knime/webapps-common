import { KnimeService } from './KnimeService.js';

/**
 * The main API entry point for component-based UI extensions. This class consumes the initial information about a
 * UI Extension (via the {@type ExtensionConfig}) and handles all of the communication between the environment
 * (e.g. KNIME Analytics Platform) and the registered services.
 *
 * Other services should be initialized with instance of the class.
 */
class ComponentKnimeService extends KnimeService {
    constructor(extensionConfig = null) {
        super(extensionConfig);
    }
    /**
     * Overrides method of KnimeService to implement how request should be processed for component UI Extensions.
     * @param {JsonRpcRequest} jsonRpcRequest - to be executed by KnimeService callService method.
     * @returns {Promise<JsonRpcResponse>} - promise that resolves with JsonRpcResponse or error message.
     */
    /* eslint-disable-next-line class-methods-use-this */
    executeServiceCall(jsonRpcRequest) {
        return new Promise((resolve) => resolve(JSON.parse(window.jsonrpc(jsonRpcRequest))));
    }
}

export { ComponentKnimeService };
