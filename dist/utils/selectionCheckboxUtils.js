const handlePublishSelectionOnSettingsChange = (selectionService, selectionMode, getSelectionCallback, currentPublishSelection, newPublishSelection) => {
    if (!currentPublishSelection && newPublishSelection) {
        const currentSelection = getSelectionCallback();
        selectionService[selectionMode.toLowerCase()](currentSelection);
    }
};
const handlePublishSelectionOnSelectionChange = (selectionService, selectionMode, rowKeys, currentPublishSelection) => {
    if (currentPublishSelection) {
        selectionService[selectionMode.toLowerCase()](rowKeys);
    }
};
const handleSubscribeToSelectionOnInit = (selectionService, onSelectionChangeCallback, currentSubscribeToSelection) => {
    if (currentSubscribeToSelection) {
        selectionService.addOnSelectionChangeCallback(onSelectionChangeCallback);
    }
};
const handleSubscribeToSelectionOnSettingsChange = (selectionService, onSelectionChangeCallback, clearSelectionCallback, currentSubscribeToSelection, newSubscribeToSelection) => {
    if (newSubscribeToSelection !== currentSubscribeToSelection) {
        const mode = newSubscribeToSelection ? 'addOnSelectionChangeCallback' : 'removeOnSelectionChangeCallback';
        selectionService[mode](onSelectionChangeCallback);
        if (newSubscribeToSelection) {
            selectionService.replace([]);
            clearSelectionCallback();
        }
    }
};

export { handlePublishSelectionOnSelectionChange, handlePublishSelectionOnSettingsChange, handleSubscribeToSelectionOnInit, handleSubscribeToSelectionOnSettingsChange };
