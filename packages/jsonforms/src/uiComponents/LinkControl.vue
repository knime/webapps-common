<script setup lang="ts">
import { KdsLinkButton } from "@knime/kds-components";

import type { VueControlProps } from "../higherOrderComponents";

const props = defineProps<VueControlProps<void>>();

const alignment =
  props.control.uischema.options?.alignment === "right"
    ? "flex-end"
    : "flex-start";

const { to, leadingIcon, trailingIcon } = props.control.uischema.options || {};
</script>

<template>
  <div class="link-wrapper">
    <KdsLinkButton
      class="link-button"
      :label="control.label"
      :to="to"
      :leading-icon="leadingIcon"
      :trailing-icon="trailingIcon"
      size="small"
      variant="transparent"
    />
  </div>
</template>

<style lang="postcss" scoped>
.link-wrapper {
  display: flex;
  justify-content: v-bind(alignment);
  width: 100%;
}
</style>
