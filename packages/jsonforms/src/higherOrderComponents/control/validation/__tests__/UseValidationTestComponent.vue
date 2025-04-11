<script setup lang="ts">
import type { Ref } from "vue";

import { useValidation } from "../useValidation";

const props = defineProps<{
  data: Ref<any>;
  options: Ref<Record<string, any>>;
}>();

const {
  messages,
  isValid,
  onRegisterValidation,
  performCustomValidationDebounced,
} = useValidation({ data: props.data, options: props.options });

defineExpose({
  messages,
  isValid,
  onRegisterValidation,
  performCustomValidationDebounced,
});
</script>

<template>
  <div />
</template>
