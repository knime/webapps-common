<script setup lang="ts">
import { computed } from "vue";
// @ts-expect-error No types available for module
import ColorHash from "color-hash/dist/esm";

import {
  Aquamarine,
  AquamarineDark,
  AquamarineLight,
  Avocado,
  AvocadoDark,
  AvocadoLight,
  Carrot,
  CarrotDark,
  CarrotLight,
  Coral,
  CoralDark,
  CoralLight,
  Cornflower,
  CornflowerDark,
  CornflowerLight,
  Hibiscus,
  HibiscusDark,
  HibiscusLight,
  Lavender,
  LavenderDark,
  LavenderLight,
  Meadow,
  MeadowDark,
  MeadowLight,
  Petrol,
  PetrolDark,
  PetrolLight,
  Stone,
  StoneDark,
  StoneLight,
  Wood,
  WoodDark,
  WoodLight,
} from "@knime/styles/colors/knimeColors";

const { name } = defineProps<{
  name: string;
}>();

const secondaryColors = [
  Aquamarine,
  AquamarineDark,
  AquamarineLight,
  Avocado,
  AvocadoDark,
  AvocadoLight,
  Carrot,
  CarrotDark,
  CarrotLight,
  Coral,
  CoralDark,
  CoralLight,
  Cornflower,
  CornflowerDark,
  CornflowerLight,
  Hibiscus,
  HibiscusDark,
  HibiscusLight,
  Lavender,
  LavenderDark,
  LavenderLight,
  Meadow,
  MeadowDark,
  MeadowLight,
  Petrol,
  PetrolDark,
  PetrolLight,
  Stone,
  StoneDark,
  StoneLight,
  Wood,
  WoodDark,
  WoodLight,
].map((hslString) => (hslString.match(/[\d.]+/g) ?? []).map(Number));

const hue = secondaryColors.map((color) => ({ min: color[0], max: color[0] }));

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
