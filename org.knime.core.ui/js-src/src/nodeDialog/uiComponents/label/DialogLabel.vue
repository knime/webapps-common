<script setup lang="ts">
import { Ref, nextTick, onMounted, ref } from "vue";
import FlowVariableButton from "../flowVariables/components/FlowVariableButton.vue";
import DescriptionPopover from "../description/DescriptionPopover.vue";
import ErrorMessage from "../ErrorMessage.vue";
import Label from "webapps-common/ui/components/forms/Label.vue";
import ReexecutionIcon from "webapps-common/ui/assets/img/icons/reexecution.svg";

withDefaults(
  defineProps<{
    title: string;
    description: string | undefined;
    errors?: string[];
    showReexecutionIcon: boolean;
    show: boolean;
  }>(),
  {
    errors: () => [],
  },
);

defineEmits<{
  controllingFlowVariableSet: [value: any];
}>();

const hover = ref(false);
const labeledElement: Ref<null | HTMLElement> = ref(null);
const wrapper: Ref<null | HTMLElement> = ref(null);
const labelForId: Ref<null | string> = ref(null);

onMounted(() => {
  // Wait one tick for the labelForId to be applied to the control element
  nextTick().then(() => {
    labeledElement.value =
      wrapper.value?.querySelector?.(`#${labelForId.value}`) ?? null;
  });
});
</script>

<template>
  <div
    v-if="show"
    ref="wrapper"
    class="dialog-label"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <div ref="controlHeader" class="control-header">
      <div class="left">
        <slot name="before-label" />
        <Label
          :text="title"
          class="label"
          compact
          @label-for-id="labelForId = $event"
        />
        <ReexecutionIcon v-if="showReexecutionIcon" class="reexecution-icon" />
      </div>
      <FlowVariableButton
        :hover="hover"
        @controlling-flow-variable-set="
          $emit('controllingFlowVariableSet', $event)
        "
      />
      <DescriptionPopover
        v-if="description"
        :html="description"
        :hover="hover"
        :ignored-click-outside-target="labeledElement"
      />
    </div>
    <slot :label-for-id="labelForId" />
    <ErrorMessage :errors="errors.map((message) => ({ message }))" />
  </div>
  <slot v-else :label-for-id="labelForId" />
</template>

<style lang="postcss" scoped>
.dialog-label {
  /**
   * This is necessary to fixate the dialog popovers
  */
  position: relative;

  & .control-header {
    display: flex;
    max-width: 100%;

    & .left {
      min-width: 0;
      flex: 1;
      justify-content: flex-start;
      display: flex;

      & .label {
        min-width: 0;
        flex-shrink: 1;
      }

      & .reexecution-icon {
        flex-shrink: 0;
        height: 10px;
        margin: 3px 0 1px 5px;
      }
    }
  }

  & :deep(.label-text) {
    display: inline-block;
  }

  & .icons-next-to-label {
    flex: 1;
  }
}
</style>
