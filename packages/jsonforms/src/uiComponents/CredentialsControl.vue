<script setup lang="ts">
import { computed, reactive, ref } from "vue";

import { FunctionButton, InputField } from "@knime/components";
import HideIcon from "@knime/styles/img/icons/closed-eye.svg";
import ShowIcon from "@knime/styles/img/icons/eye.svg";

import type { VueControlPropsForLabelContent } from "../higherOrderComponents";

const MAGIC_PASSWORD = "*************";

type CredentialsData = { username: string; password: string } | string;

const props = defineProps<VueControlPropsForLabelContent<CredentialsData>>();

const handleMagicPassword = computed(
  () => props.control.uischema.options?.handleMagicPassword ?? false,
);

const defaultUsername = computed(
  () =>
    (props.control.schema as { username?: { default?: string } }).username
      ?.default ?? "",
);

const defaultPassword = computed(
  () =>
    (props.control.schema as { password?: { default?: string } }).password
      ?.default ?? "",
);

const usePasswordOnly = computed(
  () => props.control.uischema.options?.usePasswordOnly ?? false,
);

const getInitialPassword = () => {
  if (usePasswordOnly.value) {
    return (props.control.data as string) ?? defaultPassword.value;
  }
  return (
    (props.control.data as { password?: string })?.password ??
    defaultPassword.value
  );
};

const getInitialUsername = () => {
  if (usePasswordOnly.value) {
    return defaultUsername.value;
  }
  return (
    (props.control.data as { username?: string })?.username ??
    defaultUsername.value
  );
};

const initialPassword = getInitialPassword();
const initialUsername = getInitialUsername();

const credentials = reactive({
  username: initialUsername,
  password: initialPassword,
});

const showPassword = ref(false);

const passwordChanged = computed(
  () => credentials.password !== initialPassword,
);

const type = computed(() => (showPassword.value ? "text" : "Password"));

const usePasswordPlaceholder = computed(
  () => props.control.uischema.options?.usePasswordPlaceholder ?? false,
);

const passwordPlaceholder = computed(() =>
  usePasswordPlaceholder.value
    ? MAGIC_PASSWORD
    : props.control.uischema.options?.passwordPlaceholder ?? "Password",
);

const showPasswordToggle = computed(() => credentials.password !== "");

const onChange = (event: string, key: "username" | "password") => {
  // The magic password is a 'decrypted' string sent from the backend if the password is prefilled.
  // Since the password is always sent back to the server, we have to delete it, if the username changed
  // to prevent sending the magic password to the backend.
  if (handleMagicPassword.value) {
    if (
      initialPassword === MAGIC_PASSWORD &&
      key === "username" &&
      !passwordChanged.value
    ) {
      credentials.password = "";
    }
  }

  credentials[key] = event;

  if (usePasswordOnly.value) {
    props.handleChange(props.control.path, credentials.password);
  } else {
    props.handleChange(props.control.path, credentials);
  }
};

const togglePasswordView = () => {
  showPassword.value = !showPassword.value;
};
</script>

<template>
  <InputField
    v-if="!usePasswordOnly"
    class="username"
    placeholder="Username"
    :model-value="credentials.username"
    :disabled="disabled"
    compact
    type="text"
    @update:model-value="(event) => onChange(event, 'username')"
  />

  <InputField
    class="password-field"
    :placeholder="passwordPlaceholder"
    :model-value="credentials.password"
    :disabled="disabled"
    :type="type"
    compact
    @update:model-value="(event) => onChange(event, 'password')"
  >
    <template #iconRight>
      <FunctionButton v-show="showPasswordToggle" @click="togglePasswordView">
        <ShowIcon v-if="showPassword" />
        <HideIcon v-else />
      </FunctionButton>
    </template>
  </InputField>
</template>

<style lang="postcss" scoped>
.password-field {
  border: var(--kds-border-action-input);
  border-radius: var(--kds-border-radius-container-0-37x);

  &:hover {
    background: var(--kds-color-background-input-hover) !important;
  }
}
</style>
