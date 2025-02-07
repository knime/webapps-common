<script setup lang="ts">
import { DispatchRenderer } from "@jsonforms/vue";

import { FunctionButton } from "@knime/components";
import NextIcon from "@knime/styles/img/icons/arrow-next.svg";

import type { VueLayoutProps } from "../higherOrderComponents/layout/types";

import VerticalLayoutBase from "./VerticalLayoutBase.vue";
import SettingsSubPanel from "./settingsSubPanel/SettingsSubPanel.vue";

defineProps<VueLayoutProps>();
</script>

<template>
  <SettingsSubPanel show-back-arrow>
    <template #expand-button="{ expand }">
      <div class="section-header">
        <div class="section-header-layout-container">
          <h3>
            {{ layout.uischema.label }}
          </h3>
          <slot name="expand-button" :expand="expand">
            <FunctionButton class="set-button" @click="expand">
              <span>Set</span>
              <NextIcon />
            </FunctionButton>
          </slot>
        </div>
      </div>
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
.section {
  &:not(:first-child) {
    padding-top: var(--space-32);
  }
}

.section-header {
  position: sticky;
  top: 0;
  background-color: var(--knime-gray-ultra-light);
  z-index: 1;
  margin: 0 calc(-1 * var(--horizontal-dialog-padding));

  & .section-header-layout-container {
    border-bottom: 1px solid var(--knime-silver-sand);
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: calc(100% - var(--horizontal-dialog-padding) * 2);
    margin: 0 var(--horizontal-dialog-padding);

    & h3 {
      color: var(--knime-masala);
      font-size: 16px;
      line-height: 40px;
      margin: 0;
    }

    & .set-button {
      height: 30px;
    }
  }
}
</style>
