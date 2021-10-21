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
            jsonDataService.getDataByMethodName('getData', {});
            expect(serviceSpy).toHaveBeenCalledWith(
                RPCNodeServices.CALL_NODE_DATA_SERVICE,
                DataServices.DATA,
                expect.stringContaining('getData')
            );
        });

        it('Calls knime.registerGetDataToApply on registering callback', () => {
            const knimeService = new KnimeService(extensionConfig);
            const jsonDataService = new JSONDataService(knimeService);

            const spy = jest.spyOn(knimeService, 'registerGetDataToApply');

            jsonDataService.registerGetDataToApply(() => {});

            expect(spy).toHaveBeenCalled();
        });

        it('Returns value with getData method', () => {
            const knimeService = new KnimeService(extensionConfig);
            const jsonDataService = new JSONDataService(knimeService);
            jest.spyOn(knimeService, 'callService').mockImplementation(() => Promise.resolve({}));
            expect(jsonDataService.getData()).resolves.toEqual({});
        });
    });
});
