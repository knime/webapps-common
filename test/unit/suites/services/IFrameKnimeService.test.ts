import { UI_EXT_POST_MESSAGE_PREFIX, UI_EXT_POST_MESSAGE_TIMEOUT } from 'src/constants';
import { IFrameKnimeService, JSONDataService } from 'src/services';
import { JsonRpcRequest, NodeServiceMethods } from 'src/types';
import { extensionConfig } from 'test/mocks';

jest.setTimeout(UI_EXT_POST_MESSAGE_TIMEOUT + 200);

/* eslint-disable-next-line no-magic-numbers */
const sleep = async (timeout = 15) => {
    await new Promise((resolve) => setTimeout(resolve, timeout));
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let testId = 0;

const jsonrpc = (requestJSON: JsonRpcRequest) => {
    const request = requestJSON;

    if (request.method === NodeServiceMethods.CALL_NODE_DATA_SERVICE) {
        return JSON.stringify({
            result: JSON.stringify({ result: { dataArray: [1, 1, 2] } }),
            id: request.id,
        });
    }

    const error: any = new Error('Unsupported params');

    throw error;
};

const onMessageFromIFrame = (event) => {
    const { data } = event;

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
                const { payload } = event.data;
                const response = window.jsonrpc(payload);

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

    describe('initialization', () => {
        it('Creates IFrameKnimeService', async () => {
            const knimeService = new IFrameKnimeService();
            await sleep();
            expect(knimeService).toHaveProperty('extensionConfig');
            expect(knimeService.extensionConfig).toEqual(extensionConfig);

            knimeService.destroy();
        });
    });

    describe('working with JSONDataService', () => {
        it('Gets data', async () => {
            window.jsonrpc = jsonrpc;

            const knimeService = new IFrameKnimeService();
            await sleep();
            const knimeJSONDataService = new JSONDataService(knimeService);

            const result = await knimeJSONDataService.data();
            expect(result).toEqual({ dataArray: [1, 1, 2] });

            knimeService.destroy();
        });

        it('Throws error if data request takes too long', async () => {
            const knimeService = new IFrameKnimeService();
            await sleep();
            window.removeEventListener('message', onMessageFromIFrame);

            const knimeJSONDataService = new JSONDataService(knimeService);
            knimeService.destroy();

            expect(knimeJSONDataService.data()).rejects.toThrowError(
                'Request with id: 4 rejected due to timeout.',
            );
            await sleep(UI_EXT_POST_MESSAGE_TIMEOUT + 100);
        });
    });
});
