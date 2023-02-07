import { onMounted, ref } from 'vue';

const useEventListener = (target, event, callback) => {
    onMounted(() => {
        target.value.addEventListener(event, callback);
    });
};

const preventEvent = (event) => {
    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();
};

/**
 * @param { Object } params
 * @param { VueElement.ref } params.baseElement the element to have an event listener for keyboard navigation
 * @param { Function } params.getNextElement
 *  a callback for retreiving the next clickable item and an index
 * @param { Function } close a method called when the dropdown is to be closed
 * @return { VueElement.ref } output.currentMarkedIndex the current index of the marked element. -1 if nothing is marked
 * @return { Function } output.resetNavigation a method that can be invoked to unmark the current marked item.
 */
export default ({ baseElement, getNextElement, close }) => {
    const currentMarkedIndex = ref(-1);
    const currentMarkedElement = ref(null);

    const resetNavigation = () => {
        currentMarkedIndex.value = -1;
        currentMarkedElement.value = null;
    };

    const setNextElement = (step) => {
        const { element, index } = getNextElement(currentMarkedIndex.value, step);
        currentMarkedIndex.value = index;
        currentMarkedElement.value = element;
    };
    
    const onKeydown = (event) => {
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
                if (currentMarkedElement.value) {
                    preventEvent(event);
                    currentMarkedElement.value.click();
                }
                break;
            case 'Escape':
            case 'Tab':
                resetNavigation();
                close();
                break;
        }
    };
    
    useEventListener(baseElement, 'keydown', onKeydown);

    return { currentMarkedIndex, resetNavigation };
};
