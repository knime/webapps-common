<script setup lang="ts">
import { computed } from "vue";

import { type Alert, AlertType } from "@knime/ui-extension-service";

import UIExtensionErrorOverlay from "./UIExtensionErrorOverlay.vue";
import UIExtensionWarningButton from "./UIExtensionWarningButton.vue";

type Props = {
  alert: Alert | null;
};
const props = defineProps<Props>();

const emit = defineEmits<{
  display: [Alert];
}>();

const warningAlert = computed(() =>
  props.alert?.type === AlertType.WARN ? props.alert : null,
);
const errorAlert = computed(() =>
  props.alert?.type === AlertType.ERROR ? props.alert : null,
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
