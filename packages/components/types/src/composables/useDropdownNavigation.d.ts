import { type Ref } from "vue";
export type DropdownNavigationElement = {
    index: number;
    onClick: () => any;
};
export type DropdownNavigationOptions = {
    /**
     * callback for retrieving the next clickable item and an index
     */
    getNextElement(current: number | null, direction: -1 | 1): DropdownNavigationElement;
    /**
     * callback for retrieving the first clickable item and an index.
     * When provided, navigating to this item via the home key is possible
     */
    getFirstElement?(): DropdownNavigationElement;
    /**
     * callback for retrieving the last clickable item and an index.
     * When provided, navigating to this item via the end key is possible
     */
    getLastElement?(): DropdownNavigationElement;
    /**
     * method called when the dropdown is to be closed
     */
    close(): void;
    /**
     * disables use of Space key to click on item
     */
    disableSpaceToClick?: boolean;
    /**
     * Per default, the dropdown will trigger close when tabbing out of it.
     * Set this to true to keep the dropdown open when tabbing
     */
    keepOpenedOnTab?: boolean;
};
type DropdownNavigationOutput = {
    /**
     * current index of the current element. -1 if no element is selected
     */
    currentIndex: Ref<number | null>;
    /**
     * unsets the current element and its index
     */
    resetNavigation: () => void;
    /**
     * callback to be triggered on keydown
     */
    onKeydown: (event: KeyboardEvent) => void;
};
declare const _default: ({ getNextElement, getFirstElement, getLastElement, close, disableSpaceToClick, keepOpenedOnTab, }: DropdownNavigationOptions) => DropdownNavigationOutput;
export default _default;
