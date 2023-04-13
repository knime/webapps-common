import { ref, type Ref } from 'vue';

const preventEvent = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
};

export type DropdownNavigationElement = {
    index: number,
    onClick: () => any;
}

export type DropdownNavigationOptions = {
    /**
     * callback for retreiving the next clickable item and an index
     */
    getNextElement(current: number | null, direction: -1 | 1): DropdownNavigationElement,
    /**
     * method called when the dropdown is to be closed
     */
    close(): void;
    /**
     * disables use of Space key to click on item
     */
    disableSpaceToClick?: boolean
}

type DropdownNavigationOutput = {
    /**
     * current index of the current element. -1 if no element is selected
     */
    currentIndex: Ref<number|null>,
    /**
     * unsets the current element and its index
     */
    resetNavigation: () => void,
    /**
     * callback to be triggered on keydown
     */
    onKeydown: (event: KeyboardEvent) => void;
}

export default ({
    getNextElement,
    close,
    disableSpaceToClick
}: DropdownNavigationOptions): DropdownNavigationOutput => {
    const currentIndex: Ref<number | null> = ref(null);

    const noop = () => {
        // Empty function that doesn't do anything. Used as the default value
        // to initialize or reset the `currentElementClickHandler`
    };

    let currentElementClickHandler: DropdownNavigationElement['onClick'] = noop;

    const resetNavigation = () => {
        currentIndex.value = null;
        currentElementClickHandler = noop;
    };

    const setNextElement = (step: -1 | 1) => {
        const { onClick, index } = getNextElement(currentIndex.value, step);
        currentIndex.value = index;
        currentElementClickHandler = onClick;
    };

    const onKeydown = (event: KeyboardEvent) => {
        switch (event.code) {
            case 'ArrowDown':
                preventEvent(event);
                setNextElement(1);
                break;
            case 'ArrowUp':
                preventEvent(event);
                setNextElement(-1);
                break;
            case 'Enter':
            case 'Space': {
                const isEnter = event.code === 'Enter';
                const isSpace = event.code === 'Space';
                const hasCurrenIndex = currentIndex.value !== null;
                const canClick = isEnter || (isSpace && !disableSpaceToClick);

                if (hasCurrenIndex && canClick) {
                    preventEvent(event);
                    currentElementClickHandler();
                }
                break;
            }
            case 'Escape':
            case 'Tab':
                resetNavigation();
                close();
                break;
        }
    };

    return { onKeydown, currentIndex, resetNavigation };
};
