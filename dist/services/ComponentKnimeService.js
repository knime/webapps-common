import { KnimeService } from './KnimeService.js';

class ComponentKnimeService extends KnimeService {
    constructor(extensionConfig = null) {
        super(extensionConfig);
    }
    /* eslint-disable class-methods-use-this */
    executeServiceCall(jsonRpcRequest) {
        return new Promise((resolve) => resolve(JSON.parse(window.jsonrpc(jsonRpcRequest))));
    }
}

export { ComponentKnimeService };
