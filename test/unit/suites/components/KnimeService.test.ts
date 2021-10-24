import { KnimeService } from 'src';
import { JSONRpcServices, ViewDataServiceMethods } from 'src/types';
import { extensionConfig } from 'test/mocks/extensionConfig';

const jsonrpc = (requestJSON: string) => {
    const request = JSON.parse(requestJSON);

    if (request.method === JSONRpcServices.CALL_NODE_VIEW_DATA_SERVICE) {
        return JSON.stringify({ result: JSON.stringify({}) });
    }

    const error: any = new Error('Unsupported params');

    throw error;
};

describe('KnimeService', () => {
    it('Creates KnimeService', () => {
        const knime = new KnimeService(extensionConfig);

        expect(knime).toHaveProperty('extensionConfig');

        expect(knime.extensionConfig).toEqual(extensionConfig);
    });

    it('Throws error if no extensionConfig provided and jsonrpc unsupported', () => {
        const knime = new KnimeService();
        try {
            knime.callService(
                JSONRpcServices.CALL_NODE_VIEW_DATA_SERVICE,
                ViewDataServiceMethods.INITIAL_DATA,
                ''
            );
        } catch (e) {
            expect(e).toEqual(new Error(`Current environment doesn't support window.jsonrpc()`));
        }
    });

    it('Calls data service', () => {
        window.jsonrpc = jsonrpc;

        const knime = new KnimeService();

        knime.callService(
            JSONRpcServices.CALL_NODE_VIEW_DATA_SERVICE,
            ViewDataServiceMethods.INITIAL_DATA,
            ''
        );
    });

    it('Throws error if called with unsupported rpc service', () => {
        window.jsonrpc = jsonrpc;

        const knime = new KnimeService();

        try {
            knime.callService(
                'Unsupported.Service' as JSONRpcServices,
                ViewDataServiceMethods.INITIAL_DATA,
                ''
            );
        } catch (e) {
            expect(e).toEqual(new Error('Unsupported params'));
        }
    });
});

describe('KnimeService notifications', () => {
    beforeEach(() => {
        window.jsonrpcNotification = null;
    });

    it('Adds notification callback with addNotificationCallback', () => {
        const knime = new KnimeService();

        const callback = () => {};

        knime.addNotificationCallback('SelectionEvent', callback);

        expect(knime.notificationCallbacksMap.get('SelectionEvent')[0]).toEqual(callback);
    });

    it('Calls onJsonrpcNotification if callbacks added', () => {
        const knime = new KnimeService();

        const callback = jest.fn(() => {});

        knime.addNotificationCallback('SelectionEvent', callback);

        const notification = {
            jsonrpc: '2.0',
            method: 'SelectionEvent',
            params: [
                {
                    projectId: '...',
                    workflowId: '...',
                    nodeId: '...',
                    keys: ['Row01', 'Row02'],
                    mode: 'ADD'
                }
            ]
        };

        window.jsonrpcNotification(notification);

        expect(callback).toBeCalled();
    });

    it('Removes notification callback with removeNotificationCallback', () => {
        const knime = new KnimeService();

        const callback = () => {};

        knime.addNotificationCallback('SelectionEvent', callback);
        knime.removeNotificationCallback('SelectionEvent', callback);

        expect(knime.notificationCallbacksMap.get('SelectionEvent').length === 0);
    });

    it('Resets notification callbacks by type with resetNotificationCallbacksByType', () => {
        const knime = new KnimeService();

        knime.addNotificationCallback('SelectionEvent', () => {});
        knime.addNotificationCallback('CustomEvent', () => {});
        knime.resetNotificationCallbacksByType('SelectionEvent');

        expect(knime.notificationCallbacksMap.get('SelectionEvent').length === 0);
        expect(knime.notificationCallbacksMap.get('CustomEvent').length === 1);
    });

    it('Resets all notification callbacks with resetNotificationCallbacks', () => {
        const knime = new KnimeService();

        knime.addNotificationCallback('SelectionEvent', () => {});
        knime.addNotificationCallback('CustomEvent', () => {});
        knime.resetNotificationCallbacksByType('SelectionEvent');

        expect(knime.notificationCallbacksMap.get('SelectionEvent').length === 0);
        expect(knime.notificationCallbacksMap.get('CustomEvent').length === 0);
    });
});
