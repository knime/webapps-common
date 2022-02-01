/**
 * Selection services available by default to UI Extension nodes.
 *
 * @enum {string}
 */
declare enum SelectionServices {
    ADD = "ADD",
    REMOVE = "REMOVE",
    REPLACE = "REPLACE"
}
/**
 * Data services available by default to UI Extension nodes.
 *
 * @enum {string}
 */
declare enum DataServices {
    INITIAL_DATA = "initial_data",
    DATA = "data",
    APPLY_DATA = "apply_data"
}
/**
 * Any Service implemented by a specific UI Extension node.
 */
type ExtensionService = DataServices | SelectionServices | any;
type DataService = DataServices;
type TSelectionService = SelectionServices;
export { SelectionServices, DataServices, ExtensionService, DataService, TSelectionService };
