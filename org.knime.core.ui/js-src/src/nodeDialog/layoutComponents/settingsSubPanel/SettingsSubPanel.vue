<script lang="ts">
export interface Props {
  showBackArrow?: boolean;
}
</script>

<script setup lang="ts">
import { ref, watch } from "vue";

import { Button, SideDrawer } from "@knime/components";

import inject from "../../utils/inject";
import Form from "../Form.vue";

import { setUpApplyButton } from ".";
import SidePanelBackArrow from "./SidePanelBackArrow.vue";

withDefaults(defineProps<Props>(), {
  showBackArrow: false,
});

const emit = defineEmits(["apply"]);

const isExpanded = ref(false);
const expand = () => {
  isExpanded.value = true;
};
const close = () => {
  isExpanded.value = false;
};
const emitApplyAndClose = () => {
  emit("apply");
  close();
};

const setSubPanelExpanded = inject("setSubPanelExpanded")!;

const {
  text: applyText,
  disabled: applyDisabled,
  element: applyButton,
  onApply,
} = setUpApplyButton();

const apply = () =>
  onApply
    .value?.()
    .then(emitApplyAndClose)
    .catch(() => {});
watch(
  () => isExpanded.value,
  (isExpanded) => setSubPanelExpanded({ isExpanded }),
);
const subSettingsPanels = inject("getPanelsContainer")!()!;
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
          <div class="bottom-buttons">
            <Button with-border compact @click="close"> Cancel </Button>
            <Button
              ref="applyButton"
              compact
              primary
              :disabled="applyDisabled"
              @click="apply"
            >
              {{ applyText }}
            </Button>
          </div>
        </template>
      </Form>
    </SideDrawer>
  </Teleport>
</template>

<style scoped lang="postcss">
.side-drawer {
  position: absolute;
  width: 100%;

  & .bottom-buttons {
    display: flex;
    justify-content: space-between;
    height: 60px;
    padding: 14px 20px;
  }
}
</style>
