<script setup lang="ts">
import { ref } from "vue";

import { KdsUsernameInput } from "@knime/kds-components";

import type { VueControlPropsForLabelContent } from "../higherOrderComponents";

const props = defineProps<VueControlPropsForLabelContent<string>>();

const username = ref(props.control.data);

const onChange = (value: string) => {
  props.handleChange(props.control.path, value);
};
</script>

<template>
  <KdsUsernameInput
    :model-value="username"
    :disabled="disabled"
    @update:model-value="onChange"
  />
</template>
