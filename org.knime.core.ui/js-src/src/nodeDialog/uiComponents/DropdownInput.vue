<script lang="ts">
import { defineComponent, type PropType } from "vue";
import { rendererProps } from "@jsonforms/vue";
import { getFlowVariablesMap, isModelSettingAndHasNodeView } from "../utils";
import Dropdown from "./loading/LoadingDropdown.vue";
import LabeledInput from "./LabeledInput.vue";
import DialogComponentWrapper from "./DialogComponentWrapper.vue";
import { AlertTypes } from "@knime/ui-extension-service";
import { set } from "lodash";
import { useJsonFormsControlWithUpdate } from "../composables/useJsonFormsControlWithUpdate";
import getFlattenedSettings from "../utils/getFlattenedSettings";
import { v4 as uuidv4 } from "uuid";
import inject from "../utils/inject";
import type SettingsData from "../types/SettingsData";
import type { IdAndText } from "../types/ChoicesUiSchema";

const DropdownInput = defineComponent({
  name: "DropdownInput",
  components: {
    Dropdown,
    LabeledInput,
    DialogComponentWrapper,
  },
  props: {
    ...rendererProps(),
    asyncInitialOptions: {
      type: Object as PropType<Promise<IdAndText[]>>,
      required: false,
      default: null,
    },
    jsonFormsControl: {
      type: Object as PropType<null | ReturnType<
        typeof useJsonFormsControlWithUpdate
      >>,
      required: false,
      default: null,
    },
    controlDataToDropdownValue: {
      type: Function as PropType<(data: any) => string>,
      required: false,
      default: (data: string) => data,
    },
    dropdownValueToControlData: {
      type: Function as PropType<(value: string | null) => any>,
      required: false,
      default: (value: string | null) => value,
    },
  },
  setup(props) {
    return {
      ...(props.jsonFormsControl ?? useJsonFormsControlWithUpdate(props)),
      getPossibleValuesFromUiSchema: inject("getPossibleValuesFromUiSchema"),
      registerWatcher: inject("registerWatcher"),
      getData: inject("getData"),
      sendAlert: inject("sendAlert"),
    };
  },
  data() {
    return {
      options: null as null | IdAndText[],
      widgetId: uuidv4(),
    };
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
        Boolean(this.flowSettings?.controllingFlowVariableName)
      );
    },
    dropdownValue() {
      return this.controlDataToDropdownValue(this.control.data);
    },
    choicesUpdateHandler() {
      return this.control.uischema.options?.choicesUpdateHandler;
    },
  },
  mounted() {
    if (this.choicesUpdateHandler) {
      const dependencies = this.control.uischema.options?.dependencies || [];
      this.registerWatcher({
        transformSettings: this.updateOptions.bind(this),
        init: this.fetchInitialOptions.bind(this),
        dependencies,
      });
    } else {
      this.setInitialOptions();
    }
  },
  methods: {
    async setInitialOptions() {
      if (this.asyncInitialOptions === null) {
        this.getPossibleValuesFromUiSchema(this.control).then((result) => {
          this.options = result;
        });
      } else {
        this.options = await this.asyncInitialOptions;
      }
    },
    async fetchInitialOptions(newSettings: SettingsData) {
      // initially only fetch possible values, but do not set a value
      // instead, use value from initial data
      await this.updateOptions(newSettings, false);
    },
    async updateOptions(newSettings: SettingsData, setNewValue = true) {
      const { result, state, message } = await this.getData({
        method: "update",
        options: [
          this.widgetId,
          this.choicesUpdateHandler,
          getFlattenedSettings(newSettings),
        ],
      });
      if (result) {
        this.handleResult(result, newSettings, setNewValue);
      }
      if (state === "FAIL") {
        this.sendAlert({
          type: AlertTypes.ERROR,
          message,
        });
        this.handleResult([], newSettings, setNewValue);
      }
    },
    handleResult(
      result: IdAndText[],
      newSettings: SettingsData,
      setNewValue = true,
    ) {
      this.options = result;
      if (setNewValue) {
        set(
          newSettings,
          this.control.path,
          this.getFirstValueFromDropdownOrNull(result),
        );
      }
    },
    getFirstValueFromDropdownOrNull(result: IdAndText[]) {
      return this.dropdownValueToControlData(
        result.length > 0 ? result[0].id : null,
      );
    },
    onChange(value: string) {
      this.handleChange(
        this.control.path,
        this.dropdownValueToControlData(value),
      );
      if (this.isModelSettingAndHasNodeView) {
        // @ts-ignore
        this.$store.dispatch("pagebuilder/dialog/dirtySettings", true);
      }
    },
  },
});
export default DropdownInput;
</script>

<template>
  <DialogComponentWrapper :control="control" style="min-width: 0">
    <LabeledInput
      #default="{ labelForId }"
      :config-keys="control?.schema?.configKeys"
      :with-flow-variables="false"
      :path="control.path"
      :text="control.label"
      :show-reexecution-icon="isModelSettingAndHasNodeView"
      :description="control.description"
      @controlling-flow-variable-set="onChange"
    >
      <Dropdown
        :id="labelForId"
        :aria-label="control.label"
        :disabled="disabled"
        :model-value="dropdownValue"
        :possible-values="options"
        @update:model-value="onChange"
      />
    </LabeledInput>
  </DialogComponentWrapper>
</template>
