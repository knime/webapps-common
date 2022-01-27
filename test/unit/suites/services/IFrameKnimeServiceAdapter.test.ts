import { UI_EXT_POST_MESSAGE_PREFIX } from 'src/constants';
import { IFrameKnimeServiceAdapter } from 'src/services';
import { NodeServiceMethods } from 'src/types';
import { extensionConfig } from 'test/mocks';

/* eslint-disable-next-line no-magic-numbers */
const sleep = async (timeout = 15) => {
    await new Promise((resolve) => setTimeout(resolve, timeout));
};

const buildIFrameKnimeServiceAdapter = () => {
    const callServiceSpy = jest.fn().mockImplementation(() => Promise.resolve({ result: JSON.stringify([1, 1, 2]) }));
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
                (iFrameKnimeServiceAdapter as any).boundOnMessageFromIFrame); // eslint-disable-line no-extra-parens
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

        it('Posts serviceNotification event when onServiceNotification is triggered', async () => {
            const { iFrameKnimeServiceAdapter, childSpy } = buildIFrameKnimeServiceAdapter();

            const notification = {
                payload: {
                    requestId: 1,
                    method: ''
                },
                type: `${UI_EXT_POST_MESSAGE_PREFIX}:serviceNotification`
            };
            const expectedMessage = {
                type: `${UI_EXT_POST_MESSAGE_PREFIX}:serviceNotification`,
                payload: notification
            };

            // test serialized notification (server-side origin)
            iFrameKnimeServiceAdapter.onServiceNotification(JSON.stringify(notification));
            await sleep();
            expect(childSpy).toBeCalledWith(expectedMessage, '*');

            jest.clearAllMocks();

            // test object notification (client-side origin)
            iFrameKnimeServiceAdapter.onServiceNotification(notification);
            await sleep();
            expect(childSpy).toBeCalledWith(expectedMessage, '*');

            iFrameKnimeServiceAdapter.destroy();
        });

        it('Calls service when receiving :callService type events', async () => {
            const { iFrameKnimeServiceAdapter, childSpy, callServiceSpy } = buildIFrameKnimeServiceAdapter();
            const serviceParams = [NodeServiceMethods.CALL_NODE_DATA_SERVICE, 'getData', null];
            const requestId = 1;
            const payload = { serviceParams, requestId };
            window.postMessage(
                {
                    type: `${UI_EXT_POST_MESSAGE_PREFIX}:callService`,
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
                type: 'knimeUIExtension:callServiceResponse'
            }, '*');
            expect(callServiceSpy).toHaveBeenCalledWith(...serviceParams);

            iFrameKnimeServiceAdapter.destroy();
        });
    });
});
