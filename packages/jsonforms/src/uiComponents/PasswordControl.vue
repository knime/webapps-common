<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import { KdsPasswordInput } from "@knime/kds-components";

import type { VueControlPropsForLabelContent } from "../higherOrderComponents";

const MAGIC_PASSWORD = "*************";

const props = defineProps<VueControlPropsForLabelContent<string>>();

const initialPassword = ref("");
const handleMagicPassword = computed(
  () => props.control.uischema.options?.handleMagicPassword ?? false,
);

const password = ref("");

const passwordChanged = computed(
  () => password.value !== initialPassword.value,
);

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

const showPasswordToggle = computed(() => password.value !== "");

const onChange = (value: string) => {
  // The magic password is a 'decrypted' string sent from the backend if the password is prefilled.
  // Since the password is always sent back to the server, we have to delete it, if the username changed
  // to prevent sending the magic password to the backend.
  if (handleMagicPassword.value) {
    if (initialPassword.value === MAGIC_PASSWORD && !passwordChanged.value) {
      password.value = "";
    }
  }

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
    @update:model-value="onChange"
  />
</template>
