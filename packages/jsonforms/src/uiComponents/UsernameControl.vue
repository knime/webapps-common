<script setup lang="ts">
import { ref } from "vue";

import { KdsUsernameInput } from "@knime/kds-components";

import type { VueControlProps } from "../higherOrderComponents";

const props = defineProps<VueControlProps<string>>();

const username = ref(props.control.data);

const onChange = (value: string) => {
  props.handleChange(props.control.path, value);
};
</script>

<template>
  <KdsUsernameInput
    :model-value="username"
    :label="control.label"
    :description="control.description"
    :disabled="disabled"
    @update:model-value="onChange"
  />
</template>
