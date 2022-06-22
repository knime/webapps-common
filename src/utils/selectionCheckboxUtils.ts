import { SelectionService } from 'src/services';
import { SelectionModes } from 'src/types';

export const handlePublishSelectionOnSettingsChange = (selectionService: SelectionService,
    selectionMode: SelectionModes, getSelectionCallback: Function, currentPublishSelection: boolean | undefined,
    newPublishSelection: boolean | undefined) => {
    if (!currentPublishSelection && newPublishSelection) {
        const currentSelection = getSelectionCallback();
        (<any>selectionService)[selectionMode.toLowerCase()](currentSelection);
    }
};

export const handlePublishSelectionOnSelectionChange = (selectionService: SelectionService,
    selectionMode: SelectionModes, rowKeys: string[], currentPublishSelection: boolean | undefined) => {
    if (currentPublishSelection) {
        (<any>selectionService)[selectionMode.toLowerCase()](rowKeys);
    }
};

export const handleSubscribeToSelectionOnInit = (selectionService: SelectionService,
    onSelectionChangeCallback: (any: any) => void, currentSubscribeToSelection: boolean | undefined) => {
    if (currentSubscribeToSelection) {
        selectionService.addOnSelectionChangeCallback(onSelectionChangeCallback);
    }
};

export const handleSubscribeToSelectionOnSettingsChange = (selectionService: SelectionService,
    onSelectionChangeCallback: (any: any) => void, clearSelectionCallback: () => void,
    currentSubscribeToSelection: boolean | undefined, newSubscribeToSelection: boolean | undefined) => {
    if (newSubscribeToSelection !== currentSubscribeToSelection) {
        const mode = newSubscribeToSelection ? 'addOnSelectionChangeCallback' : 'removeOnSelectionChangeCallback';
        selectionService[mode](onSelectionChangeCallback);
        if (newSubscribeToSelection) {
            selectionService.replace([]);
            clearSelectionCallback();
        }
    }
};
