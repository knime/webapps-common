import { ref, type Ref } from 'vue';

const preventEvent = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
};

export type DropdownNavigationElement = {
    index: number,
    element: HTMLElement
}

export type DropdownNavigationMethods = {
    // callback for retreiving the next clickable item and an index
    getNextElement(current: number | null, direction: -1 | 1): DropdownNavigationElement,
    // method called when the dropdown is to be closed
    close(): void
}

type DropdownNavigationOutput = {
    // current index of the current element. -1 if no element is selected
    currentIndex: Ref<number|null>,
    // unsets the current element and its index
    resetNavigation: () => void,
    // callback to be triggered on keydown
    onKeydown: (event: KeyboardEvent) => void;
}

export default ({ getNextElement, close }: DropdownNavigationMethods): DropdownNavigationOutput => {
    const currentIndex: Ref<number|null> = ref(null);
    const currentElement: Ref<HTMLElement | null> = ref(null);

    const resetNavigation = () => {
        currentIndex.value = null;
        currentElement.value = null;
    };

    const setNextElement = (step: -1 | 1) => {
        const { element, index } = getNextElement(currentIndex.value, step);
        currentIndex.value = index;
        currentElement.value = element;
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
            case 'Space':
                if (currentElement.value) {
                    preventEvent(event);
                    currentElement.value.click();
                }
                break;
            case 'Escape':
            case 'Tab':
                resetNavigation();
                close();
                break;
        }
    };
    
    return { onKeydown, currentIndex, resetNavigation };
};
