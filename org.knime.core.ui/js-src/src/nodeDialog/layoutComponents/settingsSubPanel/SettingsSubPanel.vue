<script lang="ts">
export interface Props {
  applyText?: string;
  applyDisabled?: boolean;
  showBackArrow?: boolean;
}
</script>

<script setup lang="ts">
import { ref, watch } from "vue";
import SideDrawer from "webapps-common/ui/components/SideDrawer.vue";
import Form from "../Form.vue";
import inject from "../../utils/inject";
import Button from "webapps-common/ui/components/Button.vue";
import SidePanelBackArrow from "./SidePanelBackArrow.vue";
withDefaults(defineProps<Props>(), {
  applyText: "Apply",
  applyDisabled: false,
  showBackArrow: false,
});

const emit = defineEmits<{ apply: [] }>();

const isExpanded = ref(false);
const expand = () => {
  isExpanded.value = true;
};
const close = () => {
  isExpanded.value = false;
};

const apply = () => emit("apply");

const setSubPanelExpanded = inject("setSubPanelExpanded")!;

defineExpose({ close });
watch(
  () => isExpanded.value,
  (isExpanded) => setSubPanelExpanded({ isExpanded }),
);
</script>

<template>
  <slot name="expand-button" :expand="expand" />
  <SideDrawer :is-expanded="isExpanded" class="side-drawer">
    <Form>
      <template #default>
        <SidePanelBackArrow v-if="showBackArrow" @click="close" />
        <slot />
      </template>
      <template #bottom-content>
        <div class="bottom-buttons">
          <Button with-border compact @click="close"> Cancel </Button>
          <Button compact primary :disabled="applyDisabled" @click="apply">
            {{ applyText }}
          </Button>
        </div>
      </template>
    </Form>
  </SideDrawer>
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
