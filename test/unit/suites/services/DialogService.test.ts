import { DialogService } from 'src/services/DialogService';
import { extensionConfig } from 'test/mocks';
import { KnimeService } from 'src/services/KnimeService';

describe('DialogService', () => {
    describe('initialization', () => {
        it('Creates data service', () => {
            const knimeService = new KnimeService(extensionConfig);
            const dialogService = new DialogService(knimeService);

            expect(dialogService).toHaveProperty('getFlowVariableSettings');
        });
    });

    describe('service.getFlowVariableSettings', () => {
        it(`Fetches flowVariablesSettings if it's passed to constructor`, () => {
            const knimeService = new KnimeService(extensionConfig);
            const dialogService = new DialogService(knimeService);

            expect(dialogService.getFlowVariableSettings()).resolves.toEqual(extensionConfig.flowVariableSettings);
        });

        it(`Returns null if extensionConfig is not passed to constructor`, () => {
            const knimeService = new KnimeService();
            const dialogService = new DialogService(knimeService);

            expect(dialogService.getFlowVariableSettings()).resolves.toEqual(null);
        });
    });
});
