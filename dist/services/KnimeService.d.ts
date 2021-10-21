import { ExtensionConfig, JSONRpcServices, DataServiceTypes } from "../index-833c032c";
/** Class represents KnimeService  */
declare class KnimeService<T = any> {
    extensionConfig: ExtensionConfig<T>;
    private jsonRpcSupported;
    private registeredGetDataToApply;
    /**
     * @param {Object} extensionConfig required param that used to provide basic configuration for
     * KnimeService. While using Typescript can be called with generic type so it will type initialData
     * filed of ExtensionConfig
     */
    /**
     * @param {Object} extensionConfig required param that used to provide basic configuration for
     * KnimeService. While using Typescript can be called with generic type so it will type initialData
     * filed of ExtensionConfig
     */
    constructor(extensionConfig?: ExtensionConfig);
    /**
     * Generic method to call jsonrpc
     * @param {string} method jsonrpc service name
     * @param {string} serviceType exact method of jsonrpc service
     * @param {string} request request payload
     * @returns {Promise} rejected or resolved depending on backend response
     */
    /**
     * Generic method to call jsonrpc
     * @param {string} method jsonrpc service name
     * @param {string} serviceType exact method of jsonrpc service
     * @param {string} request request payload
     * @returns {Promise} rejected or resolved depending on backend response
     */
    callService(method: JSONRpcServices, serviceType: DataServiceTypes, request: string): Promise<any>;
    registerGetDataToApply(callback: () => any): void;
    getDataToApply(): Promise<any>;
}
export { KnimeService };
