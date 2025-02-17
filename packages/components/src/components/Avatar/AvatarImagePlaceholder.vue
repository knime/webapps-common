<script setup lang="ts">
import { computed } from "vue";
import ColorHash from "color-hash/dist/esm";

const { name } = defineProps<{
  name: string;
}>();

// From secondary colors of @knime/styles/colors/knimeColors.js
/* eslint-disable no-magic-numbers */
const colors = [
  [188, 63, 71.4],
  [193, 60.9, 43.1],
  [182, 63.3, 88.2],
  [78, 38.7, 75.7],
  [60, 23, 49.4],
  [60, 50.8, 87.3],
  [29, 100, 59.8],
  [24, 78.2, 48.6],
  [40, 100, 80],
  [0, 100, 64.7],
  [0, 69.5, 41.2],
  [0, 91.5, 86.1],
  [206, 69.7, 38.8],
  [216, 64.9, 29],
  [205, 71.9, 74.9],
  [327, 82.3, 71.2],
  [329, 71.4, 52],
  [329, 72.3, 87.3],
  [305, 27.7, 46.1],
  [295, 34.2, 29.8],
  [263, 40.4, 77.6],
  [128, 50, 47.1],
  [142, 58.7, 29.4],
  [70, 78.3, 54.9],
  [173, 37.2, 43.7],
  [183, 100, 17.5],
  [168, 57.4, 78.8],
  [0, 0, 66.7],
  [60, 0.4, 48.4],
  [220, 4.3, 86.5],
  [24, 46.4, 67.1],
  [26, 33, 35.1],
  [30, 100, 85.1],
];
/* eslint-enable no-magic-numbers */

const hue = colors.map((color) => ({ min: color[0], max: color[0] }));

const colorHash = new ColorHash({ hue });

const initials = computed(() => {
  return name
    .split(/[., _-]/, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
});
const styles = computed(() => {
  return `background-color: ${colorHash.hex(name)}`;
});
</script>

<template>
  <div class="avatar-placeholder avatar-missing" :style="styles">
    <span>{{ initials }}</span>
  </div>
</template>

<style lang="postcss" scoped>
.avatar-placeholder {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: var(--knime-silver-sand);
  border-radius: 50%;

  /* use box-shadow instead of border to prevent zoom issues */
  box-shadow: 0 0 0 2px var(--box-shadow-color, var(--knime-porcelain));
}

span {
  font-size: calc(var(--placeholder-size, 45px) / 2);
  color: var(--knime-white);
  font-weight: 400;
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  line-height: 0;
  pointer-events: none;
  opacity: 0.8;
}
</style>
