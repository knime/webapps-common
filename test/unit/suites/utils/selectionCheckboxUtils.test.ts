import { SelectionService } from 'src';
import { SelectionModes } from 'src/types';
import { handlePublishSelectionOnSettingsChange, handlePublishSelectionOnSelectionChange,
    handleSubscribeToSelectionOnInit, handleSubscribeToSelectionOnSettingsChange }
    from 'src/utils/selectionCheckboxUtils';

describe('selectionCheckboxUtils', () => {
    let selectionServiceMock: jest.Mocked<SelectionService>;

    beforeEach(() => {
        const original = jest.requireActual('src/services/SelectionService');
        selectionServiceMock = {
            ...original,
            add: jest.fn(),
            replace: jest.fn(),
            remove: jest.fn(),
            addOnSelectionChangeCallback: jest.fn(),
            removeOnSelectionChangeCallback: jest.fn()
        };
    });

    describe('handlePublishSelectionOnSettingsChange', () => {
        it('calls the selection service with correct parameters when publishSelection changes to checked', () => {
            const rowKeysRemove = ['Row1', 'Row3', 'Row5'];
            handlePublishSelectionOnSettingsChange(selectionServiceMock, SelectionModes.REMOVE, () => rowKeysRemove,
                false, true);
            expect(selectionServiceMock.remove).toHaveBeenCalledWith(rowKeysRemove);
        });

        it('does not call the selection service when publishSelection changes to unchecked', () => {
            const rowKeysAdd = ['Row1', 'Row3', 'Row5'];
            handlePublishSelectionOnSettingsChange(selectionServiceMock, SelectionModes.ADD, () => rowKeysAdd, true,
                false);
            expect(selectionServiceMock.add).not.toHaveBeenCalled();
        });

        it('does not call the selection service when publishSelection does not change', () => {
            const rowKeysAdd = ['Row1', 'Row3', 'Row5'];
            handlePublishSelectionOnSettingsChange(selectionServiceMock, SelectionModes.ADD, () => rowKeysAdd, true,
                true);
            expect(selectionServiceMock.add).not.toHaveBeenCalled();
            handlePublishSelectionOnSettingsChange(selectionServiceMock, SelectionModes.ADD, () => rowKeysAdd, false,
                false);
            expect(selectionServiceMock.add).not.toHaveBeenCalled();
        });
    });

    describe('handlePublishSelectionOnSelectionChange', () => {
        it('calls the selection service with correct parameters when publishSelection is checked', () => {
            const rowKeysRemove = ['Row1', 'Row3', 'Row5'];
            handlePublishSelectionOnSelectionChange(selectionServiceMock, SelectionModes.REMOVE, rowKeysRemove, true);
            expect(selectionServiceMock.remove).toHaveBeenCalledWith(rowKeysRemove);
        });

        it('does not call the selection service when publishSelection is unchecked', () => {
            const rowKeysAdd = ['Row1', 'Row3', 'Row5'];
            handlePublishSelectionOnSelectionChange(selectionServiceMock, SelectionModes.ADD, rowKeysAdd, false);
            expect(selectionServiceMock.add).not.toHaveBeenCalled();
        });
    });

    describe('handleSubscribeToSelectionOnInit', () => {
        const callbackMock = jest.fn();

        it('calls addOnSelectionChangeCallback when subscribeToSelection is checked', () => {
            handleSubscribeToSelectionOnInit(selectionServiceMock, callbackMock, true);
            expect(selectionServiceMock.addOnSelectionChangeCallback).toHaveBeenCalledWith(callbackMock);
        });

        it('does not call the selectionService when subscribeToSelection is unchecked', () => {
            handleSubscribeToSelectionOnInit(selectionServiceMock, callbackMock, false);
            expect(selectionServiceMock.addOnSelectionChangeCallback).not.toHaveBeenCalled();
        });
    });

    describe('handleSubscribeToSelectionOnSettingsChange', () => {
        const callbackMock = jest.fn();
        const clearSelectionCallbackMock = jest.fn();

        it('calls addOnSelectionChangeCallback and removes the selection if subscribeToSelection changes to checked',
            () => {
                handleSubscribeToSelectionOnSettingsChange(selectionServiceMock, callbackMock,
                    clearSelectionCallbackMock, false, true);
                expect(selectionServiceMock.addOnSelectionChangeCallback).toHaveBeenCalledWith(callbackMock);
                expect(selectionServiceMock.replace).toHaveBeenCalledWith([]);
            });

        it('calls removeOnSelectionChangeCallback when subscribeToSelection changes to unchecked', () => {
            handleSubscribeToSelectionOnSettingsChange(selectionServiceMock, callbackMock, clearSelectionCallbackMock,
                true, false);
            expect(selectionServiceMock.removeOnSelectionChangeCallback).toHaveBeenCalledWith(callbackMock);
            expect(selectionServiceMock.replace).not.toHaveBeenCalled();
        });

        it('does not call the selectionService when subscribeToSelection has the same value as before', () => {
            handleSubscribeToSelectionOnSettingsChange(selectionServiceMock, callbackMock, clearSelectionCallbackMock,
                false, false);
            expect(selectionServiceMock.addOnSelectionChangeCallback).not.toHaveBeenCalled();
            expect(selectionServiceMock.removeOnSelectionChangeCallback).not.toHaveBeenCalled();

            handleSubscribeToSelectionOnSettingsChange(selectionServiceMock, callbackMock, clearSelectionCallbackMock,
                true, true);
            expect(selectionServiceMock.addOnSelectionChangeCallback).not.toHaveBeenCalled();
            expect(selectionServiceMock.removeOnSelectionChangeCallback).not.toHaveBeenCalled();
        });
    });
});
