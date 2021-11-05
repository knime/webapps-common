import { KnimeService } from './KnimeService.js';

class ComponentKnimeService extends KnimeService {
    constructor(extensionConfig = null /* windowReference */) {
        super(extensionConfig);
    }
    /* eslint-disable class-methods-use-this */
    executeServiceCall(jsonRpcRequest) {
        return new Promise((resolve) => resolve(JSON.parse(window.jsonrpc(jsonRpcRequest))));
    }
}

export { ComponentKnimeService };
