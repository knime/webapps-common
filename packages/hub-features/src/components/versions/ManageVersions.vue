<script setup lang="ts">
import { useEventBus } from "@vueuse/core";
import { throttle } from "lodash-es";

import { FunctionButton } from "@knime/components";
import CloseIcon from "@knime/styles/img/icons/close.svg";
import HistoryIcon from "@knime/styles/img/icons/history.svg";

import CurrentState from "./CurrentState.vue";
import VersionHistory from "./VersionHistory.vue";
import { CURRENT_STATE_VERSION } from "./constants";
import type {
  ItemSavepoint,
  NamedItemVersion,
  WithAvatar,
  WithLabels,
} from "./types";

type ManageVersionsProps = {
  hasUnversionedChanges: boolean;
  unversionedSavepoint?: (ItemSavepoint & WithAvatar & WithLabels) | null;
  currentVersion: NamedItemVersion["version"] | null;
  versionHistory: Array<NamedItemVersion & WithAvatar & WithLabels>;
  loading: boolean;
  hasLoadedAllVersions: boolean;
  hasAdminRights: boolean;
  hasEditCapability: boolean;
};

defineProps<ManageVersionsProps>();

defineEmits<{
  close: [];
  loadAll: [];
  create: [];
  delete: [version: NamedItemVersion["version"]];
  restore: [version: NamedItemVersion["version"]];
  select: [version: NamedItemVersion["version"]];
}>();

const labelsEventBus = useEventBus("versionLabels");

const closeLabelPopovers = throttle(() => {
  labelsEventBus.emit("versionLabelShowPopover");
  // eslint-disable-next-line no-magic-numbers
}, 10000); // Arbitrary delay to reduce overhead, is automatically reset @scrollend
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
            @select="$emit('select', CURRENT_STATE_VERSION)"
            @create-version="$emit('create')"
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
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
@import url("@knime/styles/css/mixins.css");

.manage-versions-container {
  position: relative;
  background-color: var(--knime-gray-light-semi);
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  overscroll-behavior: none;
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
      background-color: var(--knime-white);
      z-index: 2;
      box-shadow: var(--shadow-elevation-1);
      padding: 32px 30px 30px;

      & h4 {
        display: inline;
        margin: 0;
        font-size: 22px;
        line-height: 26px;
      }

      & .history-icon {
        @mixin svg-icon-size 24;

        margin-right: 9px;
        vertical-align: sub;
        stroke: var(--knime-masala);
        position: relative;
        top: 1px;
      }
    }

    & .overflow-container {
      overflow-y: auto;

      & .versions {
        width: 100%;
        padding: 30px;
      }
    }

    & .changes {
      background-color: var(--knime-white);
      width: 100%;
      padding-top: 30px;
    }
  }
}
</style>
