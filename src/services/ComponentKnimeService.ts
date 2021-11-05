import { ExtensionConfig, JsonRpcResponse } from 'src/types';
import { KnimeService } from './KnimeService';

export class ComponentKnimeService<T = any> extends KnimeService {
    extensionConfig: ExtensionConfig<T>;

    constructor(extensionConfig: ExtensionConfig = null /* windowReference */) {
        super(extensionConfig);
    }

    /* eslint-disable class-methods-use-this */
    executeServiceCall(jsonRpcRequest) {
        return new Promise<JsonRpcResponse>((resolve) => resolve(JSON.parse(window.jsonrpc(jsonRpcRequest))));
    }
}
