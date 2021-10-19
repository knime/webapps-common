import { KnimeService } from "../index";
declare class SelectionService {
    private knimeService;
    constructor(knimeService: KnimeService);
    private callSelectionService;
    add(keys: (string | number)[]): Promise<any>;
    remove(keys: (string | number)[]): Promise<any>;
    replace(keys: (string | number)[]): Promise<any>;
    /**
     * @param {function} callback - will be called by backend when data selection happens
     * @param {Object} jsonRpcResponse - jsonrpc object signature callback will be called with
     * @param {string} jsonRpcResponse.jsonrpc - version of jsonrpc
     * @param {string} jsonRpcResponse.method - selection event name that triggered on backend
     * @param {Object} jsonRpcResponse.params - parameters method called with
     * @returns {any}
     */
    /**
     * @param {function} callback - will be called by backend when data selection happens
     * @param {Object} jsonRpcResponse - jsonrpc object signature callback will be called with
     * @param {string} jsonRpcResponse.jsonrpc - version of jsonrpc
     * @param {string} jsonRpcResponse.method - selection event name that triggered on backend
     * @param {Object} jsonRpcResponse.params - parameters method called with
     * @returns {any}
     */
    // eslint-disable-next-line class-methods-use-this
    registerOnSelectionChangeCallback(callback: () => void): void;
}
export { SelectionService };
