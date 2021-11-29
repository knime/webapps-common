import { UI_EXT_POST_MESSAGE_PREFIX } from 'src/constants';
import { IFrameKnimeServiceAdapter } from 'src/services';
import { JsonRpcRequest } from 'src/types';
import { extensionConfig } from 'test/mocks';

/* eslint-disable-next-line no-magic-numbers */
const sleep = async (timeout = 15) => {
    await new Promise((resolve) => setTimeout(resolve, timeout));
};

const mockJsonRpcResponse = [1, 1, 2];

const mockCallServiceImplementation = (requestJSON: JsonRpcRequest) => {
    if (requestJSON.params === 'getData') {
        return mockJsonRpcResponse;
    }

    return requestJSON;
};

const buildIFrameKnimeServiceAdapter = () => {
    let callServiceSpy = jest.fn().mockImplementation(mockCallServiceImplementation);
    let childSpy = jest.fn();
    let mockChildFrame = {
        postMessage: childSpy
    } as unknown as Window;
    const iFrameKnimeServiceAdapter = new IFrameKnimeServiceAdapter(extensionConfig, callServiceSpy, mockChildFrame);

    jest.spyOn(iFrameKnimeServiceAdapter as any, 'checkMessageSource').mockImplementation(() => false);

    return { iFrameKnimeServiceAdapter, childSpy, callServiceSpy };
};

describe('IFrameKnimeServiceAdapter', () => {
    describe('initialization', () => {
        it('Creates IFrameKnimeServiceAdapter', () => {
            const { iFrameKnimeServiceAdapter } = buildIFrameKnimeServiceAdapter();

            expect(iFrameKnimeServiceAdapter).toHaveProperty('extensionConfig');
            expect(iFrameKnimeServiceAdapter.extensionConfig).toEqual(extensionConfig);
            expect(iFrameKnimeServiceAdapter).toHaveProperty('iFrameWindow');
            iFrameKnimeServiceAdapter.destroy();
        });

        it('Adds window event listener on creation', async () => {
            const { iFrameKnimeServiceAdapter, childSpy, callServiceSpy } = buildIFrameKnimeServiceAdapter();

            window.postMessage(
                {
                    type: `${UI_EXT_POST_MESSAGE_PREFIX}:jsonrpcRequest`,
                    payload: { data: [1, 1, 2] }
                },
                '*'
            );

            await sleep();

            expect(childSpy).toHaveBeenCalled();
            expect(callServiceSpy).toHaveBeenCalled();

            iFrameKnimeServiceAdapter.destroy();
        });

        it('Posts init event on :ready type request', async () => {
            const { iFrameKnimeServiceAdapter, childSpy } = buildIFrameKnimeServiceAdapter();

            window.postMessage(
                {
                    type: `${UI_EXT_POST_MESSAGE_PREFIX}:ready`
                },
                '*'
            );

            await sleep();

            expect(childSpy).toBeCalledWith(
                {
                    type: `${UI_EXT_POST_MESSAGE_PREFIX}:init`,
                    payload: extensionConfig
                },
                '*'
            );

            iFrameKnimeServiceAdapter.destroy();
        });

        it('Calls window.jsonrpc when receives :jsonrpcRequest type event', async () => {
            const { iFrameKnimeServiceAdapter, childSpy, callServiceSpy } = buildIFrameKnimeServiceAdapter();

            window.postMessage(
                {
                    type: `${UI_EXT_POST_MESSAGE_PREFIX}:jsonrpcRequest`,
                    payload: { params: 'getData' }
                },
                '*'
            );

            await sleep();

            expect(childSpy).toBeCalledWith({ payload: [1, 1, 2], type: 'knimeUIExtension:jsonrpcResponse' }, '*');
            expect(callServiceSpy).toHaveBeenCalled();

            iFrameKnimeServiceAdapter.destroy();
        });

        it('Posts response back', async () => {
            const { iFrameKnimeServiceAdapter, childSpy, callServiceSpy } = buildIFrameKnimeServiceAdapter();

            window.postMessage(
                {
                    type: `${UI_EXT_POST_MESSAGE_PREFIX}:jsonrpcRequest`,
                    payload: { params: 'getData' }
                },
                '*'
            );

            await sleep();

            expect(childSpy).toBeCalledWith(
                {
                    type: `${UI_EXT_POST_MESSAGE_PREFIX}:jsonrpcResponse`,
                    payload: mockJsonRpcResponse
                },
                '*'
            );
            expect(callServiceSpy).toHaveBeenCalled();

            iFrameKnimeServiceAdapter.destroy();
        });
    });
});
