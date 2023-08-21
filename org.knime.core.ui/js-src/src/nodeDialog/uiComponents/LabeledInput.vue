<script>
import Label from "webapps-common/ui/components/forms/Label.vue";
import ErrorMessage from "./ErrorMessage.vue";
import FlowVariableButton from "./flowVariables/FlowVariableButton.vue";
import FlowVariableIcon from "./flowVariables/FlowVariableIcon.vue";
import ReexecutionIcon from "webapps-common/ui/assets/img/icons/reexecution.svg";
import DescriptionPopover from "./description/DescriptionPopover.vue";

const LabeledInput = {
  name: "LabeledInput",
  components: {
    Label,
    ErrorMessage,
    FlowVariableButton,
    FlowVariableIcon,
    ReexecutionIcon,
    DescriptionPopover,
  },
  data() {
    return {
      hover: false,
      labeledElement: null,
      labelForId: null,
    };
  },
  props: {
    text: {
      default: "",
      type: String,
    },
    description: {
      default: null,
      type: String,
    },
    path: {
      required: true,
      type: String,
    },
    configKeys: {
      type: Array,
      required: false,
    },
    errors: {
      default: () => [],
      type: Array,
    },
    showErrors: {
      default: true,
      type: Boolean,
    },
    showReexecutionIcon: {
      default: false,
      type: Boolean,
    },
    withFlowVariables: {
      default: true,
      type: Boolean,
    },
    flowSettings: {
      default: null,
      type: Object,
    },
    flowVariablesMap: {
      default: () => {},
      type: Object,
    },
    show: {
      default: true,
      type: Boolean,
    },
  },
  emits: ["controllingFlowVariableSet"],
  mounted() {
    // Wait one tick for the labelForId to be applied to the control element
    this.$nextTick().then(() => {
      this.labeledElement =
        this.$el.querySelector?.(`#${this.labelForId}`) || null;
    });
  },
};
export default LabeledInput;
</script>

<template>
  <div
    v-if="show"
    class="labeled-input"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <div ref="controlHeader" class="control-header">
      <div class="left">
        <Label
          :text="text"
          :compact="true"
          class="label"
          @label-for-id="labelForId = $event"
        />
        <ReexecutionIcon v-if="showReexecutionIcon" class="reexecution-icon" />
      </div>
      <FlowVariableButton
        v-if="withFlowVariables"
        :flow-settings="flowSettings"
        :flow-variables-map="flowVariablesMap"
        :path="path"
        :config-keys="configKeys"
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
    <ErrorMessage v-if="showErrors" :error="errors" />
  </div>
  <slot v-else />
</template>

<style lang="postcss" scoped>
.labeled-input {
  margin-bottom: 20px;
  position: relative;

  & > *:last-child {
    margin-top: 7px;
  }

  & span {
    font-weight: 300;
    font-size: 13px;
    color: var(--theme-color-error);
    display: inline-block;
    position: relative;
  }

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
