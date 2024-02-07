<script setup lang="ts">
import { computed } from "vue";
import Toast from "./Toast.vue";
import { useToasts } from "../toastService";

import type { ToastStack } from "../types";

const MAX_TOAST_COUNT = 5;
const OFFSET = 4;

const props = withDefaults(defineProps<ToastStack>(), {
  serviceSymbol: null,
  propertyName: null,
});

const stackIdentifier = computed(() => {
  if (props.serviceSymbol) {
    return props.serviceSymbol.toString();
  } else if (props.propertyName) {
    return props.propertyName;
  }
  return "default";
});

// Inject the toast service (optionally bound to a custom symbol or a global property name)
const { toasts, remove, autoRemove } = useToasts({
  serviceSymbol: props.serviceSymbol,
  propertyName: props.propertyName,
});

// Compute CSS styles for each toast based on its index in the stack
const style = (index: number) => {
  const factor = index < MAX_TOAST_COUNT ? OFFSET : MAX_TOAST_COUNT;
  const opacity = index < MAX_TOAST_COUNT ? null : 0;

  return {
    zIndex: -index,
    bottom: `${-factor * index}px`,
    right: `${-factor * index}px`,
    ...(opacity !== null && { opacity }),
  };
};

// Check if the current toast is the first in the stack (active toast)
const isActive = (index: number) => index === 0;
</script>

<template>
  <transition-group class="toast-stack" tag="div" name="toast-stack">
    <Toast
      v-for="(toast, index) in toasts"
      v-bind="toast"
      :key="toast.uniqueId"
      :active="isActive(index)"
      class="toast"
      :style="style(index)"
      :stack-id="stackIdentifier"
      @remove="remove(toast.uniqueId as string)"
      @auto-remove="autoRemove()"
    />
  </transition-group>
</template>

<style lang="postcss" scoped>
.toast-stack {
  position: fixed;
  bottom: 50px;
  left: 50px;

  & .toast {
    position: absolute;
    pointer-events: none;
    max-height: 300px;
    height: 100%;

    &:first-child {
      position: relative;
      max-height: 80vh;
      pointer-events: all;
    }
  }
}

/* Vue's transition group animation behaviour configuration */
.toast-stack-enter-active,
.toast-stack-leave-active {
  transition: all 0.3s;
}

.toast-stack-enter-from,
.toast-stack-leave-to {
  opacity: 0;
  transform: translateY(75px);
}
</style>
