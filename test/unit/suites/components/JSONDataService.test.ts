import { KnimeService } from 'src/services/KnimeService';
import { JSONDataService } from 'src/services/JSONDataService';
import { extInfo, rpcInitialData } from 'test/mocks';

describe('JSONDataService', () => {
    it('Creates data service', () => {
        const knime = new KnimeService(extInfo);
        const jsonDataService = new JSONDataService(knime);

        expect(jsonDataService).toHaveProperty('getInitialData');
    });

    it(`Throws error if environment doesn't support rpc and no extInfo provided`, () => {
        const knime = new KnimeService();
        const jsonDataService = new JSONDataService(knime);

        try {
            jsonDataService.getInitialData();
        } catch (e) {
            expect(e).toEqual(new Error(`Current environment doesn't support window.jsonrpc()`));
        }
    });

    it(`Fetches initial_data if it's passed to constructor`, () => {
        const knime = new KnimeService(extInfo);
        const jsonDataService = new JSONDataService(knime);

        expect(jsonDataService.getInitialData()).resolves.toEqual(extInfo.initData);
    });

    it('Fetches initial_data via rpc', () => {
        window.jsonrpc = () => rpcInitialData;

        const knime = new KnimeService();
        const jsonDataService = new JSONDataService(knime);

        expect(jsonDataService.getInitialData()).resolves.toEqual({
            settings: extInfo.initData.settings
        });
    });

    it('getDataByMethodName inner request method should be passed correctly', () => {
        window.jsonrpc = (requestJSON: string) => {
            const request = JSON.parse(requestJSON);

            const innerRequest = JSON.parse(request.params[4]);

            return JSON.stringify({ result: JSON.stringify({ methodName: innerRequest.method }) });
        };

        const knime = new KnimeService();
        const jsonDataService = new JSONDataService(knime);

        expect(jsonDataService.getDataByMethodName('testMethodName')).resolves.toEqual({
            methodName: 'testMethodName'
        });
    });

    it('getData returns value', () => {
        window.jsonrpc = (requestJSON: string) => {
            const request = JSON.parse(requestJSON);

            const innerRequest = JSON.parse(request.params[4]);

            if (innerRequest.method === 'getData') {
                return JSON.stringify({ result: JSON.stringify({}) });
            }

            const error: any = new Error('Unsupported params');

            throw error;
        };

        const knime = new KnimeService();
        const jsonDataService = new JSONDataService(knime);

        expect(jsonDataService.getData()).resolves.toEqual({});
    });
});
