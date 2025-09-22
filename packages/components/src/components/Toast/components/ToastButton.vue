<script setup lang="ts">
import { computed } from "vue";

import LinkExternal from "@knime/styles/img/icons/link-external.svg";

import BaseButton from "../../base/Button/BaseButton.vue";
import type { ToastButton } from "../types";

const props = defineProps<ToastButton>();

/**
 * We set the `target` attribute to open in a new tab ("_blank") if `href` is set.
 */
const target = computed(() => {
  if (props.href) {
    return "_blank";
  }
  return null;
});

const callback = computed(() => {
  if (typeof props.callback === "function") {
    return props.callback;
  }
  return undefined;
});
</script>

<template>
  <BaseButton
    class="toast-button"
    :to="to"
    :href="href"
    :target="target"
    @click="callback"
  >
    <Component :is="icon || LinkExternal" v-if="to || href" />
    <Component :is="icon" v-else-if="icon" />
    {{ text }}
  </BaseButton>
</template>

<style lang="postcss" scoped>
.toast-button {
  all: unset;
  display: flex;
  flex-direction: row;
  gap: 6px;
  align-items: center;
  font-size: 13px;
  font-weight: 500;
  line-height: 18px;
  color: var(--knime-dove-gray);
  cursor: pointer;

  & svg {
    width: 12px;
    height: 12px;
    stroke: var(--knime-dove-gray);
    stroke-width: calc(32px / 12);
  }

  &:active,
  &:hover {
    text-decoration: underline;
  }
}
</style>
