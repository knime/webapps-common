import { JsonDataService } from 'src/services/JsonDataService';
import { extensionConfig } from 'test/mocks';
import { DataServiceTypes, JsonRpcRequest, NodeServiceMethods, EventTypes } from 'src/types';
import { KnimeService } from 'src/services/KnimeService';

describe('JsonDataService', () => {
    const getMockCallService = (knimeService: KnimeService) => jest
        .spyOn(knimeService, 'callService')
        .mockImplementation(() => Promise.resolve(JSON.stringify(extensionConfig.initialData)));

    describe('initialization', () => {
        it('Creates data service', () => {
            const knimeService = new KnimeService(extensionConfig);
            const jsonDataService = new JsonDataService(knimeService);

            expect(jsonDataService).toHaveProperty('initialData');
        });
    });

    describe('service.initialData', () => {
        it(`Fetches initial_data if it's passed to constructor`, () => {
            const knimeService = new KnimeService(extensionConfig);
            const jsonDataService = new JsonDataService(knimeService);

            expect(jsonDataService.initialData()).resolves.toEqual(extensionConfig.initialData);
        });

        it('Fetches initial_data via KnimeService', () => {
            const knimeService = new KnimeService({
                ...extensionConfig,
                initialData: null
            });
            const serviceSpy = getMockCallService(knimeService);
            const jsonDataService = new JsonDataService(knimeService);

            expect(jsonDataService.initialData()).resolves.toEqual({
                settings: extensionConfig.initialData.settings
            });
            const invocationParameters = serviceSpy.mock.calls[0][0];
            expect(invocationParameters.method).toBe(NodeServiceMethods.CALL_NODE_DATA_SERVICE);
            expect(invocationParameters.params).toContain(DataServiceTypes.INITIAL_DATA);
            expect(invocationParameters.params).toContain('');
        });
    });

    describe('service.data', () => {
        it('calls default data service', () => {
            const knimeService = new KnimeService(extensionConfig);
            const jsonDataService = new JsonDataService(knimeService);
            const serviceSpy = getMockCallService(knimeService);
            jsonDataService.data();
            const invocationParameters = serviceSpy.mock.calls[0][0];
            expect(invocationParameters.method).toBe(NodeServiceMethods.CALL_NODE_DATA_SERVICE);
            expect(invocationParameters.params).toContain(DataServiceTypes.DATA);
            /* eslint-disable-next-line no-extra-parens */
            expect((invocationParameters.params as any[]).some(param => param?.includes?.('getData')))
                .toBe(true);
        });

        it('calls data service with options', () => {
            const options = {
                columns: [1, 2],
                rows: 500
            };
            const checkOptions = JSON.stringify(options);
            const knimeService = new KnimeService(extensionConfig);
            const jsonDataService = new JsonDataService(knimeService);
            const serviceSpy = getMockCallService(knimeService);
            jsonDataService.data({ options });
            const invocationParameters = serviceSpy.mock.calls[0][0];
            expect(invocationParameters.method).toBe(NodeServiceMethods.CALL_NODE_DATA_SERVICE);
            expect(invocationParameters.params).toContain(DataServiceTypes.DATA);
            /* eslint-disable-next-line no-extra-parens */
            expect((invocationParameters.params as any[]).some(param => param?.includes?.(checkOptions)))
                .toBe(true);
        });

        it('calls data service by method', () => {
            const knimeService = new KnimeService(extensionConfig);
            const jsonDataService = new JsonDataService(knimeService);
            const serviceSpy = getMockCallService(knimeService);
            jsonDataService.data({ method: 'nextPage' });
            const invocationParameters = serviceSpy.mock.calls[0][0];
            expect(invocationParameters.method).toBe(NodeServiceMethods.CALL_NODE_DATA_SERVICE);
            expect(invocationParameters.params).toContain(DataServiceTypes.DATA);
            /* eslint-disable-next-line no-extra-parens */
            expect((invocationParameters.params as any[]).some(param => param?.includes?.('nextPage')))
                .toBe(true);
        });
    });

    describe('service.applyData', () => {
        const mockData = {
            item1: true,
            item2: 10
        };

        let knimeService, jsonDataService, dataGetter;

        beforeEach(() => {
            knimeService = new KnimeService(extensionConfig);
            jsonDataService = new JsonDataService(knimeService);
            dataGetter = jest.fn(() => Promise.resolve(mockData));
        });

        afterEach(() => {
            jest.resetAllMocks();
        });

        it('calls the apply data service when "applyData" is called', async () => {
            const serviceSpy = getMockCallService(knimeService);
            await jsonDataService.applyData();
            const invocationParameters = serviceSpy.mock.calls[0][0] as JsonRpcRequest;
            expect(invocationParameters.method).toBe(NodeServiceMethods.CALL_NODE_DATA_SERVICE);
            expect(invocationParameters.params).toContain(DataServiceTypes.APPLY_DATA);
        });

        it('calls a default data getter if none registered', async () => {
            const serviceSpy = getMockCallService(knimeService);
            await jsonDataService.applyData();
            expect(dataGetter).not.toHaveBeenCalled();
            const invocationParameters = serviceSpy.mock.calls[0][0] as JsonRpcRequest;
            expect(invocationParameters.method).toBe(NodeServiceMethods.CALL_NODE_DATA_SERVICE);
            expect(invocationParameters.params).toContain(DataServiceTypes.APPLY_DATA);
            expect(invocationParameters.params).toContain('null');
        });

        it('calls the registered data getter (if present)', async () => {
            jsonDataService.registerDataGetter(dataGetter);
            const serviceSpy = getMockCallService(knimeService);
            await jsonDataService.applyData();
            expect(dataGetter).toHaveBeenCalled();
            const invocationParameters = serviceSpy.mock.calls[0][0] as JsonRpcRequest;
            expect(invocationParameters.method).toBe(NodeServiceMethods.CALL_NODE_DATA_SERVICE);
            expect(invocationParameters.params).toContain(DataServiceTypes.APPLY_DATA);
            expect(invocationParameters.params).toContain('"{}"');
        });
    });

    describe('callbacks and events', () => {
        it('registers a data getter with the KnimeService', () => {
            const knimeService = new KnimeService(extensionConfig);
            const jsonDataService = new JsonDataService(knimeService);

            const spy = jest.spyOn(knimeService, 'registerDataGetter');

            jsonDataService.registerDataGetter(() => {});

            expect(spy).toHaveBeenCalled();
        });

        it('adds callback to notification with addOnSettingsChangeCallback', () => {
            const knime = new KnimeService(extensionConfig);
            const jsonDataService = new JsonDataService(knime);

            const callback = () => {};

            jsonDataService.addOnSettingsChangeCallback(callback);

            expect(knime.notificationCallbacksMap.get(EventTypes.SettingsEvent)[0]).toEqual(callback);
        });

        it('publishes events via the knimeService', () => {
            const callableMock = jest.fn();
            const pushNotificationSpy = jest.fn();
            const knime = new KnimeService(extensionConfig, callableMock, pushNotificationSpy);
            const jsonDataService = new JsonDataService(knime);
            const testEvent = { agent: '007' };
            jsonDataService.publishSettings(testEvent);
            expect(pushNotificationSpy).toHaveBeenCalledWith({
                callerId: '123.knime workflow.root:10.view',
                event: {
                    data: testEvent,
                    method: EventTypes.SettingsEvent
                },
                method: EventTypes.SettingsEvent
            });
        });
    });
});
