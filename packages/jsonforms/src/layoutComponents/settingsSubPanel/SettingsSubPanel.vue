<script lang="ts">
import {
  type InjectionKey,
  type Ref,
  computed,
  inject,
  provide,
  ref,
  watch,
} from "vue";

/**
 * Exported for tests
 */
export const subPanelDestInjectionKey: InjectionKey<Ref<HTMLElement | null>> =
  Symbol("subPanelDestInjectionKey");

export const provideSideDrawerTeleportDest = (
  subPanelTeleportDest: Ref<HTMLElement | null>,
) => provide(subPanelDestInjectionKey, subPanelTeleportDest);
</script>

<script setup lang="ts">
import { SideDrawer } from "@knime/components";
import * as $colors from "@knime/styles/colors/knimeColors";

import Form from "../Form.vue";

import SidePanelBackArrow from "./SettingsSubPanelBackArrow.vue";

export type SettingsSubPanelProps = {
  showBackArrow?: boolean;
  hideButtonsWhenExpanded?: boolean;
  backgroundColorOverride?: string;
  backButtonLabel?: string;
};

const {
  showBackArrow = true,
  hideButtonsWhenExpanded = false,
  backgroundColorOverride = undefined,
  backButtonLabel = undefined,
} = defineProps<SettingsSubPanelProps>();

const isExpanded = ref(false);
const expand = () => {
  isExpanded.value = true;
};
const close = () => {
  isExpanded.value = false;
};

defineExpose({ expand, close });

const setSubPanelExpanded: () => object = inject("setSubPanelExpanded")!;

watch(
  isExpanded,
  (isExpanded) =>
    // @ts-expect-error expected 0 arguments
    hideButtonsWhenExpanded && setSubPanelExpanded({ isExpanded }),
);

const subSettingsPanels = inject(subPanelDestInjectionKey)!;

const styleOverrides = computed(() => ({
  width: "100%",
  position: "absolute" as const,
  backgroundColor: backgroundColorOverride ?? $colors.Porcelain,
}));
</script>

<template>
  <slot name="expand-button" :expand="expand" />
  <Teleport :to="subSettingsPanels">
    <SideDrawer :is-expanded class="side-drawer" :style-overrides>
      <div class="side-drawer-content">
        <SidePanelBackArrow
          v-if="showBackArrow"
          :background-color-override
          :back-button-label
          @click="close"
        />
        <div class="main-content">
          <Form>
            <template #default>
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

<style scoped>
.side-drawer-content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;

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

<style>
/* Adjust the z-index of the side drawer to fix dialogue popovers */
* {
  --z-index-common-side-drawer: 3;
  --z-index-common-mobile-side-drawer: 3;
}
</style>
