import { type Ref, computed } from "vue";

import type {
  ChoicesUiSchema,
  IdAndText,
  IncludedExcludedLabelOptions,
} from "../../types/ChoicesUiSchema";

import useProvidedState from "./useProvidedState";

export const usePossibleValues = <
  SpecialChoicesProps extends Record<string, any> = {},
>(
  control: Ref<{ uischema: ChoicesUiSchema<SpecialChoicesProps> }>,
) => {
  const choicesProvider = computed(
    () => control.value.uischema.options?.choicesProvider,
  );
  const possibleValues = useProvidedState(
    choicesProvider,
    control.value.uischema.options?.possibleValues ?? null,
  );
  return { possibleValues };
};

export const usePossibleColumnChoices = (
  control: Ref<{
    uischema: ChoicesUiSchema<{
      type: IdAndText;
    }>;
  }>,
) => usePossibleValues(control);

export const useIncludedExcludedLabels = (
  control: Ref<{
    uischema: {
      options?: IncludedExcludedLabelOptions;
    };
  }>,
) => {
  const options = computed(() => control.value.uischema.options);
  return {
    includedLabel: options.value?.includedLabel ?? "Includes",
    excludedLabel: options.value?.excludedLabel ?? "Excludes",
  };
};
