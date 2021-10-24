import { KnimeService, SelectionService } from 'src/services';
import { JSONRpcServices, SelectionServiceMethods } from 'src/types';

window.jsonrpc = () => JSON.stringify({ result: JSON.stringify({}) });

describe('SelectionService initialization', () => {
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

describe('SelectionService methods', () => {
    it('Calls selection service add/remove/replace methods with correct params', () => {
        const knime = new KnimeService();
        const selectionService = new SelectionService(knime);
        const callService = jest.spyOn(knime, 'callService');

        const params = ['row1', 'row2', 'row3'];

        selectionService.add(params);
        expect(callService).toBeCalledWith(
            JSONRpcServices.CALL_NODE_SELECT_DATA_POINTS,
            SelectionServiceMethods.ADD,
            params
        );

        selectionService.remove(params);
        expect(callService).toBeCalledWith(
            JSONRpcServices.CALL_NODE_SELECT_DATA_POINTS,
            SelectionServiceMethods.REMOVE,
            params
        );

        selectionService.replace(params);
        expect(callService).toBeCalledWith(
            JSONRpcServices.CALL_NODE_SELECT_DATA_POINTS,
            SelectionServiceMethods.REPLACE,
            params
        );
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
