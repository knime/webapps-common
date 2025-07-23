<script lang="ts" setup>
import { computed } from "vue";

type Props = {
  modelValue?: boolean;
  disabled?: boolean;
  halfChecked?: boolean;
};
const props = defineProps<Props>();

const emit = defineEmits<{
  change: [value: boolean];
  "update:modelValue": [value: boolean];
}>();

const rootCls = computed(() => {
  let result = "vir-checkbox";
  if (props.modelValue) {
    result += " checked";
  } else if (props.halfChecked) {
    result += " half-checked";
  }
  if (props.disabled) {
    result += " disabled";
  }
  return result;
});

const handleClick = (event: MouseEvent) => {
  event.stopPropagation();
  if (!props.disabled) {
    emit("update:modelValue", !props.modelValue);
    emit("change", !props.modelValue);
  }
};
</script>

<template>
  <div :class="rootCls" @click="handleClick">
    <div class="inner" />
    <div class="content"><slot /></div>
  </div>
</template>
