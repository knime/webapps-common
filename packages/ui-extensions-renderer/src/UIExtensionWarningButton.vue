<script setup lang="ts">
import { computed } from "vue";
import type { Alert } from "@knime/ui-extension-service";
import SignWarningIcon from "@knime/styles/img/icons/sign-warning.svg";
import { FunctionButton } from "@knime/components";

type Props = {
  alert?: Alert | null;
};

const props = withDefaults(defineProps<Props>(), {
  alert: null,
});

const emit = defineEmits<{
  display: [];
}>();

const isWarning = computed(() => props.alert?.type === "warn");
</script>

<template>
  <FunctionButton
    v-if="isWarning"
    primary
    class="warning-button"
    title="Show warnings"
    @click="emit('display')"
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
