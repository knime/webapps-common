import { JsonDataService } from 'src/services/JsonDataService';
import { extensionConfig } from 'test/mocks';
import { DataServiceTypes, JsonRpcRequest, NodeServiceMethods } from 'src/types';
import { KnimeService } from 'src/services/KnimeService';

describe('JsonDataService', () => {
    describe('initialization', () => {
        it('Creates data service', () => {
            const knimeService = new KnimeService(extensionConfig);
            const jsonDataService = new JsonDataService(knimeService);

            expect(jsonDataService).toHaveProperty('initialData');
        });
    });

    describe('initial_data handling', () => {
        it(`Fetches initial_data if it's passed to constructor`, () => {
            const knimeService = new KnimeService(extensionConfig);
            const jsonDataService = new JsonDataService(knimeService);

            expect(jsonDataService.initialData()).resolves.toEqual(extensionConfig.initialData);
        });

        it('Fetches initial_data via ComponentKnimeService', () => {
            const knimeService = new KnimeService({
                ...extensionConfig,
                initialData: null
            });
            const serviceSpy = jest
                .spyOn(knimeService, 'callService')
                .mockImplementation(() => Promise.resolve(
                    JSON.stringify({ result: JSON.stringify(extensionConfig.initialData) })
                ));
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

    describe('getData', () => {
        it('calls default data service', () => {
            const knimeService = new KnimeService(extensionConfig);
            const jsonDataService = new JsonDataService(knimeService);
            const serviceSpy = jest
                .spyOn(knimeService, 'callService')
                .mockImplementationOnce(() => Promise.resolve(
                    JSON.stringify({ result: JSON.stringify(extensionConfig.initialData) })
                ));
            jsonDataService.data();
            const invocationParameters = serviceSpy.mock.calls[0][0];
            expect(invocationParameters.method).toBe(NodeServiceMethods.CALL_NODE_DATA_SERVICE);
            expect(invocationParameters.params).toContain(DataServiceTypes.DATA);
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
            const serviceSpy = jest
                .spyOn(knimeService, 'callService')
                .mockImplementationOnce(() => Promise.resolve(
                    JSON.stringify({ result: JSON.stringify(extensionConfig.initialData) })
                ));
            jsonDataService.data({ options });
            const invocationParameters = serviceSpy.mock.calls[0][0];
            expect(invocationParameters.method).toBe(NodeServiceMethods.CALL_NODE_DATA_SERVICE);
            expect(invocationParameters.params).toContain(DataServiceTypes.DATA);
            expect((invocationParameters.params as any[]).some(param => param?.includes?.(checkOptions)))
                .toBe(true);
        });

        it('calls data service by method', () => {
            const knimeService = new KnimeService(extensionConfig);
            const jsonDataService = new JsonDataService(knimeService);
            const serviceSpy = jest
                .spyOn(knimeService, 'callService')
                .mockImplementationOnce(() => Promise.resolve(
                    JSON.stringify({ result: JSON.stringify(extensionConfig.initialData) })
                ));
            jsonDataService.data({ method: 'nextPage' });
            const invocationParameters = serviceSpy.mock.calls[0][0];
            expect(invocationParameters.method).toBe(NodeServiceMethods.CALL_NODE_DATA_SERVICE);
            expect(invocationParameters.params).toContain(DataServiceTypes.DATA);
            expect((invocationParameters.params as any[]).some(param => param?.includes?.('nextPage')))
                .toBe(true);
        });
    });

    describe('registering a data getter callback', () => {
        it('Registers a data getter with the ComponentKnimeService', () => {
            const knimeService = new KnimeService(extensionConfig);
            const jsonDataService = new JsonDataService(knimeService);

            const spy = jest.spyOn(knimeService, 'registerDataGetter');

            jsonDataService.registerDataGetter(() => {});

            expect(spy).toHaveBeenCalled();
        });
    });

    describe('applyData', () => {
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
            const serviceSpy = jest
                .spyOn(knimeService, 'callService')
                .mockImplementation(() => Promise.resolve(
                    JSON.stringify({ result: JSON.stringify(extensionConfig.initialData) })
                ));
            await jsonDataService.applyData();
            const invocationParameters = serviceSpy.mock.calls[0][0] as JsonRpcRequest;
            expect(invocationParameters.method).toBe(NodeServiceMethods.CALL_NODE_DATA_SERVICE);
            expect(invocationParameters.params).toContain(DataServiceTypes.APPLY_DATA);
        });

        it('calls a default data getter if none registered', async () => {
            const serviceSpy = jest
                .spyOn(knimeService, 'callService')
                .mockImplementation(() => Promise.resolve(
                    JSON.stringify({ result: JSON.stringify(extensionConfig.initialData) })
                ));
            await jsonDataService.applyData();
            expect(dataGetter).not.toHaveBeenCalled();
            const invocationParameters = serviceSpy.mock.calls[0][0] as JsonRpcRequest;
            expect(invocationParameters.method).toBe(NodeServiceMethods.CALL_NODE_DATA_SERVICE);
            expect(invocationParameters.params).toContain(DataServiceTypes.APPLY_DATA);
            expect(invocationParameters.params).toContain('null');
        });

        it('calls the registered data getter (if present)', async () => {
            jsonDataService.registerDataGetter(dataGetter);
            const serviceSpy = jest
                .spyOn(knimeService, 'callService')
                .mockImplementation(() => Promise.resolve(
                    JSON.stringify({ result: JSON.stringify(extensionConfig.initialData) })
                ));
            await jsonDataService.applyData();
            expect(dataGetter).toHaveBeenCalled();
            const invocationParameters = serviceSpy.mock.calls[0][0] as JsonRpcRequest;
            expect(invocationParameters.method).toBe(NodeServiceMethods.CALL_NODE_DATA_SERVICE);
            expect(invocationParameters.params).toContain(DataServiceTypes.APPLY_DATA);
            expect(invocationParameters.params).toContain('"{}"');
        });
    });
});
