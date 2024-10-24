<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useElementVisibility } from "@vueuse/core";

interface Props {
  withBorder: boolean;
  aspectRatio: "256:135" | "16:10" | "16:9";
}

const props = withDefaults(defineProps<Props>(), {
  withBorder: false,
  aspectRatio: "256:135",
});

const video = ref();
const videoIsVisible = useElementVisibility(video);

const aspectRatioClass = computed(() => {
  return `ar-${props.aspectRatio.replace(":", "-")}`;
});

watch(videoIsVisible, (isVisible) => {
  // performance optimization: only play video when it's visible
  if (isVisible) {
    consola.trace(`Video ${video.value.currentSrc} visible, play it`);
    video.value.play();
  } else {
    consola.trace(`Video ${video.value.currentSrc} invisible, pause it`);
    video.value.pause();
  }
});
</script>

<template>
  <div :class="[aspectRatioClass, { 'with-border': withBorder }]">
    <video v-bind="$attrs" ref="video" loop muted playsinline preload>
      <slot />
    </video>
  </div>
</template>

<style lang="postcss" scoped>
div {
  position: relative;
  padding-bottom: calc(100% * 135 / 265);

  &.ar-16-10 {
    padding-bottom: calc(100% * 10 / 16);
  }

  &.ar-16-9 {
    padding-bottom: calc(100% * 9 / 16);
  }

  &.with-border {
    border: 1px solid var(--knime-silver-sand);
  }

  & video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
