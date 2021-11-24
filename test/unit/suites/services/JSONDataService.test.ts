import { ComponentKnimeService } from 'src/services/ComponentKnimeService';
import { JsonDataService } from 'src/services/JsonDataService';
import { extensionConfig } from 'test/mocks';
import { DataServiceTypes, NodeServiceMethods } from 'src/types';

describe('JsonDataService', () => {
    describe('initialization', () => {
        it('Creates data service', () => {
            const knimeService = new ComponentKnimeService(extensionConfig);
            const jsonDataService = new JsonDataService(knimeService);

            expect(jsonDataService).toHaveProperty('initialData');
        });
    });

    describe('initial_data handling', () => {
        it(`Fetches initial_data if it's passed to constructor`, () => {
            const knimeService = new ComponentKnimeService(extensionConfig);
            const jsonDataService = new JsonDataService(knimeService);

            expect(jsonDataService.initialData()).resolves.toEqual(extensionConfig.initialData);
        });

        it('Fetches initial_data via ComponentKnimeService', () => {
            const knimeService = new ComponentKnimeService({
                ...extensionConfig,
                initialData: null
            });
            let serviceSpy = jest
                .spyOn(knimeService, 'callService')
                .mockImplementation(() => Promise.resolve(
                    JSON.stringify({ result: JSON.stringify(extensionConfig.initialData) })
                ));
            const jsonDataService = new JsonDataService(knimeService);

            expect(jsonDataService.initialData()).resolves.toEqual({
                settings: extensionConfig.initialData.settings
            });
            expect(serviceSpy).toHaveBeenCalledWith(
                NodeServiceMethods.CALL_NODE_DATA_SERVICE,
                DataServiceTypes.INITIAL_DATA,
                ''
            );
        });
    });

    describe('getData', () => {
        it('calls default data service', () => {
            const knimeService = new ComponentKnimeService(extensionConfig);
            const jsonDataService = new JsonDataService(knimeService);
            let serviceSpy = jest
                .spyOn(knimeService, 'callService')
                .mockImplementationOnce(() => Promise.resolve(
                    JSON.stringify({ result: JSON.stringify(extensionConfig.initialData) })
                ));
            jsonDataService.data();
            expect(serviceSpy).toHaveBeenCalledWith(
                NodeServiceMethods.CALL_NODE_DATA_SERVICE,
                DataServiceTypes.DATA,
                expect.stringContaining('getData')
            );
        });

        it('calls data service with options', () => {
            let options = {
                columns: [1, 2],
                rows: 500
            };
            const knimeService = new ComponentKnimeService(extensionConfig);
            const jsonDataService = new JsonDataService(knimeService);
            let serviceSpy = jest
                .spyOn(knimeService, 'callService')
                .mockImplementationOnce(() => Promise.resolve(
                    JSON.stringify({ result: JSON.stringify(extensionConfig.initialData) })
                ));
            jsonDataService.data({ options });
            expect(serviceSpy).toHaveBeenCalledWith(
                NodeServiceMethods.CALL_NODE_DATA_SERVICE,
                DataServiceTypes.DATA,
                expect.stringContaining(JSON.stringify(options))
            );
        });

        it('calls data service by method', () => {
            const knimeService = new ComponentKnimeService(extensionConfig);
            const jsonDataService = new JsonDataService(knimeService);
            let serviceSpy = jest
                .spyOn(knimeService, 'callService')
                .mockImplementationOnce(() => Promise.resolve(
                    JSON.stringify({ result: JSON.stringify(extensionConfig.initialData) })
                ));
            jsonDataService.data({ method: 'nextPage' });
            expect(serviceSpy).toHaveBeenCalledWith(
                NodeServiceMethods.CALL_NODE_DATA_SERVICE,
                DataServiceTypes.DATA,
                expect.stringContaining('nextPage')
            );
        });
    });

    describe('registering a data getter callback', () => {
        it('Registers a data getter with the ComponentKnimeService', () => {
            const knimeService = new ComponentKnimeService(extensionConfig);
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
            // window.jsonrpc = jest.fn(() => '{}');
            knimeService = new ComponentKnimeService(extensionConfig);
            jsonDataService = new JsonDataService(knimeService);
            dataGetter = jest.fn(() => Promise.resolve(mockData));
        });

        afterEach(() => {
            jest.resetAllMocks();
            delete window.jsonrpc;
        });

        it('calls the apply data service when "applyData" is called', async () => {
            let serviceSpy = jest
                .spyOn(knimeService, 'callService')
                .mockImplementation(() => Promise.resolve(
                    JSON.stringify({ result: JSON.stringify(extensionConfig.initialData) })
                ));
            await jsonDataService.applyData();
            expect(serviceSpy).toHaveBeenCalledWith(
                NodeServiceMethods.CALL_NODE_DATA_SERVICE,
                DataServiceTypes.APPLY_DATA,
                expect.anything()
            );
        });

        it('calls a default data getter if none registered', async () => {
            let serviceSpy = jest
                .spyOn(knimeService, 'callService')
                .mockImplementation(() => Promise.resolve(
                    JSON.stringify({ result: JSON.stringify(extensionConfig.initialData) })
                ));
            await jsonDataService.applyData();
            expect(serviceSpy).toHaveBeenCalledWith(
                NodeServiceMethods.CALL_NODE_DATA_SERVICE,
                DataServiceTypes.APPLY_DATA,
                'null'
            );
            expect(dataGetter).not.toHaveBeenCalled();
        });

        it('calls the registered data getter (if present)', async () => {
            jsonDataService.registerDataGetter(dataGetter);
            let serviceSpy = jest
                .spyOn(knimeService, 'callService')
                .mockImplementation(() => Promise.resolve(
                    JSON.stringify({ result: JSON.stringify(extensionConfig.initialData) })
                ));
            await jsonDataService.applyData();
            expect(serviceSpy).toHaveBeenCalledWith(
                NodeServiceMethods.CALL_NODE_DATA_SERVICE,
                DataServiceTypes.APPLY_DATA,
                '"{}"'
            );
            expect(dataGetter).toHaveBeenCalled();
        });
    });
});
