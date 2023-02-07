import { onMounted, onUnmounted, ref, unref } from 'vue';

import { createPopper } from '@popperjs/core/dist/esm';

/**
 * @param { Object } elements
 * @param { VueElement.ref } elements.popperTarget the element to create a popover from
 * @param { VueElement.ref  } elements.referenceEl the element to which the popover is positioned
 * @param { Object | VueElement.ref } options the options of the popper
 * @returns { VueElement.ref } output.popperInstance a reference to the created instance
 * @returns { Function } output.updatePopper a method updating the popperInstance
 */
export default ({ popperTarget, referenceEl }, options) => {
    const popperInstance = ref(null);
        
    const activatePopper = () => {
        popperInstance.value = createPopper(referenceEl.value, popperTarget.value, unref(options));
    };
    onMounted(activatePopper);
    const destroyPopper = () => {
        if (popperInstance.value) {
            popperInstance.value.destroy();
        }
    };
    onUnmounted(destroyPopper);


    const updatePopper = () => {
        if (popperInstance.value) {
            popperInstance.value.update();
        }
    };

    return { popperInstance, updatePopper };
};
