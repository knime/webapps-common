import { ExtensionConfig, JsonRpcResponse } from 'src/types';
import { KnimeService } from './KnimeService';

/**
 * The main API entry point for component UI extensions. This class consumes the initial information about a UI Extension
 * (via the {@type ExtensionConfig}) and handles all of the communication between the environment (e.g. KNIME
 * Analytics Platform) and the registered services.
 *
 * Other services should be initialized with instance of the class.
 */
export class ComponentKnimeService<T = any> extends KnimeService {
    extensionConfig: ExtensionConfig<T>;

    constructor(extensionConfig: ExtensionConfig = null) {
        super(extensionConfig);
    }

    /**
     * Overrides method of KnimeService to implement how request should be processed for component UI Extensions.
     * @param {JsonRpcRequest} jsonRpcRequest - to be executed by KnimeSerivce callService method.
     * @returns {Promise<JsonRpcResponse>} - promise that resolves with JsonRpcResponse or error message.
     */
    /* eslint-disable class-methods-use-this */
    executeServiceCall(jsonRpcRequest) {
        return new Promise<JsonRpcResponse>((resolve) =>
            resolve(JSON.parse(window.jsonrpc(jsonRpcRequest))),
        );
    }
}
