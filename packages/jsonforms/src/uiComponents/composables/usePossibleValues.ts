import { type Ref, computed } from "vue";

import type {
  ChoicesUiSchema,
  ChoicesUiSchemaWithProvidedOptions,
  IdAndText,
  IncludedExcludedLabelOptions,
} from "../../types/ChoicesUiSchema";

import useProvidedState from "./useProvidedState";

export const usePossibleValues = <
  SpecialChoicesProps extends Record<string, any> = {},
>(
  control: Ref<{
    uischema: ChoicesUiSchemaWithProvidedOptions<SpecialChoicesProps>;
  }>,
) => {
  const uischema = computed(() => control.value.uischema);
  const possibleValues = useProvidedState(uischema, "possibleValues");
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
