<script setup lang="ts" generic="T">
import { type Ref, computed, onBeforeUnmount, onMounted, ref } from "vue";
import { set } from "lodash-es";
import { v4 as uuidv4 } from "uuid";

import { Checkbox } from "@knime/components";

import LabeledControl from "../higherOrderComponents/control/LabeledControl.vue";
import ErrorMessages from "../higherOrderComponents/control/errorMessage/ErrorMessages.vue";
import type { VueControlProps } from "../higherOrderComponents/control/types";
import type { IdAndText } from "../types/ChoicesUiSchema";
import type { SettingsData } from "../types/provided";
import getFlattenedSettings from "../utils/getFlattenedSettings";
import { withSpecialChoices } from "../utils/getPossibleValuesFromUiSchema";
import inject from "../utils/inject";

import useHideOnNull from "./composables/useHideOnNull";
import useProvidedState from "./composables/useProvidedState";
import LoadingDropdown from "./loading/LoadingDropdown.vue";

export type Maybe<T> = T | null | undefined;

const props = withDefaults(
  defineProps<
    VueControlProps<Maybe<T>> & {
      asyncInitialOptions?: Promise<IdAndText[]> | null;
      controlDataToDropdownValue?: (
        data: Maybe<T>,
      ) => string | null | undefined;
      dropdownValueToControlData?: (value: string | null) => T;
    }
  >(),
  {
    asyncInitialOptions: null,
    /**
     * We use string as default type.
     */
    controlDataToDropdownValue: (data: Maybe<T>) => (data as string) ?? "",
    dropdownValueToControlData: (value: string | null) => value as T,
  },
);

const getPossibleValuesFromUiSchema = inject("getPossibleValuesFromUiSchema");
const registerWatcher = inject("registerWatcher");
const getData = inject("getData");
const sendAlert = inject("sendAlert");

const controlElement = ref(null);

const choicesProvider = computed(
  () => props.control.uischema.options?.choicesProvider,
);
const options = withSpecialChoices(
  useProvidedState<null | IdAndText[]>(choicesProvider.value, null),
  props.control,
);

const previousControlData: Ref<Maybe<T>> = ref();
onMounted(() => {
  previousControlData.value = props.control.data;
});

const getFirstValueFromDropdownOrNull = (result: IdAndText[]) => {
  return props.dropdownValueToControlData(
    result.length > 0 ? result[0].id : null,
  );
};

const { showCheckbox, showControl, checkboxProps } = useHideOnNull(
  {
    control: computed(() => props.control),
    disabled: computed(() => props.disabled),
    controlElement,
  },
  {
    setDefault: () => {
      if (!previousControlData.value && options.value) {
        props.changeValue(getFirstValueFromDropdownOrNull(options.value));
      } else {
        props.changeValue(previousControlData.value);
      }
    },
    setNull: () => {
      props.changeValue(null);
    },
  },
);

const dropdownValue = computed(
  () => props.controlDataToDropdownValue(props.control.data) ?? "",
);

const choicesUpdateHandler = computed(
  () => props.control.uischema.options?.choicesUpdateHandler,
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
          props.control.path,
          getFirstValueFromDropdownOrNull(result),
        );
        props.changeValue(getFirstValueFromDropdownOrNull(result));
      }
    };

    if (result) {
      handleResult(result);
    }
    if (state === "FAIL") {
      message.forEach((msg: string) => {
        sendAlert({
          message: msg,
          type: "error",
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
    getPossibleValuesFromUiSchema(props.control).then((result) => {
      options.value = result;
    });
  }
};

let unregisterWatcher = () => {};

onMounted(async () => {
  if (choicesUpdateHandler.value) {
    const dependencies = props.control.uischema.options?.dependencies || [];
    const setFirstValueOnUpdate = Boolean(
      props.control.uischema.options?.setFirstValueOnUpdate,
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
  props.changeValue(previousControlData.value);
};
</script>

<template>
  <LabeledControl
    :label="control.label"
    :hide-control-header="control.uischema.options?.hideControlHeader"
  >
    <template #before-label>
      <Checkbox v-if="showCheckbox" v-bind="checkboxProps" />
    </template>

    <template #default="{ labelForId }">
      <ErrorMessages v-if="showControl" :errors="messages.errors">
        <!-- eslint-disable vue/attribute-hyphenation typescript complains with ':aria-label' instead of ':ariaLabel'-->
        <LoadingDropdown
          :id="labelForId ?? ''"
          ref="controlElement"
          :ariaLabel="control.label"
          :disabled="disabled"
          :model-value="dropdownValue"
          :possible-values="options"
          :is-valid
          compact
          @update:model-value="onChangeDropDown"
        />
      </ErrorMessages>
    </template>
    <template #icon>
      <slot name="icon" />
    </template>
    <template #buttons="{ hover }">
      <slot
        name="buttons"
        :hover="hover"
        :control-h-t-m-l-element="controlElement"
      />
    </template>
  </LabeledControl>
</template>
