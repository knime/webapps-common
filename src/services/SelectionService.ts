import { KnimeService } from 'src';
import { JSONRpcServices, SelectionServiceMethods, Notification } from 'src/types';

export class SelectionService {
    private knimeService: KnimeService;

    constructor(knimeService: KnimeService) {
        this.knimeService = knimeService;
    }

    private callSelectionService(serviceType: SelectionServiceMethods, request) {
        return this.knimeService.callService(
            JSONRpcServices.CALL_NODE_SELECT_DATA_POINTS,
            serviceType,
            request,
        );
    }

    add(keys: (string | number)[]) {
        return this.callSelectionService(SelectionServiceMethods.ADD, keys);
    }

    remove(keys: (string | number)[]) {
        return this.callSelectionService(SelectionServiceMethods.REMOVE, keys);
    }

    replace(keys: (string | number)[]) {
        return this.callSelectionService(SelectionServiceMethods.REPLACE, keys);
    }

    /**
     * @param {function} callback - will be called by backend when data selection happens
     * @param {Object} jsonRpcResponse - jsonrpc object signature callback will be called with
     * @param {string} jsonRpcResponse.jsonrpc - version of jsonrpc
     * @param {string} jsonRpcResponse.method - selection event name that triggered on backend
     * @param {Object} jsonRpcResponse.params - parameters method called with
     * @returns {any}
     */
    // eslint-disable-next-line class-methods-use-this
    addOnSelectionChangeCallback(callback: (notification: Notification) => void) {
        this.knimeService.addNotificationCallback('SelectionEvent', callback);
    }

    removeOnSelectionChangeCallback(callback: (notification: Notification) => void) {
        this.knimeService.removeNotificationCallback('SelectionEvent', callback);
    }
}
