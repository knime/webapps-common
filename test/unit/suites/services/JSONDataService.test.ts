import { JsonDataService } from 'src/services/JsonDataService';
import { extensionConfig } from 'test/mocks';
import { NodeServices, DataServiceTypes, EventTypes } from 'src/types';
import { KnimeService } from 'src/services/KnimeService';

describe('JsonDataService', () => {
    const defaultExtensionConfig = extensionConfig;

    const getKnimeService = (extensionConfig = defaultExtensionConfig) => {
        const callServiceSpy = jest.fn(() => Promise.resolve(JSON.stringify(extensionConfig?.initialData)));
        const pushNotificationSpy = jest.fn();
        const knimeService = new KnimeService(extensionConfig, callServiceSpy, pushNotificationSpy);
        return { knimeService, callServiceSpy, pushNotificationSpy };
    };

    describe('initialization', () => {
        it('Creates data service', () => {
            const { knimeService } = getKnimeService();
            const jsonDataService = new JsonDataService(knimeService);

            expect(jsonDataService).toHaveProperty('initialData');
        });
    });

    describe('service.initialData', () => {
        it(`Fetches initialData if it's passed to constructor`, async () => {
            const { knimeService } = getKnimeService();
            const jsonDataService = new JsonDataService(knimeService);
            const response = await jsonDataService.initialData();
            expect(response).toStrictEqual(extensionConfig.initialData.result);
        });

        it('Fetches initialData via KnimeService', async () => {
            const localExtensionConfig = { ...extensionConfig };
            delete localExtensionConfig.initialData;
            const callServiceSpy = jest.fn().mockResolvedValue({
                result: JSON.stringify(extensionConfig.initialData)
            });
            const pushNotificationSpy = jest.fn();
            const knimeService = new KnimeService(localExtensionConfig, callServiceSpy, pushNotificationSpy);
            const jsonDataService = new JsonDataService(knimeService);
            const response = await jsonDataService.initialData();
            expect(response).toStrictEqual({
                settings: extensionConfig.initialData.result.settings
            });
        });
    });

    describe('service.data', () => {
        it('calls default data service', () => {
            const { knimeService, callServiceSpy } = getKnimeService();
            const jsonDataService = new JsonDataService(knimeService);
            jsonDataService.data();
            expect(callServiceSpy.mock.calls[0]).toEqual([
                NodeServices.CALL_NODE_DATA_SERVICE,
                DataServiceTypes.DATA,
                expect.stringContaining('getData')
            ]);
        });

        it('calls data service with options', () => {
            const options = {
                columns: [1, 2],
                rows: 500
            };
            const { knimeService, callServiceSpy } = getKnimeService();
            const jsonDataService = new JsonDataService(knimeService);
            jsonDataService.data({ options });
            expect(callServiceSpy.mock.calls[0]).toEqual([
                NodeServices.CALL_NODE_DATA_SERVICE,
                DataServiceTypes.DATA,
                expect.stringContaining(JSON.stringify(options))
            ]);
        });

        it('calls data service by method', () => {
            const { knimeService, callServiceSpy } = getKnimeService();
            const jsonDataService = new JsonDataService(knimeService);
            jsonDataService.data({ method: 'nextPage' });

            expect(callServiceSpy.mock.calls[0]).toEqual([
                NodeServices.CALL_NODE_DATA_SERVICE,
                DataServiceTypes.DATA,
                expect.stringContaining('nextPage')
            ]);
        });

        it('accepts empty string response from data request', async () => {
            const callServiceSpy = jest.fn().mockResolvedValue({ result: { result: '' } });
            const pushNotificationSpy = jest.fn();
            const knimeService = new KnimeService(extensionConfig, callServiceSpy, pushNotificationSpy);
            const jsonDataService = new JsonDataService(knimeService);
            const response = await jsonDataService.data();
            expect(response).toEqual('');
        });
    });

    describe('service.applyData', () => {
        const mockData = {
            item1: true,
            item2: 10
        };

        let knimeService, jsonDataService, dataGetter, callServiceSpy;

        beforeEach(() => {
            const { knimeService: localKnimeService, callServiceSpy: localCallServiceSpy } = getKnimeService();
            knimeService = localKnimeService;
            callServiceSpy = localCallServiceSpy;
            jsonDataService = new JsonDataService(knimeService);
            dataGetter = jest.fn(() => Promise.resolve({ result: { result: mockData } }));
        });

        afterEach(() => {
            jest.resetAllMocks();
        });

        it('calls the apply data service when "applyData" is called', async () => {
            await jsonDataService.applyData();
            expect(callServiceSpy.mock.calls[0]).toEqual([
                NodeServices.CALL_NODE_DATA_SERVICE,
                DataServiceTypes.APPLY_DATA,
                null
            ]);
        });

        it('calls a default data getter if none registered', async () => {
            await jsonDataService.applyData();
            expect(dataGetter).not.toHaveBeenCalled();
            expect(callServiceSpy.mock.calls[0]).toEqual([
                NodeServices.CALL_NODE_DATA_SERVICE,
                DataServiceTypes.APPLY_DATA,
                null
            ]);
        });

        it('calls the registered data getter (if present)', async () => {
            jsonDataService.registerDataGetter(dataGetter);
            await jsonDataService.applyData();
            expect(dataGetter).toHaveBeenCalled();
            expect(callServiceSpy.mock.calls[0]).toEqual([
                NodeServices.CALL_NODE_DATA_SERVICE,
                DataServiceTypes.APPLY_DATA,
                '{}'
            ]);
        });
    });

    describe('callbacks and events', () => {
        it('registers a data getter with the KnimeService', () => {
            const { knimeService } = getKnimeService();
            const jsonDataService = new JsonDataService(knimeService);

            const registerDataGetterSpy = jest.spyOn(knimeService, 'registerDataGetter');

            jsonDataService.registerDataGetter(() => {});

            expect(registerDataGetterSpy).toHaveBeenCalled();
        });

        it('adds callback to notification with addOnDataChangeCallback', () => {
            const knime = new KnimeService(extensionConfig);
            const jsonDataService = new JsonDataService(knime);

            const mockDataChangeCallback = () => {};

            jsonDataService.addOnDataChangeCallback(mockDataChangeCallback);

            expect(knime.notificationCallbacksMap.get(EventTypes.DataEvent)[0]).toEqual(mockDataChangeCallback);
        });

        it('publishes events via the knimeService', () => {
            const { knimeService, pushNotificationSpy } = getKnimeService();
            const jsonDataService = new JsonDataService(knimeService);
            const testEvent = { agent: '007' };
            jsonDataService.publishData(testEvent);
            expect(pushNotificationSpy).toHaveBeenCalledWith({
                callerId: '123.knime workflow.root:10.view',
                event: { data: testEvent },
                method: EventTypes.DataEvent
            });
        });
    });

    describe('handling errors', () => {
        it('handles user errors during initial data service requests', async () => {
            const expectedError = {
                message: 'Something went wrong',
                details: 'More information'
            };
            const { knimeService } = getKnimeService({ ...extensionConfig, initialData: { userError: expectedError } });
            const jsonDataService = new JsonDataService(knimeService);
            const sendErrorSpy = jest.spyOn(knimeService, 'sendError');
            const response = await jsonDataService.initialData();
            expect(response).toStrictEqual({ error: expectedError });
            expect(sendErrorSpy).toBeCalledWith({
                code: undefined,
                message: 'More information',
                nodeId: extensionConfig.nodeId,
                nodeInfo: extensionConfig.nodeInfo,
                subtitle: 'Something went wrong',
                type: 'error'
                    
            });
        });

        it('handles internal errors during initial data service requests', async () => {
            const expectedError = {
                message: 'Java heap space',
                typeName: 'OutOfMemoryError',
                stackTrace: ['Line 1', 'Line 2']
            };
            const { knimeService } = getKnimeService({
                ...extensionConfig, initialData: { internalError: expectedError }
            });
            const jsonDataService = new JsonDataService(knimeService);
            const sendErrorSpy = jest.spyOn(knimeService, 'sendError');
            const response = await jsonDataService.initialData();
            expect(response).toStrictEqual({ error: expectedError });
            expect(sendErrorSpy).toBeCalledWith({
                code: undefined,
                message: expect.stringContaining(expectedError.stackTrace.join('\n\t')),
                nodeId: extensionConfig.nodeId,
                nodeInfo: extensionConfig.nodeInfo,
                subtitle: 'Java heap space',
                type: 'error'
                    
            });
        });

        it('handles warning messages during initial data service requests', async () => {
            const initialData = {
                result: 'Some data',
                warningMessages: ['Warn', 'ing']
            };
            const { knimeService } = getKnimeService({ ...extensionConfig, initialData });
            const jsonDataService = new JsonDataService(knimeService);
            const sendWarningSpy = jest.spyOn(knimeService, 'sendWarning');
            const response = await jsonDataService.initialData();
            expect(response).toStrictEqual(initialData.result);
            expect(sendWarningSpy).toBeCalledWith({
                code: undefined,
                message: initialData.warningMessages.join('\n\n'),
                nodeId: extensionConfig.nodeId,
                nodeInfo: extensionConfig.nodeInfo,
                subtitle: undefined,
                type: 'warn'
                    
            });
        });

        it('handles errors during data service requests', async () => {
            const expectedError = {
                code: -32001,
                message: 'Frequency Column Universe_0_0 is not present in table.',
                data: {
                    details: 'More information'
                }
            };
            const callServiceSpy = jest.fn().mockResolvedValue({ result: { error: expectedError } });
            const pushNotificationSpy = jest.fn();
            const knimeService = new KnimeService(extensionConfig, callServiceSpy, pushNotificationSpy);
            const jsonDataService = new JsonDataService(knimeService);
            const sendErrorSpy = jest.spyOn(knimeService, 'sendError');
            const response = await jsonDataService.data();
            expect(response).toStrictEqual({ error: expectedError });
            expect(sendErrorSpy).toBeCalledWith({
                code: -32001,
                message: expectedError.data.details,
                nodeId: extensionConfig.nodeId,
                nodeInfo: extensionConfig.nodeInfo,
                subtitle: expectedError.message,
                type: 'error'
                    
            });
        });

        it('handles warning messages during data service requests', async () => {
            const data = {
                result: 'Some data',
                warningMessages: ['Warn', 'ing']
            };
            const callServiceSpy = jest.fn().mockResolvedValue({ result: data });
            const pushNotificationSpy = jest.fn();
            const knimeService = new KnimeService(extensionConfig, callServiceSpy, pushNotificationSpy);
            const jsonDataService = new JsonDataService(knimeService);
            const sendWarningSpy = jest.spyOn(knimeService, 'sendWarning');
            const response = await jsonDataService.data();
            expect(response).toStrictEqual(data.result);
            expect(sendWarningSpy).toBeCalledWith({
                code: undefined,
                message: data.warningMessages.join('\n\n'),
                nodeId: extensionConfig.nodeId,
                nodeInfo: extensionConfig.nodeInfo,
                subtitle: undefined,
                type: 'warn'
                    
            });
        });
    });
});
