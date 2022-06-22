import { SelectionService } from "../index-fdcc8875";
import { SelectionModes } from "../index-92dc325b";
declare const handlePublishSelectionOnSettingsChange: (selectionService: SelectionService, selectionMode: SelectionModes, getSelectionCallback: Function, currentPublishSelection: boolean | undefined, newPublishSelection: boolean | undefined) => void;
declare const handlePublishSelectionOnSelectionChange: (selectionService: SelectionService, selectionMode: SelectionModes, rowKeys: string[], currentPublishSelection: boolean | undefined) => void;
declare const handleSubscribeToSelectionOnInit: (selectionService: SelectionService, onSelectionChangeCallback: (any: any) => void, currentSubscribeToSelection: boolean | undefined) => void;
declare const handleSubscribeToSelectionOnSettingsChange: (selectionService: SelectionService, onSelectionChangeCallback: (any: any) => void, clearSelectionCallback: () => void, currentSubscribeToSelection: boolean | undefined, newSubscribeToSelection: boolean | undefined) => void;
export { handlePublishSelectionOnSettingsChange, handlePublishSelectionOnSelectionChange, handleSubscribeToSelectionOnInit, handleSubscribeToSelectionOnSettingsChange };
