import { ComponentKnimeService, SelectionService } from 'src/services';
import { NodeServiceMethods, SelectionServiceTypes } from 'src/types';
import { extensionConfig } from 'test/mocks';

window.jsonrpc = () => JSON.stringify({ result: JSON.stringify({}) });

describe('SelectionService', () => {
    describe('initialization', () => {
        it('Creates selection service', () => {
            const knime = new ComponentKnimeService();
            const selectionService = new SelectionService(knime);

            expect(selectionService).toHaveProperty('add');
            expect(selectionService).toHaveProperty('remove');
            expect(selectionService).toHaveProperty('replace');
            expect(selectionService).toHaveProperty('addOnSelectionChangeCallback');
            expect(selectionService).toHaveProperty('removeOnSelectionChangeCallback');
        });
    });

    describe('methods', () => {
        beforeEach(() => {
            window.jsonrpcNotification = null;
        });

        it('Calls selection service add/remove/replace methods with correct params', () => {
            const knime = new ComponentKnimeService(extensionConfig);
            const selectionService = new SelectionService(knime);
            const callService = jest.spyOn(knime, 'callService');

            const params = ['row1', 'row2', 'row3'];
            selectionService.add(params);
            let invocationParameters = callService.mock.calls[0][0];
            expect(invocationParameters.method).toBe(NodeServiceMethods.CALL_NODE_SELECTION_SERVICE);
            expect(invocationParameters.params).toContain(SelectionServiceTypes.ADD);
            expect(invocationParameters.params).toContainEqual(params);

            selectionService.remove(params);
            invocationParameters = callService.mock.calls[1][0];
            expect(invocationParameters.method).toBe(NodeServiceMethods.CALL_NODE_SELECTION_SERVICE);
            expect(invocationParameters.params).toContain(SelectionServiceTypes.REMOVE);
            expect(invocationParameters.params).toContainEqual(params);

            selectionService.replace(params);
            invocationParameters = callService.mock.calls[2][0];
            expect(invocationParameters.method).toBe(NodeServiceMethods.CALL_NODE_SELECTION_SERVICE);
            expect(invocationParameters.params).toContain(SelectionServiceTypes.REPLACE);
            expect(invocationParameters.params).toContainEqual(params);
        });

        it('Adds callback to notification with addOnSelectionChangeCallback', () => {
            const knime = new ComponentKnimeService();
            const selectionService = new SelectionService(knime);

            const callback = () => {};

            selectionService.addOnSelectionChangeCallback(callback);

            expect(knime.notificationCallbacksMap.get('SelectionEvent')[0]).toEqual(callback);
        });

        it('Adds jsonrpcNotification callback with addOnSelectionChangeCallback', () => {
            const knime = new ComponentKnimeService();
            const selectionService = new SelectionService(knime);

            const callback = () => {};

            selectionService.addOnSelectionChangeCallback(callback);

            expect(knime.notificationCallbacksMap.get('SelectionEvent')[0]).toEqual(callback);
        });

        it('Removes jsonrpcNotification callback with removeOnSelectionChangeCallback', () => {
            const knime = new ComponentKnimeService();
            const selectionService = new SelectionService(knime);

            const callback = () => {};

            selectionService.addOnSelectionChangeCallback(callback);
            selectionService.removeOnSelectionChangeCallback(callback);

            expect(knime.notificationCallbacksMap.get('SelectionEvent')).toEqual([]);
        });
    });
});
