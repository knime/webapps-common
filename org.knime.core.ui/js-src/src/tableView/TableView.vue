<script setup lang="ts">
import { inject } from "vue";
import "../common/main.css";

import {
  ReportingService,
  type UIExtensionService,
} from "@knime/ui-extension-service";

import TableViewInteractive from "./TableViewInteractive.vue";
import TableViewReport from "./TableViewReport.vue";

const getKnimeService = (inject("getKnimeService") ??
  (() => null)) as () => UIExtensionService;
const knimeService = getKnimeService();
const reportingService = new ReportingService(knimeService);
const isReport = reportingService.isReportingActive();
const onRendered = () => reportingService.setRenderCompleted();
</script>

<template>
  <TableViewReport v-if="isReport" @rendered="onRendered" />
  <TableViewInteractive v-else />
</template>
