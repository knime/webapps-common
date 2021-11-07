import { UI_EXT_POST_MESSAGE_PREFIX } from 'src/constants';
import { IFrameKnimeService, JSONDataService } from 'src/services';
import { DataServiceTypes, NodeServiceMethods } from 'src/types';
import { extensionConfig } from 'test/mocks';

/* eslint-disable-next-line no-magic-numbers */
const sleep = async (timeout = 15) => {
    await new Promise((resolve) => setTimeout(resolve, timeout));
};

(window as any).testId = 2;

const jsonrpc = (requestJSON: string) => {
    const request = JSON.parse(requestJSON);

    if (request.method === NodeServiceMethods.CALL_NODE_DATA_SERVICE) {
        return JSON.stringify({
            result: JSON.stringify({ result: { dataArray: [1, 1, 2] } }),
            id: (window as any).testId++,
        });
    }

    const error: any = new Error('Unsupported params');

    throw error;
};

const onMessageFromIFrame = (event) => {
    const { data } = event;

    /* eslint indent: [2, 4, {"SwitchCase": 1}] */
    switch (data.type) {
        case `${UI_EXT_POST_MESSAGE_PREFIX}:ready`:
            window.postMessage(
                {
                    type: `${UI_EXT_POST_MESSAGE_PREFIX}:init`,
                    payload: extensionConfig,
                },
                '*',
            );
            break;
        case `${UI_EXT_POST_MESSAGE_PREFIX}:jsonrpcRequest`:
            {
                const { request } = event.data;
                const response = window.jsonrpc(request);

                window.postMessage(
                    {
                        type: `${UI_EXT_POST_MESSAGE_PREFIX}:jsonrpcResponse`,
                        payload: response,
                    },
                    '*',
                );
            }
            break;

        default:
            break;
    }
};

describe('IFrameKnimeService', () => {
    beforeEach(() => {
        window.addEventListener('message', onMessageFromIFrame);
    });

    afterEach(() => {
        window.removeEventListener('message', onMessageFromIFrame);
    });

    xdescribe('initialization', () => {
        it('Creates IFrameKnimeService', async () => {
            await sleep();
            (window as any).testId = 2;

            const knimeService = new IFrameKnimeService();
            await sleep();
            expect(knimeService).toHaveProperty('extensionConfig');

            expect(knimeService.extensionConfig).toEqual(extensionConfig);

            await sleep();
        });
    });

    describe('working with JSONDataService', () => {
        beforeEach(() => {
            window.addEventListener('message', onMessageFromIFrame);
        });

        afterEach(() => {
            window.removeEventListener('message', onMessageFromIFrame);
        });

        it('Gets data', async () => {
            await sleep();
            (window as any).testId = 2;
            window.jsonrpc = jsonrpc;

            const knimeService = new IFrameKnimeService();
            await sleep();
            const knimeJSONDataService = new JSONDataService(knimeService);
            await sleep();

            expect(knimeJSONDataService.data()).resolves.toEqual({
                dataArray: [1, 1, 2],
            });

            await sleep();
        });
    });
});

