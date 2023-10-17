<script lang="ts">
import { defineComponent } from "vue";
import { rendererProps } from "@jsonforms/vue";
import {
  isModelSettingAndHasNodeView,
  getFlowVariablesMap,
  mergeDeep,
} from "../utils";
import InputField from "webapps-common/ui/components/forms/InputField.vue";
import LabeledInput from "./LabeledInput.vue";
import DialogComponentWrapper from "./DialogComponentWrapper.vue";
import { useJsonFormsControlWithUpdate } from "../composables/useJsonFormsControlWithUpdate";

interface Credentials {
  username: string;
  password: string;
}

const CredentialsInput = defineComponent({
  name: "CredentialsInput",
  components: {
    InputField,
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
        Boolean(this.flowSettings?.controllingFlowVariableName)
      );
    },
  },
  methods: {
    onChange(credentials: Credentials) {
      this.handleChange(this.control.path, credentials);
      if (this.isModelSettingAndHasNodeView) {
        // @ts-ignore
        this.$store.dispatch("pagebuilder/dialog/dirtySettings", true);
      }
    },
    onChangeUsername(username: string) {
      this.onChange(mergeDeep(this.control.data, { username }));
    },
    onChangePassword(password: string) {
      this.onChange(mergeDeep(this.control.data, { password }));
    },
  },
});
export default CredentialsInput;
</script>

<template>
  <DialogComponentWrapper :control="control" style="min-width: 0">
    <LabeledInput
      #default="{ labelForId }"
      :config-keys="control?.schema?.configKeys"
      :flow-variables-map="control.rootSchema.flowVariablesMap"
      :path="control.path"
      :text="control.label"
      :description="control.description"
      :errors="[control.errors]"
      :show-reexecution-icon="isModelSettingAndHasNodeView"
      :flow-settings="flowSettings"
      @controlling-flow-variable-set="onChange"
    >
      <div :id="labelForId" class="input-fields-wrapper">
        <InputField
          class="input-field-username"
          :model-value="control.data.username"
          :disabled="disabled"
          type="text"
          @update:model-value="onChangeUsername"
        />
        <InputField
          class="input-field-password"
          :model-value="control.data.password"
          :disabled="disabled"
          type="password"
          @update:model-value="onChangePassword"
        />
      </div>
    </LabeledInput>
  </DialogComponentWrapper>
</template>
