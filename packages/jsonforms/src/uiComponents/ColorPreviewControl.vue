<script setup lang="ts">
import { computed } from "vue";

import type { VueControlProps } from "../higherOrderComponents/control/types";

import GradientPreview from "./colorPreview/GradientPreview.vue";
import PalettePreview from "./colorPreview/PalettePreview.vue";
import useProvidedState, {
  type UiSchemaWithProvidedOptions,
} from "./composables/useProvidedState";

export type Palette = {
  colors: string[];
};

export type Gradient = {
  colors: string[];
  stops: number[] | null;
};

type ColorPreviewOptions = {
  previewColors: Palette | Gradient;
};

const props = defineProps<VueControlProps<undefined>>();

const uischema = computed(
  () =>
    props.control.uischema as UiSchemaWithProvidedOptions<ColorPreviewOptions>,
);

const previewColors = useProvidedState(uischema, "previewColors", {
  colors: [],
} as Palette);

const isPalette = (value: Palette | Gradient): value is Palette =>
  !("stops" in value);
</script>

<template>
  <div class="color-preview">
    <PalettePreview v-if="isPalette(previewColors)" :palette="previewColors" />
    <GradientPreview v-else :gradient="previewColors" />
  </div>
</template>
