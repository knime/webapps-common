<script setup lang="ts">
import { PropType, computed, watch } from "vue";
import { mergeDeep } from "@/nodeDialog/utils";
import InputField from "webapps-common/ui/components/forms/InputField.vue";
import useDialogControl from "@/nodeDialog/composables/components/useDialogControl";
import LabeledInput from "@/nodeDialog/uiComponents/label/LabeledInput.vue";
import { rendererProps } from "@jsonforms/vue";
import useProvidedState from "@/nodeDialog/composables/components/useProvidedState";

interface Credentials {
  username: string;
  password: string;
  secondFactor: string;
  isHiddenPassword?: boolean;
  isHiddenSecondFactor?: boolean;
  flowVariableName?: string | null;
}
const props = defineProps({
  ...rendererProps(),
  jsonFormsControl: {
    type: Object as PropType<null | ReturnType<typeof useDialogControl>>,
    required: false,
    default: null,
  },
});
const {
  control,
  handleDirtyChange: onChange,
  disabled,
  flowSettings,
} = useDialogControl<Credentials>({ props });

const getDefaultData = (): Credentials => ({
  password: "",
  secondFactor: "",
  username: "",
});

const data = computed(() => {
  return control.value.data ?? getDefaultData();
});

const onChangeUsername = (username: string) => {
  onChange(mergeDeep(data.value, { username }));
};
const onChangePassword = (password: string) => {
  onChange(mergeDeep(data.value, { password, isHiddenPassword: false }));
};
const onChangeSecondFactor = (secondFactor: string) => {
  onChange(
    mergeDeep(data.value, { secondFactor, isHiddenSecondFactor: false }),
  );
};

const hiddenPassword = "*****************";
const displayedPassword = computed(() => {
  return data.value.isHiddenPassword ? hiddenPassword : data.value.password;
});
const displayedSecondFactor = computed(() => {
  return data.value.isHiddenSecondFactor
    ? hiddenPassword
    : data.value.secondFactor;
});

const options = computed(() => control.value.uischema.options ?? {});

// Username visibility
const hasUsername = useProvidedState(
  computed(() => options.value.hasUsernameProvider),
  true,
);
const hideUsername = computed(() => options.value.hideUsername ?? false);
const showUsername = computed(() => hasUsername.value && !hideUsername.value);

// Password visibility
const hasPassword = useProvidedState(
  computed(() => options.value.hasPasswordProvider),
  true,
);
const hidePassword = computed(() => options.value.hidePassword ?? false);
const showPassword = computed(() => hasPassword.value && !hidePassword.value);

const showSecondFactor = computed(
  () => showPassword.value && (options.value.showSecondFactor ?? false),
);
const usernameLabel = computed(
  () => options.value?.usernameLabel ?? "Username",
);
const passwordLabel = computed(
  () => options.value?.passwordLabel ?? "Password",
);
const secondFactorLabel = computed(
  () => options.value?.secondFactorLabel ?? "Second authentication factor",
);

// Flow variables

const controllingFlowVariableName = computed(
  () => flowSettings.value?.controllingFlowVariableName,
);
watch(
  () => controllingFlowVariableName.value,
  (flowVariableName) => {
    if (flowVariableName) {
      onChange(mergeDeep(data.value, { flowVariableName }));
    } else {
      onChange(getDefaultData());
    }
  },
);
const onControllingFlowVariableSet = (value: Credentials) => {
  onChange(mergeDeep<Credentials>(data.value, value));
};
</script>

<template>
  <LabeledInput
    #default="{ labelForId }"
    :control="control"
    @controlling-flow-variable-set="onControllingFlowVariableSet"
  >
    <div :id="labelForId ?? undefined" class="credentials-input-wrapper">
      <InputField
        v-if="showUsername"
        :placeholder="usernameLabel"
        :model-value="data.username"
        :disabled="disabled"
        type="text"
        @update:model-value="onChangeUsername"
      />
      <InputField
        v-if="showPassword"
        :class="{ margin: showUsername }"
        :placeholder="passwordLabel"
        :model-value="displayedPassword"
        :disabled="disabled"
        type="password"
        @update:model-value="onChangePassword"
      />
      <InputField
        v-if="showSecondFactor"
        :class="{ margin: showUsername || showPassword }"
        :placeholder="secondFactorLabel"
        :model-value="displayedSecondFactor"
        :disabled="disabled"
        type="password"
        @update:model-value="onChangeSecondFactor"
      />
    </div>
  </LabeledInput>
</template>

<style lang="postcss" scoped>
.margin {
  margin-top: 10px;
}
</style>
