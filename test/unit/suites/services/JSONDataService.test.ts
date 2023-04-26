import { JsonDataService } from 'src/services/JsonDataService';
import { extensionConfig, longMessage } from 'test/mocks';
import { NodeServices, DataServiceTypes, EventTypes } from 'src/types';
import { KnimeService } from 'src/services/KnimeService';
import { Alert } from 'src/types/Alert';
import { AlertTypes } from 'src/types/AlertTypes';

describe('JsonDataService', () => {
    const defaultExtensionConfig = extensionConfig;

    const getKnimeService = (extensionConfig = defaultExtensionConfig) => {
        const callServiceSpy = jest.fn(() => Promise.resolve(JSON.stringify(extensionConfig?.initialData)));
        const pushEventSpy = jest.fn();
        const knimeService = new KnimeService(extensionConfig, callServiceSpy, pushEventSpy);
        return { knimeService, callServiceSpy, pushEventSpy };
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
            const pushEventSpy = jest.fn();
            const knimeService = new KnimeService(localExtensionConfig, callServiceSpy, pushEventSpy);
            const jsonDataService = new JsonDataService(knimeService);
            const response = await jsonDataService.initialData();
            expect(response).toStrictEqual(JSON.stringify(extensionConfig.initialData));
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
            const pushEventSpy = jest.fn();
            const knimeService = new KnimeService(extensionConfig, callServiceSpy, pushEventSpy);
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

        it('adds callback to event with addOnDataChangeCallback', () => {
            const knime = new KnimeService(extensionConfig);
            const jsonDataService = new JsonDataService(knime);

            const mockDataChangeCallback = () => {};

            jsonDataService.addOnDataChangeCallback(mockDataChangeCallback);

            expect(knime.eventCallbacksMap.get(EventTypes.DataEvent)[0]).toEqual(mockDataChangeCallback);
        });

        it('publishes events via the knimeService', () => {
            const { knimeService, pushEventSpy } = getKnimeService();
            const jsonDataService = new JsonDataService(knimeService);
            const testEvent = { agent: '007' };
            jsonDataService.publishData(testEvent);
            expect(pushEventSpy).toHaveBeenCalledWith({
                callerId: '123.knime workflow.root:10.view',
                event: { data: testEvent, method: EventTypes.DataEvent }
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
            expect(response).toBeFalsy();
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
            expect(response).toBeFalsy();
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
                subtitle: '2 messages',
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
            const pushEventSpy = jest.fn();
            const knimeService = new KnimeService(extensionConfig, callServiceSpy, pushEventSpy);
            const jsonDataService = new JsonDataService(knimeService);
            const sendErrorSpy = jest.spyOn(knimeService, 'sendError');
            const response = await jsonDataService.data();
            expect(response).toBeFalsy();
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
            const pushEventSpy = jest.fn();
            const knimeService = new KnimeService(extensionConfig, callServiceSpy, pushEventSpy);
            const jsonDataService = new JsonDataService(knimeService);
            const sendWarningSpy = jest.spyOn(knimeService, 'sendWarning');
            const response = await jsonDataService.data();
            expect(response).toStrictEqual(data.result);
            expect(sendWarningSpy).toBeCalledWith({
                code: undefined,
                message: data.warningMessages.join('\n\n'),
                nodeId: extensionConfig.nodeId,
                nodeInfo: extensionConfig.nodeInfo,
                subtitle: '2 messages',
                type: 'warn'
            });
        });
    });

    describe('alert formatting', () => {
        let knimeService, jsonDataService, sendWarningSpy, sendErrorSpy;

        beforeAll(() => {
            const callServiceSpy = jest.fn();
            const pushEventSpy = jest.fn();
            knimeService = new KnimeService(extensionConfig, callServiceSpy, pushEventSpy);
            jsonDataService = new JsonDataService(knimeService) as any;
            sendWarningSpy = jest.spyOn(knimeService, 'sendWarning');
            sendErrorSpy = jest.spyOn(knimeService, 'sendError');
        });

        afterEach(() => {
            sendWarningSpy.mockReset();
            sendErrorSpy.mockReset();
        });

        it('formats a single warning message', () => {
            jsonDataService.handleWarnings(['Message 1']);
            const sentMessage = sendWarningSpy.mock.calls[0][0] as Alert;
            expect(sentMessage.message).toBe('Message 1');
            expect(sentMessage.type).toBe(AlertTypes.WARN);
            expect(sentMessage.subtitle).toBeFalsy();
        });

        it('formats multiple warning messages', () => {
            const warnings = ['Message 1', 'Message 2'];
            jsonDataService.handleWarnings(warnings);
            const sentMessage = sendWarningSpy.mock.calls[0][0] as Alert;
            expect(sentMessage.message).toBe(warnings.join('\n\n'));
            expect(sentMessage.type).toBe(AlertTypes.WARN);
            expect(sentMessage.subtitle).toBe('2 messages');
        });

        it('formats long warning messages', () => {
            jsonDataService.handleWarnings([longMessage]);
            const sentMessage = sendWarningSpy.mock.calls[0][0] as Alert;
            expect(sentMessage.message).toBe(longMessage);
            expect(sentMessage.type).toBe(AlertTypes.WARN);
            expect(sentMessage.subtitle).toBe('Expand for details');
        });

        it('formats default error', () => {
            jsonDataService.handleError({});
            const sentMessage = sendErrorSpy.mock.calls[0][0] as Alert;
            expect(sentMessage.message).toBe(
                'No further information available. Please check the workflow configuration.'
            );
            expect(sentMessage.type).toBe(AlertTypes.ERROR);
            expect(sentMessage.subtitle).toBe('Something went wrong');
        });

        it('formats long error message', () => {
            jsonDataService.handleError({ message: longMessage });
            const sentMessage = sendErrorSpy.mock.calls[0][0] as Alert;
            expect(sentMessage.message).toBe(longMessage);
            expect(sentMessage.type).toBe(AlertTypes.ERROR);
            expect(sentMessage.subtitle).toBe('Something went wrong');
        });

        it('formats all error information', () => {
            jsonDataService.handleError({
                details: 'Something went wrong',
                stackTrace: ['Line1', 'Line2'],
                typeName: 'NullPointerException',
                message: 'Please check the workflow configuration',
                code: 401
            });
            const sentMessage = sendErrorSpy.mock.calls[0][0] as Alert;
            expect(sentMessage).toStrictEqual({
                code: 401,
                nodeId: extensionConfig.nodeId,
                message: expect.any(String),
                nodeInfo: extensionConfig.nodeInfo,
                subtitle: 'Please check the workflow configuration',
                type: AlertTypes.ERROR
            });
            expect(sentMessage.message).toContain('NullPointerException');
            expect(sentMessage.message).toContain('Something went wrong');
            expect(sentMessage.message).toContain('Line1\n\tLine2');
        });
    });
});
