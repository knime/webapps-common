<script setup lang="ts">
import { IdleReadyButton } from "@knime/components";

import NoVersionItem from "./NoVersionItem.vue";
import VersionItem from "./VersionItem.vue";
import type { NamedItemVersion, WithAvatar, WithLabels } from "./types";

defineProps<{
  selectedVersion: NamedItemVersion["version"] | null;
  versionHistory: Array<NamedItemVersion & WithAvatar & WithLabels>;
  hasLoadedAllVersions: boolean;
  loading: boolean;
  hasUnversionedChanges: boolean;
  hasAdminRights: boolean;
  hasEditCapability: boolean;
}>();

defineEmits<{
  loadAll: [];
  delete: [version: NamedItemVersion["version"]];
  restore: [version: NamedItemVersion["version"]];
  select: [version: NamedItemVersion["version"] | null];
}>();
</script>

<template>
  <div class="version-history-container">
    <div :class="['versions', { 'no-changes': !hasUnversionedChanges }]">
      <VersionItem
        v-for="itemVersion in versionHistory"
        :key="itemVersion.version"
        :is-selected="itemVersion.version === selectedVersion"
        :version="itemVersion"
        :has-admin-rights="hasAdminRights"
        :has-edit-capability="hasEditCapability"
        class="version-item"
        @delete="$emit('delete', itemVersion.version)"
        @restore="$emit('restore', itemVersion.version)"
        @select="$emit('select', $event ? itemVersion.version : null)"
      />
      <NoVersionItem v-if="!loading && versionHistory.length === 0" />
    </div>
    <IdleReadyButton
      v-if="!hasLoadedAllVersions"
      :with-border="false"
      with-down-icon
      :idle="loading"
      ready-text="&nbsp; Load all &nbsp;"
      @click="$emit('loadAll')"
    />
  </div>
</template>

<style lang="postcss" scoped>
@import url("@knime/styles/css/mixins.css");

.version-history-container {
  height: 100%;

  & .header {
    height: 24px;
    width: 440px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;

    & .title {
      display: inline;
      margin: 0;
      font-size: 16px;
      line-height: 19px;
      font-weight: 700;
    }

    @media only screen and (width <= 900px) {
      width: calc(100vw - 60px);
    }
  }

  & .versions {
    position: relative;

    /*
      Explicit min-height to ensure submenu is never cut off.
      Height is equal to 2 versions.
    */
    min-height: 50px;
    padding: 0 0 10px 20px;
    margin-left: 10px;
    -ms-overflow-style: none; /* Hide scrollbar for IE and Edge */
    scrollbar-width: none; /* Hide scrollbar for Firefox */
    display: flex;
    flex-direction: column;
    gap: 10px;

    &::before {
      content: "";
      position: absolute;
      left: -2px;
      top: -30px;
      width: 2px;
      height: calc(100% + 35px);
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 5 5'%3E%3Ccircle cx='1' cy='1' r='.5' fill='%236E6E6E'/%3E%3C/svg%3E");
      background-size: 5px;
      background-repeat: repeat-y;
    }

    &.no-changes::before {
      top: -15px;
      height: calc(100% + 20px);
    }
  }

  & .empty-versions {
    font-size: 11px;
    padding: 7px;
  }

  /* Hide scrollbar for now */
  & .versions::-webkit-scrollbar {
    display: none;
  }

  @media only screen and (width <= 900px) {
    width: 100vw;
  }
}

svg {
  @mixin svg-icon-size 18;

  display: inline-block;
  margin-right: 5px;
  vertical-align: middle;
  stroke: var(--knime-masala);
}
</style>
