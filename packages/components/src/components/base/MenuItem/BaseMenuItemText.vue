<script setup lang="ts">
import Pill from "../../Pill/Pill.vue";

import type { MenuItem } from "./MenuItems.vue";

defineProps<{
  text: string;
  hotkeyText?: string;
  useMaxMenuWidth: boolean;
  accountTypeBadgeText?: MenuItem["accountTypeBadgeText"];
}>();
</script>

<template>
  <span :class="['text', { truncate: useMaxMenuWidth }]">
    {{ text }}
  </span>
  <span v-if="hotkeyText" class="hotkey">{{ hotkeyText }}</span>
  <Pill v-if="accountTypeBadgeText" variant="info" class="account-type-badge">{{
    accountTypeBadgeText
  }}</Pill>
</template>

<style lang="postcss" scoped>
.text,
.hotkey {
  font-weight: 400;
}

.account-type-badge {
  margin-left: 8px;
}

.text {
  flex-shrink: 1;
  flex-basis: 100%;

  &.truncate {
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.hotkey {
  margin-left: 40px;
}
</style>
