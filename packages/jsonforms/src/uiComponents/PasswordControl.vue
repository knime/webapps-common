<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import { KdsPasswordInput } from "@knime/kds-components";

import type { VueControlPropsForLabelContent } from "../higherOrderComponents";

const MAGIC_PASSWORD = "*************";

const props = defineProps<VueControlPropsForLabelContent<string>>();

const initialPassword = ref("");

const password = ref("");

const variant = computed(
  () => props.control.uischema.options?.variant ?? "password",
);

const usePasswordPlaceholder = computed(
  () => props.control.uischema.options?.usePasswordPlaceholder ?? false,
);

const passwordPlaceholder = computed(() =>
  usePasswordPlaceholder.value
    ? MAGIC_PASSWORD
    : props.control.uischema.options?.passwordPlaceholder ?? "Password",
);

const showPasswordToggle = computed(
  () => password.value !== "" && !props.disabled,
);

const onChange = (value: string) => {
  password.value = value;
  props.handleChange(props.control.path, password.value);
};

onMounted(() => {
  initialPassword.value = props.control.data;
  password.value = props.control.data ?? "";
});
</script>

<template>
  <KdsPasswordInput
    :model-value="password"
    :show-visibility-toggle="showPasswordToggle"
    :placeholder="passwordPlaceholder"
    :variant="variant"
    :disabled="disabled"
    @update:model-value="onChange"
  />
</template>
