import { JsonDataService } from 'src/services/JsonDataService';
import { extensionConfig } from 'test/mocks';
import { DataServices, NodeServices, EventTypes } from 'src/types';
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
        it(`Fetches initialData if it's passed to constructor`, () => {
            const knimeService = new KnimeService(extensionConfig);
            const jsonDataService = new JsonDataService(knimeService);

            expect(jsonDataService.initialData()).resolves.toEqual(extensionConfig.initialData);
        });

        it('Fetches initialData via KnimeService', () => {
            const knimeService = new KnimeService({
                ...extensionConfig,
                initialData: null
            });
            const serviceSpy = getMockCallService(knimeService);
            const jsonDataService = new JsonDataService(knimeService);

            expect(jsonDataService.initialData()).resolves.toEqual({
                settings: extensionConfig.initialData.settings
            });
            expect(serviceSpy.mock.calls[0][0]).toStrictEqual([
                NodeServices.CALL_NODE_DATA_SERVICE,
                DataServices.INITIAL_DATA,
                ''
            ]);
        });
    });

    describe('service.data', () => {
        it('calls default data service', () => {
            const knimeService = new KnimeService(extensionConfig);
            const jsonDataService = new JsonDataService(knimeService);
            const serviceSpy = getMockCallService(knimeService);
            jsonDataService.data();
            expect(serviceSpy.mock.calls[0][0]).toStrictEqual([
                NodeServices.CALL_NODE_DATA_SERVICE,
                DataServices.DATA,
                expect.stringContaining('getData')
            ]);
        });

        it('calls data service with options', () => {
            const options = {
                columns: [1, 2],
                rows: 500
            };
            const knimeService = new KnimeService(extensionConfig);
            const jsonDataService = new JsonDataService(knimeService);
            const serviceSpy = getMockCallService(knimeService);
            jsonDataService.data({ options });
            expect(serviceSpy.mock.calls[0][0]).toStrictEqual([
                NodeServices.CALL_NODE_DATA_SERVICE,
                DataServices.DATA,
                expect.stringContaining(JSON.stringify(options))
            ]);
        });

        it('calls data service by method', () => {
            const knimeService = new KnimeService(extensionConfig);
            const jsonDataService = new JsonDataService(knimeService);
            const serviceSpy = getMockCallService(knimeService);
            jsonDataService.data({ method: 'nextPage' });

            expect(serviceSpy.mock.calls[0][0]).toStrictEqual([
                NodeServices.CALL_NODE_DATA_SERVICE,
                DataServices.DATA,
                expect.stringContaining('nextPage')
            ]);
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
            expect(serviceSpy.mock.calls[0][0]).toStrictEqual([
                NodeServices.CALL_NODE_DATA_SERVICE,
                DataServices.APPLY_DATA,
                null
            ]);
        });

        it('calls a default data getter if none registered', async () => {
            const serviceSpy = getMockCallService(knimeService);
            await jsonDataService.applyData();
            expect(dataGetter).not.toHaveBeenCalled();
            expect(serviceSpy.mock.calls[0][0]).toStrictEqual([
                NodeServices.CALL_NODE_DATA_SERVICE,
                DataServices.APPLY_DATA,
                null
            ]);
        });

        it('calls the registered data getter (if present)', async () => {
            jsonDataService.registerDataGetter(dataGetter);
            const serviceSpy = getMockCallService(knimeService);
            await jsonDataService.applyData();
            expect(dataGetter).toHaveBeenCalled();
            expect(serviceSpy.mock.calls[0][0]).toStrictEqual([
                NodeServices.CALL_NODE_DATA_SERVICE,
                DataServices.APPLY_DATA,
                '{}'
            ]);
        });
    });

    describe('callbacks and events', () => {
        it('registers a data getter with the KnimeService', () => {
            const knimeService = new KnimeService(extensionConfig);
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
            const callableMock = jest.fn();
            const pushNotificationSpy = jest.fn();
            const knime = new KnimeService(extensionConfig, callableMock, pushNotificationSpy);
            const jsonDataService = new JsonDataService(knime);
            const testEvent = { agent: '007' };
            jsonDataService.publishData(testEvent);
            expect(pushNotificationSpy).toHaveBeenCalledWith({
                callerId: '123.knime workflow.root:10.view',
                event: { data: testEvent },
                method: EventTypes.DataEvent
            });
        });
    });
});
