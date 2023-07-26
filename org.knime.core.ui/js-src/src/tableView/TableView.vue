<script setup lang="ts">
import TableViewInteractive from "./TableViewInteractive.vue";
import TableViewReport from "./TableViewReport.vue";
import { useStore } from "vuex";
import { inject } from "vue";
import type { KnimeService } from "@knime/ui-extension-service";
const getKnimeService = (inject("getKnimeService") ||
  (() => null)) as () => KnimeService;
const knimeService = getKnimeService();
const isReport = Boolean(knimeService.extensionConfig.generatedImageActionId);
// TODO UIEXT-1052 move to knime-ui-extension-service
const store = useStore();
const onRendered = () => {
  store.dispatch("pagebuilder/setReportingContent", {
    nodeId: knimeService.extensionConfig.nodeId,
    reportContent: false,
  });
};
</script>

<template>
  <TableViewReport v-if="isReport" @rendered="onRendered" />
  <TableViewInteractive v-else />
</template>
