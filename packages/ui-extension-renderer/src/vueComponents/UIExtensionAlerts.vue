<script setup lang="ts">
import { computed } from "vue";

import UIExtensionErrorOverlay from "./UIExtensionErrorOverlay.vue";
import UIExtensionWarningButton from "./UIExtensionWarningButton.vue";
import type { Alert } from "./types";

type Props = {
  alert: Alert | null;
};
const props = defineProps<Props>();

const emit = defineEmits<{
  display: [Alert];
}>();

const warningAlert = computed(() =>
  props.alert?.type === "warn" ? props.alert : null,
);
const errorAlert = computed(() =>
  props.alert?.type === "error" ? props.alert : null,
);
</script>

<template>
  <UIExtensionErrorOverlay
    :alert="errorAlert"
    class="error"
    v-bind="$attrs"
    @display="emit('display', $event)"
  />
  <UIExtensionWarningButton
    :alert="warningAlert"
    class="warning"
    v-bind="$attrs"
    @display="emit('display', $event)"
  />
</template>
