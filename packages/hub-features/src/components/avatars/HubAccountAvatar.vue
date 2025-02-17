<script setup lang="ts">
import { Avatar } from "@knime/components";

import type { HubAccountAvatarData } from "./HubAvatar.vue";
/**
 * Displays the avatar image for an account (i.e., team or user)
 * or a colored placeholder. See HubAvatar.
 */
withDefaults(defineProps<HubAccountAvatarData>(), {
  isTrusted: false,
});
</script>

<template>
  <Avatar
    :image
    :name
    :tooltip
    :show-text
    :layout
    :show-trusted="isTrusted"
    :link-url
  >
    <template #overlay>
      <slot />
    </template>
  </Avatar>
</template>

<style lang="postcss" scoped></style>
