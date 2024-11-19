<script setup lang="ts" generic="SettingValue extends Stringifyable">
import LabeledControl from "./label/LabeledControl.vue";
import { FunctionButton, LoadingIcon } from "@knime/components";
import { v4 as uuidv4 } from "uuid";
import inject from "../utils/inject";
import { computed, onMounted, ref } from "vue";
import useDialogControl from "../composables/components/useDialogControl";
import getFlattenedSettings from "../utils/getFlattenedSettings";
import type { SettingsData } from "../types/SettingsData";
import { rendererProps } from "@jsonforms/vue";
import { type Stringifyable } from "../composables/components/JsonSettingsComparator";
import type { Result as ResultOfType } from "@/nodeDialog/api/types/Result";
type Id = string; // NOSONAR intended type alias
interface State {
  id: Id;
  nextState: Id;
  disabled: boolean;
  primary: boolean;
  text: string;
}

interface ButtonChange {
  settingValue: SettingValue;
  setSettingValue: boolean;
  buttonState: Id;
}

type Result = ResultOfType<ButtonChange>;

const registerWatcher = inject("registerWatcher");
const getData = inject("getData");
const props = defineProps(rendererProps());
const { control, onChange } = useDialogControl({ props });

const errorMessage = ref(null as null | string);
const clearError = () => {
  errorMessage.value = null;
};

const currentSettings = ref({});
const saveCurrentSettings = (newSettings: SettingsData) => {
  currentSettings.value = getFlattenedSettings(newSettings);
};

const currentState = ref({} as State);
const states = computed(
  () => (control.value.uischema.options?.states as State[]) ?? [],
);

const setButtonState = (newButtonStateId: Id) => {
  clearError();
  currentState.value = states.value.find(({ id }) => id === newButtonStateId)!;
};

const saveResult = (newVal: SettingValue) => {
  // without setTimeout, the value is not updated when triggered via onUpdate
  setTimeout(() => onChange(newVal));
};

const setNextState = (dataServiceResult: ButtonChange) => {
  if (dataServiceResult === null) {
    return;
  }
  const { settingValue, setSettingValue, buttonState } = dataServiceResult;
  if (setSettingValue) {
    saveResult(settingValue);
  }
  setButtonState(buttonState);
};

const handleDataServiceResult = (
  receivedData: Result,
  resetCallback = () => {},
) => {
  const { state } = receivedData;
  if (state === "SUCCESS") {
    setNextState(receivedData.result);
    return;
  }
  if (state === "FAIL") {
    errorMessage.value = receivedData.message[0];
  }
  resetCallback();
};

const numPendingRequests = ref(0);
const widgetId = uuidv4();
const performRequest = async (
  {
    method,
    options,
    handler,
  }: {
    method:
      | "settings.initializeButton"
      | "settings.update"
      | "settings.invokeButtonAction";
    options: any[];
    handler: string;
  },
  resetCallback = () => {},
) => {
  numPendingRequests.value += 1;
  const receivedData = await getData({
    method,
    options: [widgetId, handler, ...options],
  });
  numPendingRequests.value -= 1;
  handleDataServiceResult(receivedData, resetCallback);
};

const initialize = async (newSettings: SettingsData) => {
  saveCurrentSettings(newSettings);
  await performRequest({
    method: "settings.initializeButton",
    options: [control.value.data],
    handler: control.value.uischema.options!.actionHandler,
  });
};

const onUpdate = (dependencySettings: SettingsData) => {
  performRequest({
    method: "settings.update",
    options: [getFlattenedSettings(dependencySettings)],
    handler: control.value.uischema.options!.updateOptions.updateHandler,
  });
};

const onClick = async () => {
  const { id, nextState } = currentState.value;
  const lastSuccessfulState = currentState.value;
  const resetCallback = () => {
    if (nextState === currentState.value.id) {
      currentState.value = lastSuccessfulState;
    }
  };
  if (typeof nextState !== "undefined") {
    setButtonState(nextState);
  }
  await performRequest(
    {
      method: "settings.invokeButtonAction",
      options: [id, currentSettings.value],
      handler: control.value.uischema.options!.actionHandler,
    },
    resetCallback,
  );
};

onMounted(() => {
  registerWatcher({
    init: initialize,
    transformSettings: saveCurrentSettings,
    dependencies: control.value.uischema.options?.dependencies || [],
  });
  const updateOptions = control.value.uischema?.options?.updateOptions;
  if (typeof updateOptions !== "undefined") {
    registerWatcher({
      transformSettings: onUpdate,
      dependencies: updateOptions.dependencies,
    });
  }
});

const displayErrorMessage = computed(
  () => control.value.uischema.options?.displayErrorMessage ?? true,
);
const showTitleAndDescription = computed(
  () => control.value.uischema.options?.showTitleAndDescription ?? true,
);
</script>

<template>
  <LabeledControl
    #default="{ labelForId }"
    :control="control"
    :show="showTitleAndDescription"
  >
    <div class="button-wrapper">
      <FunctionButton
        :id="labelForId"
        :disabled="currentState.disabled"
        class="button-input"
        :primary="currentState.primary"
        compact
        @click="onClick"
      >
        <div class="button-input-text">{{ currentState.text }}</div>
      </FunctionButton>
      <LoadingIcon v-if="numPendingRequests > 0" />
      <span v-if="errorMessage && displayErrorMessage" class="error-message">
        Error: {{ errorMessage }}
      </span>
    </div>
  </LabeledControl>
</template>

<style scoped>
.button-input {
  min-width: 100px;
  text-align: center;
}

.button-wrapper {
  display: flex;
  align-items: center;
  justify-content: left;
  gap: 10px;
}

.button-input-text {
  display: flex;
  justify-content: center;
  width: 100%;
}

.error-message {
  font-size: 13px;
  color: var(--knime-coral-dark);
}

svg {
  height: 18px;
}
</style>
