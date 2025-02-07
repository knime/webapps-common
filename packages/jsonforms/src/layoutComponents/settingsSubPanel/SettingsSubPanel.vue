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

const setSubPanelExpanded: () => {} = inject("setSubPanelExpanded")!;

watch(
  isExpanded,
  // @ts-ignore
  (isExpanded) => setSubPanelExpanded({ isExpanded }),
);
// @ts-ignore
const subSettingsPanels = inject("getPanelsContainer")!()! as HTMLElement;
</script>

<template>
  <slot name="expand-button" :expand="expand" />
  <Teleport :disabled="!isExpanded" :to="subSettingsPanels">
    <SideDrawer :is-expanded="isExpanded" class="side-drawer">
      <Form>
        <template #default>
          <SidePanelBackArrow v-if="showBackArrow" @click="close" />
          <slot />
        </template>
        <template #bottom-content>
          <slot name="bottom-content" />
        </template>
      </Form>
    </SideDrawer>
  </Teleport>
</template>

<style scoped lang="postcss">
.side-drawer {
  --position-common-side-drawer: absolute;
  --width-common-side-drawer: 100%;
}
</style>
