<script setup lang="ts">
import { inject, ref, watch } from "vue";

import { SideDrawer } from "@knime/components";

import Form from "../Form.vue";

import SidePanelBackArrow from "./SettingsSubPanelBackArrow.vue";

export interface Props {
  showBackArrow?: boolean;
}

withDefaults(defineProps<Props>(), {
  showBackArrow: false,
});

const isExpanded = ref(false);
const expand = () => {
  isExpanded.value = true;
};
const close = () => {
  isExpanded.value = false;
};

defineExpose({ expand, close });

const setSubPanelExpanded: () => {} = inject("setSubPanelExpanded")!;

watch(
  isExpanded,
  // @ts-expect-error expected 0 arguments
  (isExpanded) => setSubPanelExpanded({ isExpanded }),
);
// @ts-expect-error expression not callable
const subSettingsPanels = inject("getPanelsContainer")!()! as HTMLElement;
</script>

<template>
  <slot name="expand-button" :expand="expand" />
  <Teleport :disabled="!isExpanded" :to="subSettingsPanels">
    <SideDrawer
      :is-expanded="isExpanded"
      class="side-drawer"
      :style-overrides="{ width: '100%', position: 'absolute' }"
    >
      <div class="side-drawer-content">
        <div class="main-content">
          <Form>
            <template #default>
              <SidePanelBackArrow v-if="showBackArrow" @click="close" />
              <slot />
            </template>
          </Form>
        </div>
        <div class="bottom-content">
          <slot name="bottom-content" />
        </div>
      </div>
    </SideDrawer>
  </Teleport>
</template>

<style scoped lang="postcss">
.side-drawer-content {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  & .main-content {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
  }

  & .bottom-content {
    flex: 0 0 auto;
    height: fit-content;
  }
}
</style>
