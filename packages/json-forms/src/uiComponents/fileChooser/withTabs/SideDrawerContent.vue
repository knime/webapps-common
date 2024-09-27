<!-- Wrapper component holding the state of the side drawer changes which is exposes to be applied
   on button click -->
<script lang="ts">
import type { FileChooserProps } from "../types/FileChooserProps";
export type Props = Omit<FileChooserProps, "modelValue"> & {
  initialValue: FileChooserProps["modelValue"];
};
</script>

<script setup lang="ts">
import { ref } from "vue";
import SideDrawerContentBase from "./SideDrawerContentBase.vue";

const props = defineProps<Props>();

const modelValue = ref(props.initialValue);

defineExpose({ modelValue });
</script>

<template>
  <SideDrawerContentBase v-bind="props" v-model="modelValue" />
</template>
