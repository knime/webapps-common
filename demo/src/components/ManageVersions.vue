<script setup lang="ts">
import { Button, SideDrawer } from "@knime/components";
import {
  CURRENT_STATE_VERSION,
  ManageVersions,
  type ItemSavepoint,
  type NamedItemVersion,
  type WithAvatar,
  type WithLabels,
} from "@knime/hub-features/versions";

import { ref, computed } from "vue";

const isExpanded = ref(false);

const getVersion = (version: NamedItemVersion["version"]) => ({
  author: "knimey",
  avatar: {
    kind: "account" as const,
    name: "knimey",
  },
  createdOn: "2025-08-21T11:20:57+00:00",
  labels: [],
  title: `Version ${version}`,
  authorAccountId: "account:user:aeeeb38b-abcd-1234-1234-123456789",
  version,
  description: `This is version ${version}`,
});

const currentState: ItemSavepoint & WithAvatar & WithLabels = {
  ...getVersion(CURRENT_STATE_VERSION),
  version: getVersion(CURRENT_STATE_VERSION),
  changes: [
    {
      createdOn: "2025-08-21T11:20:57+00:00",
      author: "knimey",
      message: "A message",
      eventActionType: "UPDATED",
    },
  ],
  lastEditedOn: "2025-08-21T11:20:57+00:00",
  savepointNumber: 0,
};

const versionHistory = ref<(NamedItemVersion & WithAvatar & WithLabels)[]>([
  getVersion(1),
]);
const addVersion = () => {
  versionHistory.value.push(getVersion(versionHistory.value.length + 1));
};
const removeVersion = () => {
  versionHistory.value.pop();
};

const versionLimit = computed(() => ({
  limit: 3,
  currentUsage: versionHistory.value.length,
}));

const onUpgrade = () => {
  alert("Upgrading to deluxe ultra premium account");
};
</script>

<template>
  <div>
    <section>
      <div class="grid-container">
        <div class="grid-item-12 wrapper">
          <p>ManageVersions side drawer</p>
          <div class="top-button">
            <Button primary @click="isExpanded = !isExpanded">
              Open Manage Versions Sidedrawer
            </Button>
          </div>
          <Button
            primary
            :disabled="versionHistory.length >= versionLimit.limit"
            @click="addVersion"
          >
            Add version
          </Button>
          <Button
            :disabled="versionHistory.length < 1"
            primary
            @click="removeVersion"
          >
            Remove version
          </Button>
        </div>
      </div>
    </section>
    <SideDrawer class="side-drawer" :is-expanded="isExpanded">
      <ManageVersions
        :has-unversioned-changes="true"
        :has-admin-rights="true"
        :has-edit-capability="true"
        :has-loaded-all-versions="true"
        :loading="false"
        :unversioned-savepoint="currentState"
        :currentVersion="CURRENT_STATE_VERSION"
        :version-history="versionHistory"
        :version-limit="versionLimit"
        upgrade-url="https://www.knime.com/knime-hub-pricing"
        @close="isExpanded = false"
        @upgrade="onUpgrade"
      />
    </SideDrawer>
  </div>
</template>

<style lang="postcss" scoped>
h4 {
  margin: 0;
}

.top-button {
  margin-bottom: 30px;
}

.contents-side-drawer {
  padding: 30px;
  box-sizing: border-box;
  background-color: var(--knime-white);
  height: 100%;
}
</style>
