import {
    ExtensionConfig,
    JSONRpcServices,
    ViewDataServiceMethods,
    SelectionServiceMethods,
    Notification,
} from 'src/types';
import { createJsonRpcRequest } from 'src/utils';

// TODO: NXTEXT-80 add JSDoc comments
export class KnimeService<T = any> {
    extensionConfig: ExtensionConfig<T>;

    private jsonRpcSupported: boolean;

    notificationCallbacksMap: Map<string, ((notification: Notification) => void)[]>;

    constructor(extensionConfig: ExtensionConfig = null) {
        this.extensionConfig = extensionConfig;

        // should use Map?
        this.notificationCallbacksMap = new Map();

        this.jsonRpcSupported = window.jsonrpc && typeof window.jsonrpc === 'function';
    }

    // TODO: NXTEXT-77 add request types w/ DataService type/interface
    callService(
        method: JSONRpcServices,
        serviceMethod: ViewDataServiceMethods | SelectionServiceMethods,
        request: string | string[],
    ) {
        if (!this.jsonRpcSupported) {
            throw new Error(`Current environment doesn't support window.jsonrpc()`);
        }

        const jsonRpcRequest = createJsonRpcRequest(method, [
            this.extensionConfig?.projectId,
            this.extensionConfig?.workflowId,
            this.extensionConfig?.nodeId,
            serviceMethod,
            request || '',
        ]);

        const requestResult = JSON.parse(window.jsonrpc(jsonRpcRequest));

        const { result, error = {} } = requestResult;

        if (result) {
            return Promise.resolve(JSON.parse(result));
        }

        return Promise.reject(
            new Error(
                `Error code: ${error.code || 'UNKNOWN'}. Message: ${
                    error.message || 'not provided'
                }`,
            ),
        );
    }

    onJsonrpcNotification(notification: Notification) {
        const callbacks = this.notificationCallbacksMap.get(notification.method) || [];

        callbacks.forEach((cb) => {
            cb(notification);
        });
    }

    addNotificationCallback(
        notificationType: string,
        callback: (notification: Notification) => void,
    ) {
        if (!window.jsonrpcNotification) {
            window.jsonrpcNotification = this.onJsonrpcNotification.bind(this);
        }

        this.notificationCallbacksMap.set(notificationType, [
            ...(this.notificationCallbacksMap.get(notificationType) || []),
            callback,
        ]);
    }

    removeNotificationCallback(
        notificationType: string,
        callback: (notification: Notification) => void,
    ) {
        this.notificationCallbacksMap.set(
            notificationType,
            (this.notificationCallbacksMap.get(notificationType) || []).filter(
                (cb) => cb !== callback,
            ),
        );
    }

    resetNotificationCallbacksByType(notificationType: string) {
        this.notificationCallbacksMap.set(notificationType, []);
    }

    resetNotificationCallbacks() {
        this.notificationCallbacksMap.clear();
    }
}
