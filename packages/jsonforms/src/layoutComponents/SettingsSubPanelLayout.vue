<script setup lang="ts">
import { DispatchRenderer } from "@jsonforms/vue";

import { FunctionButton } from "@knime/components";
import NextIcon from "@knime/styles/img/icons/arrow-next.svg";

import type { VueLayoutProps } from "../higherOrderComponents/layout/types";

import VerticalLayoutBase from "./VerticalLayoutBase.vue";
import SectionHeading from "./section/SectionHeading.vue";
import SettingsSubPanel from "./settingsSubPanel/SettingsSubPanel.vue";

defineProps<VueLayoutProps>();
</script>

<template>
  <SettingsSubPanel show-back-arrow>
    <template #expand-button="{ expand }">
      <SectionHeading :title-text="layout.uischema.label">
        <template #right-buttons>
          <FunctionButton class="set-button" @click="expand">
            <span>Set</span>
            <NextIcon />
          </FunctionButton>
        </template>
      </SectionHeading>
    </template>

    <VerticalLayoutBase
      #default="{ element, index }"
      :elements="layout.uischema.elements"
    >
      <DispatchRenderer
        :key="`${layout.path}-${index}`"
        :schema="layout.schema"
        :uischema="element"
        :path="layout.path"
        :enabled="layout.enabled"
        :renderers="layout.renderers"
        :cells="layout.cells"
      />
    </VerticalLayoutBase>
  </SettingsSubPanel>
</template>

<style lang="postcss" scoped>
.set-button {
  height: 30px;
}
</style>
