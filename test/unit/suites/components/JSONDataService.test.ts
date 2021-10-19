import { KnimeService } from 'src/services/KnimeService';
import { JSONDataService } from 'src/services/JSONDataService';
import { extensionConfig, rpcInitialData } from 'test/mocks';

describe('JSONDataService initialization', () => {
    it('Creates data service', () => {
        const knime = new KnimeService(extensionConfig);
        const jsonDataService = new JSONDataService(knime);

        expect(jsonDataService).toHaveProperty('getInitialData');
    });
});

describe('JSONDataService initial_data handling', () => {
    it(`Throws error if environment doesn't support rpc`, () => {
        const knime = new KnimeService();
        const jsonDataService = new JSONDataService(knime);

        expect(() => jsonDataService.getInitialData())
            .toThrowError(`Current environment doesn't support window.jsonrpc()`);
    });

    it(`Fetches initial_data if it's passed to constructor`, () => {
        const knime = new KnimeService(extensionConfig);
        const jsonDataService = new JSONDataService(knime);

        expect(jsonDataService.getInitialData()).resolves.toEqual(extensionConfig.initialData);
    });

    it('Fetches initial_data via rpc', () => {
        window.jsonrpc = () => rpcInitialData;
        let rpcSpy = jest.spyOn(window, 'jsonrpc');

        const knime = new KnimeService({
            ...extensionConfig,
            initialData: null
        });
        const jsonDataService = new JSONDataService(knime);

        expect(jsonDataService.getInitialData()).resolves.toEqual({
            settings: extensionConfig.initialData.settings
        });
        expect(rpcSpy).toHaveBeenCalled();
    });
});

describe('JSONDataService getData', () => {
    it('Passes correct method name to inner request with getDataByMethodName method', () => {
        window.jsonrpc = (requestJSON: string) => {
            const request = JSON.parse(requestJSON);

            const innerRequest = JSON.parse(request.params[4]);

            return JSON.stringify({ result: JSON.stringify({ methodName: innerRequest.method }) });
        };
        let rpcSpy = jest.spyOn(window, 'jsonrpc');

        const knime = new KnimeService(extensionConfig);
        const jsonDataService = new JSONDataService(knime);

        expect(jsonDataService.getDataByMethodName('testMethodName')).resolves.toEqual({
            methodName: 'testMethodName'
        });
        expect(rpcSpy).toHaveBeenCalled();
    });

    it('Calls knime.registerGetDataToApply on registering callback', () => {
        const knime = new KnimeService(extensionConfig);
        const jsonDataService = new JSONDataService(knime);

        const spy = jest.spyOn(knime, 'registerGetDataToApply');

        jsonDataService.registerGetDataToApply(() => {});

        expect(spy).toHaveBeenCalled();
    });

    it('Returns value with getData method', () => {
        window.jsonrpc = (requestJSON: string) => {
            const request = JSON.parse(requestJSON);

            const innerRequest = JSON.parse(request.params[4]);

            if (innerRequest.method === 'getData') {
                return JSON.stringify({ result: JSON.stringify({}) });
            }

            const error: any = new Error('Unsupported params');

            throw error;
        };

        const knime = new KnimeService(extensionConfig);
        const jsonDataService = new JSONDataService(knime);

        expect(jsonDataService.getData()).resolves.toEqual({});
    });
});
