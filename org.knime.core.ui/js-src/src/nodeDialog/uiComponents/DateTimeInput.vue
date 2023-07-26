<script>
import { defineComponent } from "vue";
import { rendererProps } from "@jsonforms/vue";
import { isModelSettingAndHasNodeView, getFlowVariablesMap } from "../utils";
import LabeledInput from "./LabeledInput.vue";
import DateInput from "webapps-common/ui/components/forms/DateTimeInput.vue";
import DialogComponentWrapper from "./DialogComponentWrapper.vue";
import { useJsonFormsControlWithUpdate } from "./composables/jsonFormsControlWithUpdate";

const DateTimeInput = defineComponent({
  name: "DateTimeInput",
  components: {
    DateInput,
    LabeledInput,
    DialogComponentWrapper,
  },
  props: {
    ...rendererProps(),
  },
  setup(props) {
    return useJsonFormsControlWithUpdate(props);
  },
  computed: {
    isModelSettingAndHasNodeView() {
      return isModelSettingAndHasNodeView(this.control);
    },
    flowSettings() {
      return getFlowVariablesMap(this.control);
    },
    disabled() {
      return (
        !this.control.enabled ||
        this.flowSettings?.controllingFlowVariableAvailable
      );
    },
    options() {
      return this.control.uischema.options;
    },
    minimum() {
      const minDate = this.options?.minimum
        ? new Date(this.options?.minimum)
        : null;
      return minDate;
    },
    maximum() {
      const maxDate = this.options?.maximum
        ? new Date(this.options?.maximum)
        : null;
      return maxDate;
    },
    showTime() {
      return this.options?.showTime;
    },
    showSeconds() {
      return this.options?.showSeconds;
    },
    showMilliseconds() {
      return this.options?.showMilliseconds;
    },
    timezone() {
      return this.options?.timezone;
    },
    dateFormat() {
      return this.options?.dateFormat;
    },
  },
  methods: {
    onChange(event) {
      this.handleChange(this.control.path, event);
      if (this.isModelSettingAndHasNodeView) {
        this.$store.dispatch("pagebuilder/dialog/dirtySettings", true);
      }
    },
  },
});
export default DateTimeInput;
</script>

<template>
  <DialogComponentWrapper :control="control" style="min-width: 0">
    <LabeledInput
      :text="control.label"
      :description="control.description"
      :errors="[control.errors]"
      :show-reexecution-icon="isModelSettingAndHasNodeView"
      :scope="control.uischema.scope"
      :flow-settings="flowSettings"
    >
      <DateInput
        :model-value="new Date(control.data)"
        class="date-time"
        :required="true"
        :show-time="showTime"
        :show-seconds="showSeconds"
        :show-milliseconds="showMilliseconds"
        :timezone="timezone"
        :min="minimum"
        :max="maximum"
        :date-format="dateFormat"
        :disabled="disabled"
        @update:model-value="onChange"
      />
    </LabeledInput>
  </DialogComponentWrapper>
</template>

<style lang="postcss" scoped>
.date-time {
  &:deep(.date-picker) {
    width: 100%;
    margin-top: 0;
    margin-right: 0;
    max-width: unset;
  }

  &:deep(.time) {
    width: 100%;

    & .wrapper {
      flex: 1 1;
    }
  }
}
</style>
