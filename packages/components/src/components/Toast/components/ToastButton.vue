<script setup lang="ts">
import { computed } from "vue";
import BaseButton from "../../base/Button/BaseButton.vue";
import LinkExternal from "@knime/styles/img/icons/link-external.svg";

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
  // eslint-disable-next-line no-undefined
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
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  font-size: 13px;
  line-height: 18px;
  color: var(--knime-dove-gray);

  & svg {
    stroke: var(--knime-dove-gray);
    width: 12px;
    height: 12px;
    stroke-width: calc(32px / 12);
  }

  &:active,
  &:hover {
    text-decoration: underline;
  }
}
</style>
