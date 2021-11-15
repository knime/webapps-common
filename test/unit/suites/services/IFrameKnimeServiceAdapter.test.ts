import { UI_EXT_POST_MESSAGE_PREFIX } from 'src/constants';
import { IFrameKnimeServiceAdapter } from 'src/services';
import { extensionConfig } from 'test/mocks';

/* eslint-disable-next-line no-magic-numbers */
const sleep = async (timeout = 15) => {
    await new Promise((resolve) => setTimeout(resolve, timeout));
};

const mockJsonRpcResponse = [1, 1, 2];

const jsonrpc = (requestJSON: string) => {
    const parsedRequest = JSON.parse(requestJSON);

    if (parsedRequest.requestParams === 'getData') {
        return mockJsonRpcResponse;
    }

    return requestJSON;
};

const buildIFrameKnimeServiceAdapter = () => {
    const iFrameKnimeServiceAdapter = new IFrameKnimeServiceAdapter({
        iFrameWindow: window,
        extensionConfig,
    });

    jest.spyOn(iFrameKnimeServiceAdapter, 'checkMessageSource').mockImplementation(() => false);

    return iFrameKnimeServiceAdapter;
};

describe('IFrameKnimeServiceAdapter', () => {
    beforeEach(() => {
        window.jsonrpc = jsonrpc;
    });

    afterEach(() => {
        window.jsonrpc = null;
    });

    describe('initialization', () => {
        it('Creates IFrameKnimeServiceAdapter', () => {
            const iFrameKnimeServiceAdapter = buildIFrameKnimeServiceAdapter();

            expect(iFrameKnimeServiceAdapter).toHaveProperty('extensionConfig');
            expect(iFrameKnimeServiceAdapter).toHaveProperty('iFrameWindow');
            iFrameKnimeServiceAdapter.destroy();
        });

        it('Adds window event listener on creation', async () => {
            const iFrameKnimeServiceAdapter = buildIFrameKnimeServiceAdapter();
            const spy = jest.spyOn(window, 'postMessage');

            window.postMessage(
                {
                    type: `${UI_EXT_POST_MESSAGE_PREFIX}:jsonrpcRequest`,
                    payload: { data: [1, 1, 2] },
                },
                '*',
            );

            await sleep();

            expect(spy).toBeCalledTimes(2);

            iFrameKnimeServiceAdapter.destroy();
        });

        it('Posts init event on :ready type request', async () => {
            const iFrameKnimeServiceAdapter = buildIFrameKnimeServiceAdapter();
            const spy = jest.spyOn(window, 'postMessage');

            window.postMessage(
                {
                    type: `${UI_EXT_POST_MESSAGE_PREFIX}:ready`,
                },
                '*',
            );

            await sleep();

            expect(spy).toBeCalledWith(
                {
                    type: `${UI_EXT_POST_MESSAGE_PREFIX}:init`,
                    payload: extensionConfig,
                },
                '*',
            );

            iFrameKnimeServiceAdapter.destroy();
        });

        it('Calls window.jsonrpc when receives :jsonrpcRequest type event', async () => {
            const iFrameKnimeServiceAdapter = buildIFrameKnimeServiceAdapter();
            const spy = jest.spyOn(window, 'jsonrpc');

            window.postMessage(
                {
                    type: `${UI_EXT_POST_MESSAGE_PREFIX}:jsonrpcRequest`,
                    payload: { requestParams: 'getData' },
                },
                '*',
            );

            await sleep();

            expect(spy).toBeCalledWith(JSON.stringify({ requestParams: 'getData' }));

            iFrameKnimeServiceAdapter.destroy();
        });

        it('Posts response back ', async () => {
            const iFrameKnimeServiceAdapter = buildIFrameKnimeServiceAdapter();
            const spy = jest.spyOn(window, 'postMessage');

            window.postMessage(
                {
                    type: `${UI_EXT_POST_MESSAGE_PREFIX}:jsonrpcRequest`,
                    payload: { requestParams: 'getData' },
                },
                '*',
            );

            await sleep();

            expect(spy).toBeCalledWith(
                {
                    type: `${UI_EXT_POST_MESSAGE_PREFIX}:jsonrpcResponse`,
                    payload: mockJsonRpcResponse,
                },
                '*',
            );

            iFrameKnimeServiceAdapter.destroy();
        });
    });
});
