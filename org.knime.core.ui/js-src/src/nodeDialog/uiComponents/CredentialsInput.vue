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
  secondFactor: string;
  isHiddenPassword?: boolean;
  isHiddenSecondFactor?: boolean;
  flowVariableName?: string | null;
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
    controllingFlowVariableName() {
      return this.flowSettings?.controllingFlowVariableName;
    },
    disabled() {
      return (
        !this.control.enabled ||
        Boolean(this.flowSettings?.controllingFlowVariableName)
      );
    },
    data() {
      return (
        this.control.data ?? { password: "", secondFactor: "", username: "" }
      );
    },
    displayedPassword() {
      return this.data.isHiddenPassword
        ? "*****************"
        : this.data.password;
    },
    displayedSecondFactor() {
      return this.data.isHiddenSecondFactor
        ? "*****************"
        : this.data.secondFactor;
    },
    hideUsername() {
      return this.control.uischema.options?.hideUsername ?? false;
    },
    hidePassword() {
      return this.control.uischema.options?.hidePassword ?? false;
    },
    showSecondFactor() {
      return this.control.uischema.options?.showSecondFactor ?? false;
    },
    usernameLabel() {
      return this.control.uischema.options?.usernameLabel ?? "Username";
    },
    passwordLabel() {
      return this.control.uischema.options?.passwordLabel ?? "Password";
    },
    secondFactorLabel() {
      return (
        this.control.uischema.options?.secondFactorLabel ??
        "Second authentication factor"
      );
    },
  },
  watch: {
    controllingFlowVariableName(flowVariableName) {
      this.onChange(mergeDeep(this.data, { flowVariableName }));
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
    onControllingFlowVariableSet(value: Credentials) {
      this.onChange(mergeDeep(this.data, value));
    },
    onChangeUsername(username: string) {
      this.onChange(mergeDeep(this.data, { username }));
    },
    onChangePassword(password: string) {
      this.onChange(
        mergeDeep(this.data, { password, isHiddenPassword: false }),
      );
    },
    onChangeSecondFactor(secondFactor: string) {
      this.onChange(
        mergeDeep(this.data, { secondFactor, isHiddenSecondFactor: false }),
      );
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
      @controlling-flow-variable-set="onControllingFlowVariableSet"
    >
      <div :id="labelForId" class="credentials-input-wrapper">
        <InputField
          v-if="!hideUsername"
          :placeholder="usernameLabel"
          :model-value="data.username"
          :disabled="disabled"
          type="text"
          @update:model-value="onChangeUsername"
        />
        <InputField
          v-if="!hidePassword"
          :class="{ margin: !hideUsername }"
          :placeholder="passwordLabel"
          :model-value="displayedPassword"
          :disabled="disabled"
          type="password"
          @update:model-value="onChangePassword"
        />
        <InputField
          v-if="showSecondFactor"
          :class="{ margin: !hideUsername || !hidePassword }"
          :placeholder="secondFactorLabel"
          :model-value="displayedSecondFactor"
          :disabled="disabled"
          type="password"
          @update:model-value="onChangeSecondFactor"
        />
      </div>
    </LabeledInput>
  </DialogComponentWrapper>
</template>

<style lang="postcss" scoped>
.margin {
  margin-top: 10px;
}
</style>
