<script setup lang="ts">
import { useEventBus, useThrottleFn } from "@vueuse/core";

import { FunctionButton } from "@knime/components";
import CloseIcon from "@knime/styles/img/icons/close.svg";
import HistoryIcon from "@knime/styles/img/icons/history.svg";

import { CURRENT_STATE_VERSION } from "../constants";
import type {
  ItemSavepoint,
  NamedItemVersion,
  VersionLimit,
  WithAvatar,
  WithLabels,
} from "../types";

import CurrentState from "./CurrentState.vue";
import VersionHistory from "./VersionHistory.vue";
import VersionLimitInfo from "./VersionLimitInfo.vue";

type ManageVersionsProps = {
  hasUnversionedChanges: boolean;
  unversionedSavepoint?: (ItemSavepoint & WithAvatar & WithLabels) | null;
  currentVersion: NamedItemVersion["version"] | null;
  versionHistory: Array<NamedItemVersion & WithAvatar & WithLabels>;
  loading: boolean;
  hasLoadedAllVersions: boolean;
  hasAdminRights: boolean;
  hasEditCapability: boolean;
  versionLimit?: VersionLimit;
  upgradeUrl?: string;
  isPrivate?: boolean;
};

defineProps<ManageVersionsProps>();

defineEmits<{
  close: [];
  loadAll: [];
  create: [];
  delete: [version: NamedItemVersion["version"]];
  restore: [version: NamedItemVersion["version"]];
  select: [version: NamedItemVersion["version"]];
  discardCurrentState: [];
}>();

const labelsEventBus = useEventBus("versionLabels");

const closeLabelPopoversImpl = () => {
  labelsEventBus.emit("versionLabelShowPopover");
};
 
const closeLabelPopovers = Object.assign(
  useThrottleFn(closeLabelPopoversImpl, 10000), // Arbitrary delay to reduce overhead, is automatically reset @scrollend
  { cancel: () => {} }, // No-op cancel for compatibility
);
</script>

<template>
  <div class="manage-versions-container">
    <FunctionButton class="close" @click="$emit('close')">
      <CloseIcon />
    </FunctionButton>

    <div class="manage-versions">
      <div class="header">
        <HistoryIcon class="history-icon" /><!--
        -->
        <h4>Version history</h4>
        <div
          v-if="hasUnversionedChanges && unversionedSavepoint"
          class="changes"
        >
          <CurrentState
            :has-edit-capability="hasEditCapability"
            :has-previous-version="versionHistory.length > 0"
            :is-selected="currentVersion === CURRENT_STATE_VERSION"
            :current-state-savepoint="unversionedSavepoint"
            :is-version-limit-exceeded="
              versionLimit?.limit !== undefined &&
              versionLimit.currentUsage >= versionLimit.limit
            "
            @select="$emit('select', CURRENT_STATE_VERSION)"
            @create-version="$emit('create')"
            @discard="$emit('discardCurrentState')"
          />
        </div>
      </div>
      <div
        class="overflow-container"
        @scroll="closeLabelPopovers"
        @scrollend="closeLabelPopovers.cancel"
      >
        <div class="versions">
          <VersionHistory
            :selected-version="currentVersion"
            :version-history
            :loading
            :has-unversioned-changes
            :has-loaded-all-versions
            :has-admin-rights
            :has-edit-capability
            @delete="$emit('delete', $event)"
            @restore="$emit('restore', $event)"
            @load-all="$emit('loadAll')"
            @select="$emit('select', $event ?? CURRENT_STATE_VERSION)"
          />
          <VersionLimitInfo
            v-if="versionLimit?.limit !== undefined"
            class="version-limit-info"
            :version-limit="{
              limit: versionLimit.limit,
              currentUsage: versionLimit.currentUsage,
            }"
            :upgrade-url
            :is-private
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
@import url("@knime/styles/css/mixins.css");

.manage-versions-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  height: 100%;
  overscroll-behavior: none;
  background-color: var(--knime-gray-light-semi);
  isolation: isolate;

  & .close {
    position: absolute;
    top: 6px;
    right: 6px;
    z-index: 3;
  }

  & .manage-versions {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;

    & .header {
      z-index: 2;
      padding: 32px 30px 30px;
      background-color: var(--knime-white);

      & h4 {
        display: inline;
        margin: 0;
        font-size: 22px;
        line-height: 26px;
      }

      & .history-icon {
        @mixin svg-icon-size 24;

        position: relative;
        top: 1px;
        margin-right: 9px;
        vertical-align: sub;
        stroke: var(--knime-masala);
      }
    }

    & .overflow-container {
      overflow-y: auto;

      & .versions {
        width: 100%;
        padding: 30px;

        & .version-limit-info {
          margin-top: 30px;
        }
      }
    }

    & .changes {
      width: 100%;
      padding-top: 30px;
      background-color: var(--knime-white);
    }
  }
}
</style>
