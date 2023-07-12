import { ref, onMounted } from "vue";
import { merge } from "lodash";

import type { Ref } from "vue";

export default function useAnimation(
  targetRef: Ref<HTMLElement | null>,
  keyframes: Keyframe[],
  { callback = () => {}, animationOptions = {}, immediate = false } = {},
) {
  const DEFAULT_ANIMATION_OPTIONS = {
    duration: 1000,
    fill: "forwards",
  };

  const mergedAnimationOptions = merge(
    {},
    DEFAULT_ANIMATION_OPTIONS,
    animationOptions,
  );

  const animation: Ref<null | Animation> = ref(null);

  const play = () => {
    if (!animation.value && targetRef.value) {
      animation.value = targetRef.value.animate(
        keyframes,
        mergedAnimationOptions as KeyframeAnimationOptions,
      );
      animation.value.onfinish = () => {
        callback();
      };
    } else if (
      animation.value &&
      (animation.value.playState === "paused" ||
        animation.value.playState === "idle")
    ) {
      animation.value.play();
    }
  };

  const pause = () => {
    if (animation.value?.playState === "running") {
      animation.value.pause();
    }
  };

  const reset = () => {
    if (animation.value) {
      animation.value.cancel();
      animation.value = null;
    }
  };

  onMounted(() => {
    if (immediate) {
      play();
    }
  });

  return { play, pause, reset };
}
