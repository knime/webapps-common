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
        expect(selectionService).toHaveProperty('registerOnSelectionChangeCallback');
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

    it('Registers jsonrpcNotification with registerOnSelectionChangeCallback', () => {
        const knime = new KnimeService();
        const selectionService = new SelectionService(knime);

        const callback = () => {};

        selectionService.registerOnSelectionChangeCallback(callback);

        expect(window.jsonrpcNotification).toEqual(callback);
    });
});
