<script setup lang="ts">
import TableViewInteractive from './TableViewInteractive.vue';
import TableViewReport from './TableViewReport.vue';
import { inject } from 'vue';
import { ReportingService, type KnimeService } from '@knime/ui-extension-service';

const getKnimeService = (inject('getKnimeService') || (() => null)) as (() => KnimeService);
const knimeService = getKnimeService();
const reportingService = new ReportingService(knimeService);
const isReport = reportingService.isReportingActive();
const onRendered = () => reportingService.setRenderCompleted();
</script>

<template>
  <TableViewReport
    v-if="isReport"
    @rendered="onRendered"
  />
  <TableViewInteractive v-else />
</template>
