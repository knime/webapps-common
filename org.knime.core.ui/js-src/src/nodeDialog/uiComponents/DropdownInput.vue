<script setup lang="ts">
import {
  type Ref,
  type PropType,
  ref,
  computed,
  onMounted,
  onBeforeUnmount,
} from "vue";
import { rendererProps } from "@jsonforms/vue";
import LoadingDropdown from "./loading/LoadingDropdown.vue";
import { AlertType } from "@knime/ui-extension-service";
import { set } from "lodash-es";
import getFlattenedSettings from "../utils/getFlattenedSettings";
import { v4 as uuidv4 } from "uuid";
import inject from "../utils/inject";
import type SettingsData from "../types/SettingsData";
import type { IdAndText } from "../types/ChoicesUiSchema";
import useDialogControl from "../composables/useDialogControl";
import LabeledInput from "./label/LabeledInput.vue";

const props = defineProps({
  ...rendererProps(),
  asyncInitialOptions: {
    type: Object as PropType<Promise<IdAndText[]>>,
    required: false,
    default: null,
  },
  jsonFormsControl: {
    type: Object as PropType<null | ReturnType<typeof useDialogControl>>,
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
});
const { control, handleDirtyChange, disabled } =
  props.jsonFormsControl ?? useDialogControl<string>({ props });
const getPossibleValuesFromUiSchema = inject("getPossibleValuesFromUiSchema");
const registerWatcher = inject("registerWatcher");
const getData = inject("getData");
const sendAlert = inject("sendAlert");

const options: Ref<null | IdAndText[]> = ref(null);

const getFirstValueFromDropdownOrNull = (result: IdAndText[]) => {
  return props.dropdownValueToControlData(
    result.length > 0 ? result[0].id : null,
  );
};

const choicesUpdateHandler = computed(
  () => control.value.uischema.options?.choicesUpdateHandler,
);
const widgetId = uuidv4();
const updateOptions = async (
  newSettings: SettingsData,
  setNewValue: boolean,
) => {
  const { result, state, message } = await getData({
    method: "settings.update",
    options: [
      widgetId,
      choicesUpdateHandler.value,
      getFlattenedSettings(newSettings),
    ],
  });

  const handleResult = (result: IdAndText[]) => {
    options.value = result;
    if (setNewValue) {
      set(
        newSettings,
        control.value.path,
        getFirstValueFromDropdownOrNull(result),
      );
    }
  };

  if (result) {
    handleResult(result);
  }
  if (state === "FAIL") {
    sendAlert({
      type: AlertType.ERROR,
      message,
    });
    handleResult([]);
  }
};

const fetchInitialOptions = async (newSettings: SettingsData) => {
  // initially only fetch possible values, but do not set a value
  // instead, use value from initial data
  await updateOptions(newSettings, false);
};

const setInitialOptions = async () => {
  if (props.asyncInitialOptions === null) {
    getPossibleValuesFromUiSchema(control.value).then((result) => {
      options.value = result;
    });
  } else {
    options.value = await props.asyncInitialOptions;
  }
};

let unregisterWatcher = () => {};

onMounted(async () => {
  if (choicesUpdateHandler.value) {
    const dependencies = control.value.uischema.options?.dependencies || [];
    const setFirstValueOnUpdate = Boolean(
      control.value.uischema.options?.setFirstValueOnUpdate,
    );
    unregisterWatcher = await registerWatcher({
      transformSettings: (newSettings) =>
        updateOptions(newSettings, setFirstValueOnUpdate),
      init: fetchInitialOptions,
      dependencies,
    });
  } else {
    setInitialOptions();
  }
});

onBeforeUnmount(() => {
  unregisterWatcher();
});

const dropdownValue = computed(() =>
  props.controlDataToDropdownValue(control.value.data),
);

const onChange = (value: string) => {
  handleDirtyChange(props.dropdownValueToControlData(value));
};
</script>

<template>
  <LabeledInput
    #default="{ labelForId }"
    :control="control"
    @controlling-flow-variable-set="onChange"
  >
    <!-- eslint-disable vue/attribute-hyphenation typescript complains with ':aria-label' instead of ':ariaLabel'-->
    <LoadingDropdown
      :id="labelForId ?? ''"
      :ariaLabel="control.label"
      :disabled="disabled"
      :model-value="dropdownValue"
      :possible-values="options"
      @update:model-value="onChange"
    />
  </LabeledInput>
</template>
