<script setup lang="ts">
import { computed, ref } from "vue";
import { DispatchRenderer } from "@jsonforms/vue";

import { FunctionButton } from "@knime/components";
import NextIcon from "@knime/styles/img/icons/arrow-next.svg";

import type { VueLayoutProps } from "../higherOrderComponents/layout/types";

import VerticalLayoutBase from "./VerticalLayoutBase.vue";
import SectionHeading from "./section/SectionHeading.vue";
import SettingsSubPanel from "./settingsSubPanel/SettingsSubPanel.vue";

const props = defineProps<VueLayoutProps>();

const options = computed(() => props.layout.uischema.options ?? {});
const setText = computed(() => options.value.setText ?? "Set");
const backButtonLabel = computed(
  () => options.value.backButtonLabel ?? "Back to node configuration",
);
const hover = ref(false);
</script>

<template>
  <div @mouseover="hover = true" @mouseleave="hover = false">
    <SettingsSubPanel
      show-back-arrow
      :back-button-label
      background-color-override="var(--knime-gray-ultra-light)"
    >
      <template #expand-button="{ expand }">
        <SectionHeading :title-text="layout.uischema.label">
          <template #right-buttons>
            <div class="flex-row">
              <slot name="buttons" :hover="hover" />
              <FunctionButton compact class="set-button" @click="expand">
                <span>{{ setText }}</span>
                <NextIcon />
              </FunctionButton>
            </div>
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
  </div>
</template>

<style scoped>
.set-button {
  & span {
    margin: 0 var(--space-4);
  }
}

.flex-row {
  display: flex;
  flex-direction: row;
  gap: var(--space-8);
  align-items: center;
  justify-content: flex-end;
}
</style>
