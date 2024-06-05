<script setup lang="ts">
import type { Alert } from "@knime/ui-extension-service";
import UIExtensionErrorOverlay from "./UIExtensionErrorOverlay.vue";
import UIExtensionWarningButton from "./UIExtensionWarningButton.vue";

type Props = {
  alert?: Alert | null;
};

withDefaults(defineProps<Props>(), {
  alert: null,
});

const emit = defineEmits<{
  display: [];
}>();
</script>

<template>
  <UIExtensionErrorOverlay
    :alert="alert"
    class="error"
    v-bind="$attrs"
    @display="emit('display')"
  />

  <UIExtensionWarningButton
    :alert="alert"
    class="warning"
    v-bind="$attrs"
    @display="emit('display')"
  />
</template>
