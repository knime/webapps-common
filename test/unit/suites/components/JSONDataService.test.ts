import { KnimeService } from 'src/services/KnimeService';
import { JSONDataService } from 'src/services/JSONDataService';
import { extensionConfig } from 'test/mocks';
import { DataServices, RPCNodeServices } from 'src/types';


describe('JSONDataService', () => {
    describe('initialization', () => {
        it('Creates data service', () => {
            const knimeService = new KnimeService(extensionConfig);
            const jsonDataService = new JSONDataService(knimeService);

            expect(jsonDataService).toHaveProperty('getInitialData');
        });
    });

    describe('initial_data handling', () => {
        it(`Throws error if environment doesn't support rpc`, () => {
            const knimeService = new KnimeService();
            const jsonDataService = new JSONDataService(knimeService);

            expect(() => jsonDataService.getInitialData())
                .toThrowError(`Current environment doesn't support window.jsonrpc()`);
        });

        it(`Fetches initial_data if it's passed to constructor`, () => {
            const knimeService = new KnimeService(extensionConfig);
            const jsonDataService = new JSONDataService(knimeService);

            expect(jsonDataService.getInitialData()).resolves.toEqual(extensionConfig.initialData);
        });

        it('Fetches initial_data via KnimeService', () => {
            const knimeService = new KnimeService({
                ...extensionConfig,
                initialData: null
            });
            let serviceSpy = jest.spyOn(knimeService, 'callService')
                .mockImplementation(() => Promise.resolve(extensionConfig.initialData));
            const jsonDataService = new JSONDataService(knimeService);

            expect(jsonDataService.getInitialData()).resolves.toEqual({
                settings: extensionConfig.initialData.settings
            });
            expect(serviceSpy).toHaveBeenCalledWith(
                RPCNodeServices.CALL_NODE_DATA_SERVICE,
                DataServices.INITIAL_DATA,
                ''
            );
        });
    });

    describe('getData', () => {
        it('Passes correct method name to inner request with getDataByMethodName method', () => {
            const knimeService = new KnimeService(extensionConfig);
            const jsonDataService = new JSONDataService(knimeService);
            let serviceSpy = jest.spyOn(knimeService, 'callService')
                .mockImplementationOnce(() => Promise.resolve({}));
            jsonDataService.getData('getData', {});
            expect(serviceSpy).toHaveBeenCalledWith(
                RPCNodeServices.CALL_NODE_DATA_SERVICE,
                DataServices.DATA,
                expect.stringContaining('getData')
            );
        });
    });

    describe('registering a data getter callback', () => {
        it('Registers a data getter with the KnimeService', () => {
            const knimeService = new KnimeService(extensionConfig);
            const jsonDataService = new JSONDataService(knimeService);

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
            window.jsonrpc = jest.fn(() => '{}');
            knimeService = new KnimeService(extensionConfig);
            jsonDataService = new JSONDataService(knimeService);
            dataGetter = jest.fn(() => Promise.resolve(mockData));
        });

        afterEach(() => {
            jest.resetAllMocks();
            delete window.jsonrpc;
        });

        it('calls the apply data service when "applyData" is called', async () => {
            let serviceSpy = jest.spyOn(knimeService, 'callService')
                .mockImplementation(() => Promise.resolve('{}'));
            await jsonDataService.applyData();
            expect(serviceSpy).toHaveBeenCalledWith(
                RPCNodeServices.CALL_NODE_DATA_SERVICE,
                DataServices.APPLY_DATA,
                expect.anything()
            );
        });

        it('calls a default data getter if none registered', async () => {
            let serviceSpy = jest.spyOn(knimeService, 'callService')
                .mockImplementation(() => Promise.resolve('{}'));
            await jsonDataService.applyData();
            expect(serviceSpy).toHaveBeenCalledWith(
                RPCNodeServices.CALL_NODE_DATA_SERVICE,
                DataServices.APPLY_DATA,
                'null'
            );
            expect(dataGetter).not.toHaveBeenCalled();
        });

        it('calls the registered data getter (if present)', async () => {
            jsonDataService.registerDataGetter(dataGetter);
            let serviceSpy = jest.spyOn(knimeService, 'callService')
                .mockImplementation(() => Promise.resolve('{}'));
            await jsonDataService.applyData();
            expect(serviceSpy).toHaveBeenCalledWith(
                RPCNodeServices.CALL_NODE_DATA_SERVICE,
                DataServices.APPLY_DATA,
                '"{}"'
            );
            expect(dataGetter).toHaveBeenCalled();
        });
    });
});
