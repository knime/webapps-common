import { ExtensionConfig, JsonRpcResponse } from "../index-efc413bb";
import { KnimeService } from "./KnimeService";
declare class ComponentKnimeService<T = any> extends KnimeService {
    extensionConfig: ExtensionConfig<T>;
    constructor(extensionConfig?: ExtensionConfig);
    /* eslint-disable class-methods-use-this */
    executeServiceCall(jsonRpcRequest: any): Promise<JsonRpcResponse>;
}
export { ComponentKnimeService };
