<script setup lang="ts">
import { type PropType, computed, onBeforeUnmount, onMounted, ref } from "vue";
import { rendererProps } from "@jsonforms/vue";
import { set } from "lodash-es";
import { v4 as uuidv4 } from "uuid";

import { Checkbox } from "@knime/components";
import { AlertType } from "@knime/ui-extension-service";

import useDialogControl, {
  type DialogControl,
} from "../composables/components/useDialogControl";
import useProvidedState from "../composables/components/useProvidedState";
import type { IdAndText } from "../types/ChoicesUiSchema";
import type { SettingsData } from "../types/SettingsData";
import getFlattenedSettings from "../utils/getFlattenedSettings";
import { withSpecialChoices } from "../utils/getPossibleValuesFromUiSchema";
import inject from "../utils/inject";

import useHideOnNull from "./composables/useHideOnNull";
import LabeledControl from "./label/LabeledControl.vue";
import LoadingDropdown from "./loading/LoadingDropdown.vue";

const props = defineProps({
  ...rendererProps(),
  asyncInitialOptions: {
    type: Object as PropType<Promise<IdAndText[]>>,
    required: false,
    default: null,
  },
  jsonFormsControl: {
    type: Object as PropType<null | DialogControl>,
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
const { control, onChange, disabled } =
  props.jsonFormsControl ??
  useDialogControl<string | null | undefined>({ props });
const getPossibleValuesFromUiSchema = inject("getPossibleValuesFromUiSchema");
const registerWatcher = inject("registerWatcher");
const getData = inject("getData");
const sendAlert = inject("sendAlert");

const controlElement = ref(null);

const choicesProvider = computed(
  () => control.value.uischema.options?.choicesProvider,
);
const options = withSpecialChoices(
  useProvidedState<null | IdAndText[]>(choicesProvider.value, null),
  control.value,
);

const previousControlData = ref(control.value.data);

const getFirstValueFromDropdownOrNull = (result: IdAndText[]) => {
  return props.dropdownValueToControlData(
    result.length > 0 ? result[0].id : null,
  );
};

const { showCheckbox, showControl, checkboxProps } = useHideOnNull(
  {
    control,
    disabled,
    controlElement,
  },
  {
    setDefault: () => {
      if (!previousControlData.value && options.value) {
        onChange(getFirstValueFromDropdownOrNull(options.value));
      } else {
        onChange(previousControlData.value);
      }
    },
    setNull: () => {
      onChange(null);
    },
  },
);

const dropdownValue = computed(() =>
  props.controlDataToDropdownValue(control.value.data),
);

const choicesUpdateHandler = computed(
  () => control.value.uischema.options?.choicesUpdateHandler,
);
const widgetId = uuidv4();
const getUpdateOptionsMethod = async (
  dependencySettings: SettingsData,
  setNewValue: boolean,
) => {
  const { result, state, message } = await getData({
    method: "settings.update",
    options: [
      widgetId,
      choicesUpdateHandler.value,
      getFlattenedSettings(dependencySettings),
    ],
  });

  return (newSettings: SettingsData) => {
    const handleResult = (result: IdAndText[]) => {
      options.value = result;
      if (setNewValue || !dropdownValue.value) {
        set(
          newSettings,
          control.value.path,
          getFirstValueFromDropdownOrNull(result),
        );
        onChange(getFirstValueFromDropdownOrNull(result));
      }
    };

    if (result) {
      handleResult(result);
    }
    if (state === "FAIL") {
      message.forEach((msg: string) => {
        sendAlert({
          type: AlertType.ERROR,
          message: msg,
        });
      });
      handleResult([]);
    }
  };
};

const fetchInitialOptions = async (newSettings: SettingsData) => {
  // initially only fetch possible values, but do not set a value
  // instead, use value from initial data
  (await getUpdateOptionsMethod(newSettings, false))(newSettings);
};

const setInitialOptions = async () => {
  if (props.asyncInitialOptions !== null) {
    options.value = await props.asyncInitialOptions;
  } else if (!choicesProvider.value) {
    getPossibleValuesFromUiSchema(control.value).then((result) => {
      options.value = result;
    });
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
      transformSettings: (dependencySettings) =>
        getUpdateOptionsMethod(dependencySettings, setFirstValueOnUpdate),
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

const onChangeDropDown = (value: string) => {
  previousControlData.value = props.dropdownValueToControlData(value);
  onChange(previousControlData.value);
};
</script>

<template>
  <LabeledControl
    :control="control"
    @controlling-flow-variable-set="onChangeDropDown"
  >
    <template #before-label>
      <Checkbox v-if="showCheckbox" v-bind="checkboxProps" />
    </template>

    <template #default="{ labelForId }">
      <!-- eslint-disable vue/attribute-hyphenation typescript complains with ':aria-label' instead of ':ariaLabel'-->
      <LoadingDropdown
        v-if="showControl"
        :id="labelForId ?? ''"
        ref="controlElement"
        :ariaLabel="control.label"
        :disabled="disabled"
        :model-value="dropdownValue"
        :possible-values="options"
        compact
        @update:model-value="onChangeDropDown"
      />
    </template>
  </LabeledControl>
</template>
