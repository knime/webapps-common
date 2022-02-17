import { SelectionService } from 'src/services';
import { KnimeService } from 'src/services/KnimeService';
import { NodeServices, SelectionModes } from 'src/types';
import { extensionConfig } from 'test/mocks';

describe('SelectionService', () => {
    describe('initialization', () => {
        it('Creates selection service', () => {
            const knime = new KnimeService();
            const selectionService = new SelectionService(knime);

            expect(selectionService).toHaveProperty('add');
            expect(selectionService).toHaveProperty('remove');
            expect(selectionService).toHaveProperty('replace');
            expect(selectionService).toHaveProperty('addOnSelectionChangeCallback');
            expect(selectionService).toHaveProperty('removeOnSelectionChangeCallback');
        });
    });

    describe('methods', () => {
        it('Calls selection service add/remove/replace methods with correct params', async () => {
            const callableService = jest.fn().mockReturnValue(
                Promise.resolve(new Promise(res => res({ result: '[]' })))
            );

            const knime = new KnimeService(extensionConfig, callableService);
            const selectionService = new SelectionService(knime);

            const params = ['row1', 'row2', 'row3'];
            await selectionService.add(params);
            expect(callableService.mock.calls[0]).toEqual([
                NodeServices.CALL_NODE_SELECTION_SERVICE,
                SelectionModes.ADD,
                params
            ]);

            await selectionService.remove(params);
            expect(callableService.mock.calls[1]).toEqual([
                NodeServices.CALL_NODE_SELECTION_SERVICE,
                SelectionModes.REMOVE,
                params
            ]);
            await selectionService.replace(params);
            expect(callableService.mock.calls[2]).toEqual([
                NodeServices.CALL_NODE_SELECTION_SERVICE,
                SelectionModes.REPLACE,
                params
            ]);
        });

        it('Adds callback to notification with addOnSelectionChangeCallback', () => {
            const knime = new KnimeService();
            const selectionService = new SelectionService(knime);

            const callback = () => {};

            selectionService.addOnSelectionChangeCallback(callback);

            expect(knime.notificationCallbacksMap.get('SelectionEvent')[0]).toEqual(callback);
        });

        it('Adds jsonrpcNotification callback with addOnSelectionChangeCallback', () => {
            const knime = new KnimeService();
            const selectionService = new SelectionService(knime);

            const callback = () => {};

            selectionService.addOnSelectionChangeCallback(callback);

            expect(knime.notificationCallbacksMap.get('SelectionEvent')[0]).toEqual(callback);
        });

        it('Removes jsonrpcNotification callback with removeOnSelectionChangeCallback', () => {
            const knime = new KnimeService();
            const selectionService = new SelectionService(knime);

            const callback = () => {};

            selectionService.addOnSelectionChangeCallback(callback);
            selectionService.removeOnSelectionChangeCallback(callback);

            expect(knime.notificationCallbacksMap.get('SelectionEvent')).toEqual([]);
        });
    });
});
