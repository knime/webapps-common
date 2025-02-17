<script setup lang="ts">
// TODO: HUB port last synced on 2025-02-04

import { computed } from "vue";

import { Avatar } from "@knime/components";
import AdminGroupIcon from "@knime/styles/img/icons/team-group-admin.svg";
import MemberGroupIcon from "@knime/styles/img/icons/team-group.svg";

import { ADMIN_GROUP_NAME } from "../../common/constants";

import type { HubGroupAvatarData } from "./HubAvatar.vue";

/**
 * Displays the avatar image for a group.
 * See HubAvatar for more details.
 */
const props = defineProps<HubGroupAvatarData>();

const isAdminGroup = computed(() => {
  return props.name === ADMIN_GROUP_NAME;
});

const membersCountPostfix = computed(() => {
  if (props.membersCount === 0) {
    return " (0 people)";
  }
  if (props.membersCount === 1) {
    return " (1 person)";
  }

  return ` (${props.membersCount} people)`;
});

const displayText = computed(() => {
  return `${props.name}${membersCountPostfix.value}`;
});
</script>

<template>
  <Avatar
    :name="displayText"
    :tooltip="displayText"
    :show-text
    :layout
    :link-url
    descriptor="Group"
  >
    <template #default>
      <div class="container">
        <AdminGroupIcon v-if="isAdminGroup" class="admin" />
        <MemberGroupIcon v-else class="member" />
      </div>
    </template>

    <template #overlay>
      <slot />
    </template>
  </Avatar>
</template>

<style lang="postcss" scoped>
@import url("@knime/styles/css/mixins.css");

.container {
  position: relative;
  background-color: var(--knime-white);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  & > svg {
    position: absolute;
    stroke: var(--knime-dove-gray);

    @mixin svg-icon-size 24;
  }
}
</style>
