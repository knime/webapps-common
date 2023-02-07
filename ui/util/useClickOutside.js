import { watch, unref, onUnmounted } from 'vue';
import { onClickOutside } from '@vueuse/core';

/**
 * @param { Object } params
 * @param { Array } params.targets the elements whose union is the "inside" area
 * @param { Function } params.callback the method to be called on a click "outside" the targets
 * @param { VueElement.ref } active a reactive wrapper of a boolean deciding whether to call the callback on a click "outside" or not
 * @returns { void }
 */
export default ({ targets, callback }, active) => {
    let stop;
    const initStop = () => {
        stop = () => {
            // Nothing to be stopped yet
        };
    };

    initStop();

    const addEventListeners = () => {
        stop = onClickOutside('dummyTarget', callback, { ignore: targets });
    };

    const disposeEventListeners = () => {
        stop();
        initStop();
    };

    watch(
        () => unref(active),
        active => {
            if (active) {
                addEventListeners();
            } else {
                disposeEventListeners();
            }
        },
        {
            immediate: true
        }
    );

    onUnmounted(disposeEventListeners);
};
