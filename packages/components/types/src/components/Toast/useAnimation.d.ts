import type { Ref } from "vue";
export default function useAnimation(targetRef: Ref<HTMLElement | null>, keyframes: Keyframe[], { callback, animationOptions, immediate }?: {
    callback?: (() => void) | undefined;
    animationOptions?: {} | undefined;
    immediate?: boolean | undefined;
}): {
    play: () => void;
    pause: () => void;
    reset: () => void;
};
