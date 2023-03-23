import { onMounted, onUnmounted, ref, unref, type Ref } from 'vue';

// TODO: Revert to using '@popperjs/core' when this is not necessary for the pagebuilder vite library build
// @ts-ignore
import { createPopper } from '@popperjs/core/dist/esm';

import type { Instance, Options } from '@popperjs/core';


type PopperTargets = {
    // the element to create a popover from
    popperTarget: Ref<HTMLElement | null>,
    // the element to which the popover is positioned
    referenceEl: Ref<HTMLElement | null>
}

export default ({ popperTarget, referenceEl }: PopperTargets, options: Ref<Options> | Options) => {
    const popperInstance: Ref<Instance | null> = ref(null);
        
    const activatePopper = () => {
        if (referenceEl.value !== null && popperTarget.value !== null) {
            popperInstance.value = createPopper(referenceEl.value, popperTarget.value, unref(options)) as Instance;
        }
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
