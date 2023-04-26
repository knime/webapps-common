import { SelectionService } from 'src/services';
import { KnimeService } from 'src/services/KnimeService';
import { ExtensionConfig, NodeServices, SelectionModes } from 'src/types';
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
            expect(selectionService).toHaveProperty('onInit');
            expect(selectionService).toHaveProperty('onSettingsChange');
            expect(selectionService).toHaveProperty('publishOnSelectionChange');
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

        it('Adds callback to event with addOnSelectionChangeCallback', () => {
            const knime = new KnimeService();
            const selectionService = new SelectionService(knime);

            const callback = () => {};

            selectionService.addOnSelectionChangeCallback(callback);

            expect(knime.eventCallbacksMap.get('SelectionEvent')[0])
                .toEqual((selectionService as any).callbackMap.get(callback));
        });

        it('wraps selection callbacks to filter events by nodeId', () => {
            const testPayload = { key: 'someValue' };
            const nodeId = '123';
            const extensionConfig = { nodeId } as ExtensionConfig;
            const knime = new KnimeService(extensionConfig);
            const selectionService = new SelectionService(knime);

            const callback = jest.fn();

            selectionService.addOnSelectionChangeCallback(callback);

            const wrappedCallback = (selectionService as any).callbackMap.get(callback);

            wrappedCallback({ nodeId: '321', params: [testPayload] });
            expect(callback).not.toHaveBeenCalled();
            wrappedCallback({ nodeId, params: [testPayload] });
            expect(callback).not.toHaveBeenCalledWith(testPayload);
        });

        it('Removes event callback with removeOnSelectionChangeCallback', () => {
            const knime = new KnimeService();
            const selectionService = new SelectionService(knime);

            const callback = () => {};

            selectionService.addOnSelectionChangeCallback(callback);
            selectionService.removeOnSelectionChangeCallback(callback);

            expect(knime.eventCallbacksMap.get('SelectionEvent')).toEqual([]);
        });
    });

    describe('selection checkbox handling methods', () => {
        describe('onInit', () => {
            let knime, selectionService, onSelectionChangeCallback;

            beforeEach(() => {
                const callableService = jest.fn().mockReturnValue(
                    Promise.resolve(new Promise(res => res({ result: '[]' })))
                );
                knime = new KnimeService(extensionConfig, callableService);
                selectionService = new SelectionService(knime);
                onSelectionChangeCallback = jest.fn();
            });

            it('initializes onSelectionChangeCallback and adds it to the callbackMap when subscribeToSelection',
                () => {
                    const publishSelection = false;
                    const subscribeToSelection = true;

                    selectionService.onInit(onSelectionChangeCallback, publishSelection, subscribeToSelection);
                    expect((selectionService as any).onSelectionChangeCallback).toEqual(onSelectionChangeCallback);
                    expect((selectionService as any).callbackMap.has(onSelectionChangeCallback)).toEqual(true);
                    expect((selectionService as any).currentPublishSelection).toEqual(publishSelection);
                    expect((selectionService as any).currentSubscribeToSelection).toEqual(subscribeToSelection);
                });
        
            it('initializes onSelectionChangeCallback but doesnt add it to the callbackMap when not subscribe',
                () => {
                    const publishSelection = false;
                    const subscribeToSelection = false;

                    selectionService.onInit(onSelectionChangeCallback, publishSelection, subscribeToSelection);
                    expect((selectionService as any).onSelectionChangeCallback).toEqual(onSelectionChangeCallback);
                    expect((selectionService as any).callbackMap.has(onSelectionChangeCallback)).toEqual(false);
                    expect((selectionService as any).currentPublishSelection).toEqual(publishSelection);
                    expect((selectionService as any).currentSubscribeToSelection).toEqual(subscribeToSelection);
                });
        });

        describe('onSelectionChange', () => {
            let knime, selectionService, onSelectionChangeCallback, selectionMode, selectedRowKeys, replaceSpy;

            beforeEach(() => {
                const callableService = jest.fn().mockReturnValue(
                    Promise.resolve(new Promise(res => res({ result: '[]' })))
                );
                knime = new KnimeService(extensionConfig, callableService);
                selectionService = new SelectionService(knime);
                onSelectionChangeCallback = jest.fn();
                selectionMode = SelectionModes.REPLACE;
                selectedRowKeys = ['Row4', 'Row7'];
                replaceSpy = jest.spyOn(selectionService, 'replace');
            });

            it('calls the given mode with the given rowKeys when publishSelection is checked', () => {
                selectionService.onInit(onSelectionChangeCallback, true, false);
                selectionService.publishOnSelectionChange(selectionMode, selectedRowKeys);

                expect(replaceSpy).toHaveBeenCalledWith(selectedRowKeys);
            });
        
            it('calls nothing when publishSelection is not checked', () => {
                selectionService.onInit(onSelectionChangeCallback, false, false);
                selectionService.publishOnSelectionChange(selectionMode, selectedRowKeys);

                expect(replaceSpy).not.toHaveBeenCalled();
            });
        });

        describe('onSettingsChange', () => {
            let knime, selectionService, onSelectionChangeCallback, getCurrentSelectionCallback, clearSelectionCallback,
                replaceSpy;

            beforeEach(() => {
                const callableService = jest.fn().mockReturnValue(
                    Promise.resolve(new Promise(res => res({ result: '[]' })))
                );
                knime = new KnimeService(extensionConfig, callableService);
                selectionService = new SelectionService(knime);
                onSelectionChangeCallback = jest.fn();
                getCurrentSelectionCallback = jest.fn().mockReturnValue(['Row1', 'Row4', 'Row20']);
                clearSelectionCallback = jest.fn();
                replaceSpy = jest.spyOn(selectionService, 'replace');
            });

            it('replaces the current selection when publishSelection changes to checked, updates local selection vars'
                , () => {
                    const previousPublishSelection = false;
                    const previousSubscribeToSelection = false;
                    const newPublishSelection = true;
                    const newSubscribeToSelection = false;
        
                    selectionService.onInit(onSelectionChangeCallback, previousPublishSelection,
                        previousSubscribeToSelection);
                    selectionService.onSettingsChange(getCurrentSelectionCallback, clearSelectionCallback,
                        newPublishSelection, newSubscribeToSelection);
        
                    expect(getCurrentSelectionCallback).toHaveBeenCalled();
                    expect(replaceSpy).toHaveBeenCalledWith(['Row1', 'Row4', 'Row20']);
                    expect((selectionService as any).currentPublishSelection).toEqual(newPublishSelection);
                    expect((selectionService as any).currentSubscribeToSelection).toEqual(newSubscribeToSelection);
                });

            it('does not replace the current selection when publishSelection changes to unchecked', () => {
                const previousPublishSelection = true;
                const previousSubscribeToSelection = false;
                const newPublishSelection = false;
                const newSubscribeToSelection = false;
    
                selectionService.onInit(onSelectionChangeCallback, previousPublishSelection,
                    previousSubscribeToSelection);
                selectionService.onSettingsChange(getCurrentSelectionCallback, clearSelectionCallback,
                    newPublishSelection, newSubscribeToSelection);
    
                expect(getCurrentSelectionCallback).not.toHaveBeenCalled();
                expect(replaceSpy).not.toHaveBeenCalled();
                expect((selectionService as any).currentPublishSelection).toEqual(newPublishSelection);
                expect((selectionService as any).currentSubscribeToSelection).toEqual(newSubscribeToSelection);
            });

            it('clears the current selection when subscribeToSelection changes to checked and adds the callback',
                () => {
                    const previousPublishSelection = false;
                    const previousSubscribeToSelection = false;
                    const newPublishSelection = false;
                    const newSubscribeToSelection = true;
                    const addOnSelectionChangeCallbackSpy = jest.spyOn(selectionService,
                        'addOnSelectionChangeCallback');
        
                    selectionService.onInit(onSelectionChangeCallback, previousPublishSelection,
                        previousSubscribeToSelection);
                    selectionService.onSettingsChange(getCurrentSelectionCallback, clearSelectionCallback,
                        newPublishSelection, newSubscribeToSelection);
                    
                    expect(addOnSelectionChangeCallbackSpy).toHaveBeenCalledWith(onSelectionChangeCallback);
                    expect(replaceSpy).toHaveBeenCalledWith([]);
                    expect(clearSelectionCallback).toHaveBeenCalled();
                    expect((selectionService as any).currentPublishSelection).toEqual(newPublishSelection);
                    expect((selectionService as any).currentSubscribeToSelection).toEqual(newSubscribeToSelection);
                });

            it('does not clear the selection when subscribeToSelection changes to unchecked and removes the callback',
                () => {
                    const previousPublishSelection = false;
                    const previousSubscribeToSelection = true;
                    const newPublishSelection = false;
                    const newSubscribeToSelection = false;
                    const removeOnSelectionChangeCallbackSpy = jest.spyOn(selectionService,
                        'removeOnSelectionChangeCallback');
        
                    selectionService.onInit(onSelectionChangeCallback, previousPublishSelection,
                        previousSubscribeToSelection);
                    selectionService.onSettingsChange(getCurrentSelectionCallback, clearSelectionCallback,
                        newPublishSelection, newSubscribeToSelection);
                    
                    expect(removeOnSelectionChangeCallbackSpy).toHaveBeenCalledWith(onSelectionChangeCallback);
                    expect(replaceSpy).not.toHaveBeenCalled();
                    expect(clearSelectionCallback).not.toHaveBeenCalled();
                    expect((selectionService as any).currentPublishSelection).toEqual(newPublishSelection);
                    expect((selectionService as any).currentSubscribeToSelection).toEqual(newSubscribeToSelection);
                });

            it('calls nothing when subscribe/publish-ToSelection were not changed', () => {
                const previousPublishSelection = false;
                const previousSubscribeToSelection = false;
                const newPublishSelection = false;
                const newSubscribeToSelection = false;
    
                const addOnSelectionChangeCallbackSpy = jest.spyOn(selectionService, 'addOnSelectionChangeCallback');
                const removeOnSelectionChangeCallbackSpy = jest.spyOn(selectionService,
                    'removeOnSelectionChangeCallback');
    
                selectionService.onInit(onSelectionChangeCallback, previousPublishSelection,
                    previousSubscribeToSelection);
                selectionService.onSettingsChange(getCurrentSelectionCallback, clearSelectionCallback,
                    newPublishSelection, newSubscribeToSelection);
    
                expect(addOnSelectionChangeCallbackSpy).not.toHaveBeenCalled();
                expect(removeOnSelectionChangeCallbackSpy).not.toHaveBeenCalled();
                expect(replaceSpy).not.toHaveBeenCalled();
                expect(getCurrentSelectionCallback).not.toHaveBeenCalled();
                expect(clearSelectionCallback).not.toHaveBeenCalled();
            });
        });
    });
});
