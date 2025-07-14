import { type Ref, computed } from "vue";

import type {
  ChoicesUiSchema,
  ChoicesUiSchemaWithProvidedOptions,
  IdAndText,
  IncludedExcludedLabelOptions,
} from "../../types/ChoicesUiSchema";

import useProvidedState from "./useProvidedState";

export const usePossibleValues = <
  SpecialChoicesProps extends Record<string, unknown>,
>(
  control: Ref<{
    uischema: ChoicesUiSchemaWithProvidedOptions<SpecialChoicesProps>;
  }>,
) => {
  const uischema = computed(() => control.value.uischema);
  const providedPossibleValues = useProvidedState(uischema, "possibleValues");
  const possibleValues = computed(() => {
    if (uischema.value.providedOptions?.includes("possibleValues")) {
      return providedPossibleValues.value;
    }
    return uischema.value.options?.possibleValues ?? [];
  });
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
