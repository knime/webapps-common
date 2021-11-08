import { UI_EXT_POST_MESSAGE_PREFIX } from 'src/constants';
import { IFrameKnimeService, JSONDataService } from 'src/services';
import { NodeServiceMethods } from 'src/types';
import { extensionConfig } from 'test/mocks';

/* eslint-disable-next-line no-magic-numbers */
const sleep = async (timeout = 15) => {
    await new Promise((resolve) => setTimeout(resolve, timeout));
};

let testId = 0;

const jsonrpc = (requestJSON: string) => {
    const request = JSON.parse(requestJSON);

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

    describe('initialization', () => {
        it('Creates IFrameKnimeService', async () => {
            const knimeService = new IFrameKnimeService();
            await sleep();
            expect(knimeService).toHaveProperty('extensionConfig');
            expect(knimeService.extensionConfig).toEqual(extensionConfig);

            knimeService.destroy();
        });
    });

    beforeEach(() => {
        testId += 2;
    });

    describe('working with JSONDataService', () => {
        it('Gets data', async () => {
            window.jsonrpc = jsonrpc;

            const knimeService = new IFrameKnimeService();
            await sleep();
            const knimeJSONDataService = new JSONDataService(knimeService);

            // knimeService.destroy();
            const result = await knimeJSONDataService.data();
            expect(result).toEqual({ dataArray: [1, 1, 2] });

            knimeService.destroy();
        });
    });

    describe('working with JSONDataService', () => {
        it('Gets data', async () => {
            window.jsonrpc = jsonrpc;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            testId = 4;

            const knimeService = new IFrameKnimeService();
            await sleep();
            const knimeJSONDataService = new JSONDataService(knimeService);

            // knimeService.destroy();
            const result = await knimeJSONDataService.data();
            expect(result).toEqual({ dataArray: [1, 1, 2] });

            knimeService.destroy();
        });
    });
});
