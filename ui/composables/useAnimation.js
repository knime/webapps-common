import { ref, onMounted, onUnmounted } from 'vue';
import { merge } from 'lodash';

const DEFAULT_ANIMATION_OPTIONS = {
    duration: 1000,
    fill: 'forwards'
};

export default function useAnimation(
    targetRef,
    keyframes,
    { callback = () => {}, animationOptions = {}, immediate = false } = {}
) {
    animationOptions = merge(DEFAULT_ANIMATION_OPTIONS, animationOptions);

    const animation = ref(null);

    const play = () => {
        if (!animation.value) {
            animation.value = targetRef.value.animate(keyframes, animationOptions);
            animation.value.onfinish = () => {
                callback();
            };
        } else if (animation.value.playState === 'paused') {
            animation.value.play();
        }
    };

    const pause = () => {
        if (animation.value?.playState === 'running') {
            animation.value.pause();
        }
    };

    const reset = () => {
        if (animation.value) {
            animation.value.cancel();
        }
    };

    onMounted(() => {
        if (immediate) {
            play();
        }
    });

    onUnmounted(() => {
        if (animation.value) {
            animation.value.cancel();
        }
    });

    return { play, pause, reset };
}
