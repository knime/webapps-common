<script setup lang="ts">
import { FunctionButton } from "@knime/components";
import SignWarningIcon from "@knime/styles/img/icons/sign-warning.svg";
import type { WarningAlert } from "@knime/ui-extension-service";

type Props = {
  alert: WarningAlert | null;
};

defineProps<Props>();

const emit = defineEmits<{
  display: [WarningAlert];
}>();
</script>

<template>
  <FunctionButton
    v-if="alert"
    primary
    class="warning-button"
    title="Show warnings"
    @click="emit('display', alert)"
  >
    <SignWarningIcon />
  </FunctionButton>
</template>

<style lang="postcss" scoped>
.warning-button {
  position: absolute;
  bottom: 16px;
  right: 50px;

  /* Icon is a triangle, which makes it look off-center to the eye even when it's not.
  Offsetting it to the top makes this more pleasing and natural looking */
  & svg {
    height: 21px;
    margin-top: -3px;
  }
}
</style>
