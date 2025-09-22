<script setup lang="ts">
import { computed } from "vue";
import ColorHash from "color-hash";

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
  position: relative;
  width: 100%;
  height: 100%;
  background-color: var(--knime-silver-sand);
  border-radius: 50%;

  /* use box-shadow instead of border to prevent zoom issues */
  box-shadow: 0 0 0 2px var(--box-shadow-color, var(--knime-porcelain));
}

span {
  position: absolute;
  top: 50%;
  right: 0;
  left: 0;
  font-size: calc(var(--placeholder-size, 45px) / 2);
  font-weight: 400;
  line-height: 0;
  color: var(--knime-white);
  text-align: center;
  pointer-events: none;
  opacity: 0.8;
}
</style>
