<script setup lang="ts">
import { computed } from "vue";

import { InlineMessage } from "@knime/components";

import type { VersionLimit } from "../types";

const { versionLimit, upgradeUrl = undefined } = defineProps<{
  versionLimit: Required<VersionLimit>;
  upgradeUrl?: string;
}>();

const isLimitReached = computed(
  () => versionLimit.currentUsage >= versionLimit.limit,
);

const title = computed(() => {
  if (isLimitReached.value) {
    return `You've reached the maximum of ${versionLimit.limit} versions.`;
  } else {
    return `Using ${versionLimit.currentUsage} of ${versionLimit.limit} versions.`;
  }
});
</script>

<template>
  <InlineMessage variant="info" :title>
    <template v-if="upgradeUrl"><a :href="upgradeUrl">Upgrade</a></template>
    <template v-else>Upgrade</template>
    to use unlimited versions.
  </InlineMessage>
</template>
