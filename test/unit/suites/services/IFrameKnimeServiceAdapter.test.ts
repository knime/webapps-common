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
    let result : any = requestJSON;
    if (requestJSON.params === 'getData') {
        result = JSON.stringify(mockJsonRpcResponse);
    }
    
    return Promise.resolve({ result });
};

const buildIFrameKnimeServiceAdapter = () => {
    const callServiceSpy = jest.fn().mockImplementation(mockCallServiceImplementation);
    const childSpy = jest.fn();
    const mockChildFrame = {
        postMessage: childSpy
    } as unknown as Window;
    const iFrameKnimeServiceAdapter = new IFrameKnimeServiceAdapter(extensionConfig, callServiceSpy);
    iFrameKnimeServiceAdapter.setIFrameWindow(mockChildFrame);

    jest.spyOn(iFrameKnimeServiceAdapter as any, 'checkMessageSource').mockImplementation(() => false);

    return { iFrameKnimeServiceAdapter, childSpy, callServiceSpy };
};

describe('IFrameKnimeServiceAdapter', () => {
    describe('initialization', () => {
        it('Creates IFrameKnimeServiceAdapter', () => {
            const { iFrameKnimeServiceAdapter } = buildIFrameKnimeServiceAdapter();

            expect(iFrameKnimeServiceAdapter.extensionConfig).toEqual(extensionConfig);
            expect(iFrameKnimeServiceAdapter).toHaveProperty('iFrameWindow');
            iFrameKnimeServiceAdapter.destroy();
        });

        it('Destroys IFrameKnimeServiceAdapter', () => {
            const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
            const { iFrameKnimeServiceAdapter } = buildIFrameKnimeServiceAdapter();

            expect(iFrameKnimeServiceAdapter).toHaveProperty('iFrameWindow');
            iFrameKnimeServiceAdapter.destroy();
            expect(iFrameKnimeServiceAdapter).toHaveProperty('iFrameWindow', null);
            expect(removeEventListenerSpy).toHaveBeenCalledWith('message',
                (iFrameKnimeServiceAdapter as any).boundOnMessageFromIFrame);
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

        it('Calls service when receiving :jsonrpcRequest type events', async () => {
            const { iFrameKnimeServiceAdapter, childSpy, callServiceSpy } = buildIFrameKnimeServiceAdapter();
            const requestId = 1;
            const payload = { params: 'getData', id: requestId };
            window.postMessage(
                {
                    type: `${UI_EXT_POST_MESSAGE_PREFIX}:jsonrpcRequest`,
                    payload
                },
                '*'
            );

            await sleep();

            expect(childSpy).toBeCalledWith({
                payload: {
                    response: JSON.stringify([1, 1, 2]),
                    requestId
                },
                type: 'knimeUIExtension:jsonrpcResponse'
            }, '*');
            expect(callServiceSpy).toHaveBeenCalledWith(payload);

            iFrameKnimeServiceAdapter.destroy();
        });
    });
});
