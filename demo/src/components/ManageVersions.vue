<script setup lang="ts">
import { ref } from "vue";
import {
  ManageVersions,
  type ItemSavepoint,
  type WithAvatar,
  type WithLabels,
  type NamedItemVersion,
  CreateVersionForm,
  type AssignedLabel,
} from "@knime/hub-features/versions";
import { Button, SideDrawer } from "@knime/components";
import { computed } from "vue";

const isOpened = ref(false);
const isSubmenuOpen = ref(false);
const hasLoadedAllVersions = ref(false);
const loading = ref(false);
const currentVersion = ref<NamedItemVersion["version"] | null>("current-state");

const versionHistory = ref<Array<NamedItemVersion & WithAvatar & WithLabels>>([
  {
    version: 1,
    title: "Initial Release",
    description: "The first version of the project.",
    authorAccountId: "account:user:12345678-1234-1234-1234-1234567890ab",
    author: "john_doe",
    createdOn: "2023-01-01T10:00:00+00:00",
    avatar: {
      kind: "account",
      name: "john_doe",
      linkUrl: "/account:user:12345678-1234-1234-1234-1234567890ab",
    },
    labels: [],
  },
  {
    version: 2,
    title: "Bug Fixes",
    description: "Fixed minor bugs and improved performance.",
    author: "john_doe",
    createdOn: "2023-02-01T10:00:00+00:00",
    avatar: {
      kind: "account",
      name: "john_doe",
      image: {
        url: "https://www.knime.com/images/knime-logo.svg",

        altText: "john_doe",
      },
      linkUrl: "/account:user:12345678-1234-1234-1234-1234567890ab",
    },
    labels: [
      {
        labelId: "232423",
        message: "Bug fix",
        createdAt: "2023-02-01T10:00:00+00:00",
        createdBy: "account:user:12345678-1234-1234-1234-1234567890ab",
        label: {
          name: "bug",
          description: "A bug fix",
        },
      },
    ],
  },
  {
    version: 3,
    title: "New Features",
    description: "Added new features including user authentication.",
    author: "jane_doe",
    createdOn: "2023-03-01T10:00:00+00:00",
    avatar: {
      kind: "account",
      name: "jane_doe",
      image: {
        url: "https://www.knime.com/images/knime-logo.svg",
        altText: "jane_doe",
      },
      linkUrl: "/account:user:87654321-4321-4321-4321-9876543210ba",
    },
    labels: [],
  },
  {
    version: 4,
    title: "Performance Improvements",
    description: "Optimized database queries and reduced load times.",
    author: "jane_doe",
    createdOn: "2023-04-01T10:00:00+00:00",
    avatar: {
      kind: "account",
      name: "jane_doe",
      linkUrl: "/account:user:87654321-4321-4321-4321-9876543210ba",
    },
    labels: [],
  },
]);

const unversionedSavepoint = ref<
  (ItemSavepoint & WithAvatar & WithLabels) | null
>({
  author: "mica-rowe",
  authorAccountId: "account:user:123f121sad-3214-mn32-dsd4-asdasdas",
  lastEditedOn: "2025-08-21T12:00:57+00:00",
  savepointNumber: versionHistory.value.length + 1,
  itemVersionId: "9e842b96-bb2d-4f84-afbf-b5aec710e824",
  version: {
    version: 4,
    title: "Performance Improvements",
    description: "Optimized database queries and reduced load times.",
    author: "jane_doe",
    createdOn: "2023-04-01T10:00:00+00:00",
    authorAccountId: "account:user:123f121sad-3214-mn32-dsd4-asdasdas",
  },

  changes: [
    {
      author: "mica-rowe",
      authorAccountId: "account:user:123f121sad-3214-mn32-dsd4-asdasdas",
      createdOn: "2025-08-21T12:00:57+00:00",
      eventActionType: "UPDATED",
      message: "Updated Workflow",
    },
  ],
  avatar: {
    kind: "account",
    name: "mica-rowe",
    linkUrl: "/account:user:123f121sad-3214-mn32-dsd4-asdasdas",
  },
  labels: [
    {
      labelId: "123123",
      message: "This change is approved",
      createdAt: "2023-02-01T10:00:00+00:00",
      createdBy: "account:user:12345678-1234-1234-1234-1234567890ab",
      label: {
        name: "approved",
        description: "This change is approved",
      },
    },
  ],
});

const valueToAddOnLoadMore: NamedItemVersion & WithAvatar & WithLabels = {
  version: 5,
  title: "UI Overhaul",
  description: "Redesigned the user interface for better usability.",

  author: "john_doe",
  createdOn: "2023-05-01T10:00:00+00:00",
  avatar: {
    kind: "account",
    name: "john_doe",
    image: {
      url: "https://www.knime.com/images/knime-logo.svg",

      altText: "john_doe",
    },
    linkUrl: "/account:user:12345678-1234-1234-1234-1234567890ab",
  },
  labels: [],
};

const onLoadMore = () => {
  loading.value = true;

  setTimeout(() => {
    versionHistory.value.push(valueToAddOnLoadMore);
    loading.value = false;
    hasLoadedAllVersions.value = true;
  }, 1000);
};

const onRestore = (version: NamedItemVersion["version"]) => {
  currentVersion.value = version;
};

const onDelete = (version: NamedItemVersion["version"]) => {
  versionHistory.value = versionHistory.value.filter(
    (v) => v.version !== version,
  );
};

const onCreate = ({
  name,
  description,
}: {
  name: string;
  description: string;
}) => {
  if (unversionedSavepoint.value) {
    versionHistory.value.push({
      version: (versionHistory.value.length + 1) as number,
      title: name,
      description,
      createdOn: unversionedSavepoint.value?.lastEditedOn,
      author: unversionedSavepoint.value?.author,
      avatar: unversionedSavepoint.value?.avatar,
      labels: unversionedSavepoint.value?.labels,
    });
  }
  isSubmenuOpen.value = false;
};

const onCloseSubmenu = (hasUnsavedChanges: boolean) => {
  if (
    hasUnsavedChanges &&
    !confirm("You have unsaved changes. Do you really want to close?")
  ) {
    return;
  }
  isSubmenuOpen.value = false;
};
const versionLimit = computed(() => {
  const versionUnloadedCount = hasLoadedAllVersions.value ? 1 : 0;
  return {
    limit: 6,
    currentUsage:
      versionHistory.value.length +
      1 - // +1 for the extra item to be loaded
      versionUnloadedCount,
  };
});

const onDiscard = () => {
  unversionedSavepoint.value = null;
};
</script>

<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-12">
        <p>
          The manage versions panel allows you to view the version history of
          your workflow or components in the KNIME Hub or AP.
        </p>
        <p>Click the button to open the side drawer.</p>
        <Button primary @click="isOpened = true">Manage Versions</Button>
        <SideDrawer :is-expanded="isOpened" class="manage-versions-drawer">
          <ManageVersions
            :has-loaded-all-versions="hasLoadedAllVersions"
            :has-edit-capability="true"
            :current-version="currentVersion"
            :loading="loading"
            :has-admin-rights="true"
            :version-history="
              versionHistory as Array<
                NamedItemVersion & WithAvatar & WithLabels
              >
            "
            :version-limit="versionLimit"
            upgrade-url="https://www.knime.com/knime-hub-pricing"
            :unversioned-savepoint="unversionedSavepoint"
            :has-unversioned-changes="true"
            @close="isOpened = false"
            @load-all="onLoadMore"
            @restore="onRestore"
            @delete="onDelete"
            @create="isSubmenuOpen = true"
            @select="(value) => (currentVersion = value)"
            @discard-current-state="onDiscard"
          />
        </SideDrawer>

        <SideDrawer :is-expanded="isSubmenuOpen">
          <CreateVersionForm @create="onCreate" @cancel="onCloseSubmenu" />
        </SideDrawer>
      </div>
    </div>
  </section>
</template>

<style scoped>
.manage-versions-drawer {
  z-index: 55;
}
</style>
