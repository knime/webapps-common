<script setup lang="ts">
import { computed } from "vue";

import HubAccountAvatar from "./HubAccountAvatar.vue";
import HubGroupAvatar from "./HubGroupAvatar.vue";

/**
 * Avatar component which displays an image or a colored placeholder as well as a text
 * for accounts (i.e., teams or users) or for groups. Depending on the entity for which
 * an avatar image should be shown, this component renders a HubGroupAvatar or HubAccountAvatar.
 */

type CommonAvatarData = {
  name: string;
  linkUrl?: string;
  layout?: "vertical" | "horizontal";
  showText?: "name" | "placeholder" | "none";
};

export type HubGroupAvatarData = CommonAvatarData & {
  kind: "group";
  membersCount?: number;
  isAdminGroup?: boolean;
};

export type HubAccountAvatarData = CommonAvatarData & {
  kind: "account";
  image?: { url?: string | null; altText?: string };
  isTrusted?: boolean;
  tooltip?: string;
};

export type HubAvatarData = HubGroupAvatarData | HubAccountAvatarData;

const props = defineProps<HubAvatarData>();

const renderComponent = computed(() => {
  return props.kind === "group" ? HubGroupAvatar : HubAccountAvatar;
});
</script>

<template>
  <Component :is="renderComponent" v-bind="props">
    <slot />
  </Component>
</template>
