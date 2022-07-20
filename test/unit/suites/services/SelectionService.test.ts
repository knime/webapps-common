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
            expect(selectionService).toHaveProperty('onSelectionChange');
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

            expect(knime.notificationCallbacksMap.get('SelectionEvent')[0])
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

        it('Removes jsonrpcNotification callback with removeOnSelectionChangeCallback', () => {
            const knime = new KnimeService();
            const selectionService = new SelectionService(knime);

            const callback = () => {};

            selectionService.addOnSelectionChangeCallback(callback);
            selectionService.removeOnSelectionChangeCallback(callback);

            expect(knime.notificationCallbacksMap.get('SelectionEvent')).toEqual([]);
        });
    });

    describe('selection checkbox handling methods', () => {

        describe('onInit', () => {
            it('initializes onSelectionChangeCallback and adds it to the callbackMap when subscribeToSelection',
            () => {
                const knime = new KnimeService();
                const selectionService = new SelectionService(knime);
                const onSelectionChangeCallback = jest.fn();

                selectionService.onInit(onSelectionChangeCallback, true);
                expect((selectionService as any).onSelectionChangeCallback).toEqual(onSelectionChangeCallback);
                expect((selectionService as any).callbackMap.has(onSelectionChangeCallback)).toEqual(true);
            });
        
        it('initializes onSelectionChangeCallback but doesnt add it to the callbackMap when not subscribeToSelection',
            () => {
                const knime = new KnimeService();
                const selectionService = new SelectionService(knime);
                const onSelectionChangeCallback = jest.fn();

                selectionService.onInit(onSelectionChangeCallback, false);
                expect((selectionService as any).onSelectionChangeCallback).toEqual(onSelectionChangeCallback);
                expect((selectionService as any).callbackMap.has(onSelectionChangeCallback)).toEqual(false);
            });
        });

        describe('onSelectionChange', () => {
            let knime, selectionService, selectionMode, selectedRowKeys, replaceSpy;

            beforeEach(() => {
                const callableService = jest.fn().mockReturnValue(
                    Promise.resolve(new Promise(res => res({ result: '[]' })))
                );
                knime = new KnimeService(extensionConfig, callableService);
                selectionService = new SelectionService(knime);
                selectionMode = SelectionModes.REPLACE;
                selectedRowKeys = ['Row4', 'Row7'];
                replaceSpy = jest.spyOn(selectionService, 'replace');
            })

            it('calls the given mode with the given rowKeys when publishSelection is checked', () => {
                const publishSelection = true;
                selectionService.onSelectionChange(selectionMode, selectedRowKeys, publishSelection);

                expect(replaceSpy).toHaveBeenCalledWith(selectedRowKeys);
            });
        
            it('calls nothing when publishSelection is not checked', () => {
                const publishSelection = false;
                selectionService.onSelectionChange(selectionMode, selectedRowKeys, publishSelection);

                expect(replaceSpy).not.toHaveBeenCalled();
            });
        });

        describe('onSettingsChange', () => {
            let knime, selectionService;

            beforeEach(() => {
                const callableService = jest.fn().mockReturnValue(
                    Promise.resolve(new Promise(res => res({ result: '[]' })))
                );
                knime = new KnimeService(extensionConfig, callableService);
                selectionService = new SelectionService(knime);
            });

            it('replaces the current selection when publishSelection changes to checked', () => {
                const getCurrentSelectionCallback = jest.fn().mockReturnValue(['Row1', 'Row4', 'Row20']);
                const clearSelectionCallback = jest.fn();
                const previousPublishSelection = false;
                const previousSubscribeToSelection = false;
                const viewSettings = { publishSelection: true, subscribeToSelection: false };
    
                const replaceSpy = jest.spyOn(selectionService, 'replace');
    
                selectionService.onSettingsChange(getCurrentSelectionCallback, previousPublishSelection,
                    clearSelectionCallback, previousSubscribeToSelection, viewSettings);
    
                expect(getCurrentSelectionCallback).toHaveBeenCalled();
                expect(replaceSpy).toHaveBeenCalledWith(['Row1', 'Row4', 'Row20']);
            });

            it('does not replace the current selection when publishSelection changes to unchecked', () => {
                const getCurrentSelectionCallback = jest.fn().mockReturnValue(['Row1', 'Row4', 'Row20']);
                const clearSelectionCallback = jest.fn();
                const previousPublishSelection = true;
                const previousSubscribeToSelection = false;
                const viewSettings = { publishSelection: false, subscribeToSelection: false };
    
                const replaceSpy = jest.spyOn(selectionService, 'replace');
    
                selectionService.onSettingsChange(getCurrentSelectionCallback, previousPublishSelection,
                    clearSelectionCallback, previousSubscribeToSelection, viewSettings);
    
                expect(getCurrentSelectionCallback).not.toHaveBeenCalled();
                expect(replaceSpy).not.toHaveBeenCalled();
            });

            it('clears the current selection when subscribeToSelection changes to checked and adds the callback',
                () => {
                    const onSelectionChangeCallback = jest.fn();
                    selectionService.onInit(onSelectionChangeCallback, false);
                    const getCurrentSelectionCallback = jest.fn().mockReturnValue(['Row1', 'Row4', 'Row20']);
                    const clearSelectionCallback = jest.fn();
                    const previousPublishSelection = false;
                    const previousSubscribeToSelection = false;
                    const viewSettings = { publishSelection: false, subscribeToSelection: true };
        
                    const addOnSelectionChangeCallbackSpy = jest.spyOn(selectionService, 'addOnSelectionChangeCallback');
                    const replaceSpy = jest.spyOn(selectionService, 'replace');
        
                    selectionService.onSettingsChange(getCurrentSelectionCallback, previousPublishSelection,
                        clearSelectionCallback, previousSubscribeToSelection, viewSettings);
        
                    
                    expect(addOnSelectionChangeCallbackSpy).toHaveBeenCalledWith(onSelectionChangeCallback);
                    expect(replaceSpy).toHaveBeenCalledWith([]);
                    expect(clearSelectionCallback).toHaveBeenCalled();
                });

            it('does not clear the selection when subscribeToSelection changes to unchecked and removes the callback',
                () => {
                    const onSelectionChangeCallback = jest.fn();
                    selectionService.onInit(onSelectionChangeCallback, false);
                    const getCurrentSelectionCallback = jest.fn().mockReturnValue(['Row1', 'Row4', 'Row20']);
                    const clearSelectionCallback = jest.fn();
                    const previousPublishSelection = false;
                    const previousSubscribeToSelection = true;
                    const viewSettings = { publishSelection: false, subscribeToSelection: false };
        
                    const removeOnSelectionChangeCallbackSpy = jest.spyOn(selectionService, 'removeOnSelectionChangeCallback');
                    const replaceSpy = jest.spyOn(selectionService, 'replace');
        
                    selectionService.onSettingsChange(getCurrentSelectionCallback, previousPublishSelection,
                        clearSelectionCallback, previousSubscribeToSelection, viewSettings);
        
                    
                    expect(removeOnSelectionChangeCallbackSpy).toHaveBeenCalledWith(onSelectionChangeCallback);
                    expect(replaceSpy).not.toHaveBeenCalled();
                    expect(clearSelectionCallback).not.toHaveBeenCalled();
                });

            it('calls nothing when subscribe/publish-ToSelection were not changed', () => {
                const onSelectionChangeCallback = jest.fn();
                selectionService.onInit(onSelectionChangeCallback, false);
                const getCurrentSelectionCallback = jest.fn().mockReturnValue(['Row1', 'Row4', 'Row20']);
                const clearSelectionCallback = jest.fn();
                const previousPublishSelection = false;
                const previousSubscribeToSelection = false;
                const viewSettings = { publishSelection: false, subscribeToSelection: false };
    
                const addOnSelectionChangeCallbackSpy = jest.spyOn(selectionService, 'addOnSelectionChangeCallback');
                const removeOnSelectionChangeCallbackSpy = jest.spyOn(selectionService, 'removeOnSelectionChangeCallback');
                const replaceSpy = jest.spyOn(selectionService, 'replace');
    
                selectionService.onSettingsChange(getCurrentSelectionCallback, previousPublishSelection,
                    clearSelectionCallback, previousSubscribeToSelection, viewSettings);
    
                expect(addOnSelectionChangeCallbackSpy).not.toHaveBeenCalled();
                expect(removeOnSelectionChangeCallbackSpy).not.toHaveBeenCalled();
                expect(replaceSpy).not.toHaveBeenCalled();
                expect(getCurrentSelectionCallback).not.toHaveBeenCalled();
                expect(clearSelectionCallback).not.toHaveBeenCalled();
            });
        });
    });
});
