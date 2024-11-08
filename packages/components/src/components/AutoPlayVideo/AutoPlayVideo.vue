<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { useElementVisibility } from "@vueuse/core";

interface Props {
  withBorder?: boolean;
  aspectRatio?: "256:135" | "16:10" | "16:9";
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
    <video v-bind="$attrs" ref="video" loop muted playsinline preload="auto">
      <slot />
    </video>
  </div>
</template>

<style lang="postcss" scoped>
div {
  &.ar-16-10 {
    aspect-ratio: 16 / 10;
  }

  &.ar-16-9 {
    aspect-ratio: 16 / 9;
  }

  &.ar-256-135 {
    aspect-ratio: 256 / 135;
  }

  &.with-border {
    border: 1px solid var(--knime-silver-sand);
  }

  & video {
    width: 100%;
    height: 100%;
  }
}
</style>
