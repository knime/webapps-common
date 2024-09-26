<script setup lang="ts">
import { computed, watch } from "vue";
import { mergeDeep } from "@/nodeDialog/utils";
import { InputField } from "@knime/components";
import LabeledControl from "@/nodeDialog/uiComponents/label/LabeledControl.vue";
import useProvidedState from "@/nodeDialog/composables/components/useProvidedState";
import type Control from "@/nodeDialog/types/Control";
import { FlowSettings } from "@/nodeDialog/api/types";
import type Credentials from "./types/Credentials";

const props = defineProps<{
  /**
   * jsonforms control of this component.
   * The data are not used but instead passed via the data prop.
   */
  control: Control;
  /**
   * The data prop
   */
  data: Credentials;
  /**
   * The associated flow settings
   */
  flowSettings: FlowSettings | null;
  disabled: boolean;
}>();

const emit = defineEmits<{
  change: [Credentials];
}>();

const getDefaultData = (): Credentials => ({
  password: "",
  secondFactor: "",
  username: "",
});

const data = computed(() => {
  return props.data ?? getDefaultData();
});

const onChangeUsername = (username: string) => {
  emit("change", mergeDeep(data.value, { username }));
};
const onChangePassword = (password: string) => {
  emit("change", mergeDeep(data.value, { password, isHiddenPassword: false }));
};
const onChangeSecondFactor = (secondFactor: string) => {
  emit(
    "change",
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

const options = computed(() => props.control.uischema.options ?? {});

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
  () => props.flowSettings?.controllingFlowVariableName,
);
watch(
  () => controllingFlowVariableName.value,
  (flowVariableName) => {
    if (flowVariableName) {
      emit("change", mergeDeep(data.value, { flowVariableName }));
    } else {
      emit("change", getDefaultData());
    }
  },
);
const onControllingFlowVariableSet = (value: Credentials) => {
  emit("change", mergeDeep<Credentials>(data.value, value));
};
</script>

<template>
  <LabeledControl
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
        compact
        type="text"
        @update:model-value="onChangeUsername"
      />
      <InputField
        v-if="showPassword"
        :class="{ margin: showUsername }"
        :placeholder="passwordLabel"
        :model-value="displayedPassword"
        :disabled="disabled"
        compact
        type="password"
        @update:model-value="onChangePassword"
      />
      <InputField
        v-if="showSecondFactor"
        :class="{ margin: showUsername || showPassword }"
        :placeholder="secondFactorLabel"
        :model-value="displayedSecondFactor"
        :disabled="disabled"
        compact
        type="password"
        @update:model-value="onChangeSecondFactor"
      />
    </div>
  </LabeledControl>
</template>

<style lang="postcss" scoped>
.margin {
  margin-top: 10px;
}
</style>
