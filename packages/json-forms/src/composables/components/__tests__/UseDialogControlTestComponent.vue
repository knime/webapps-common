<script setup lang="ts">
import useDialogControl from "../useDialogControl";

const props = defineProps<{
  props: any;
}>();
defineExpose(useDialogControl(props));
</script>

<template>
  <slot />
</template>
