<script setup lang="ts">
import { computed } from "vue";

import {
  USER_ERROR_CODE,
  USER_ERROR_CODE_BLOCKING,
} from "../api/services/alert";

import UIExtensionBlockingErrorView from "./UIExtensionBlockingErrorView.vue";
import UIExtensionErrorOverlay from "./UIExtensionErrorOverlay.vue";
import UIExtensionWarningButton from "./UIExtensionWarningButton.vue";
import type { Alert, ErrorAlert } from "./types";

type Props = {
  alert: Alert | null;
};
const props = defineProps<Props>();

const emit = defineEmits<{
  display: [Alert];
  retry: [];
}>();

const warningAlert = computed(() =>
  props.alert?.type === "warn" ? props.alert : null,
);

const isErrorAlert = computed(() => props.alert?.type === "error");

const errorAlert = computed(() =>
  isErrorAlert.value && (props.alert as ErrorAlert).code === USER_ERROR_CODE
    ? (props.alert as ErrorAlert)
    : null,
);
const errorAlertBlocking = computed(() =>
  isErrorAlert.value &&
  (props.alert as ErrorAlert).code === USER_ERROR_CODE_BLOCKING
    ? (props.alert as ErrorAlert)
    : null,
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
  <UIExtensionBlockingErrorView
    :alert="errorAlertBlocking"
    v-bind="$attrs"
    @retry="emit('retry')"
  />
</template>
