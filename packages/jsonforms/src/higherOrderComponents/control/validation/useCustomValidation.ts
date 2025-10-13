import { type MaybeRef, type Ref, ref, watch } from "vue";
import { debounce } from "lodash-es"; // eslint-disable-line depend/ban-dependencies

import { useInternalProvidedState } from "../../../uiComponents/composables/useProvidedState";
import inject from "../../../utils/inject";

const CUSTOM_VALIDATION_DEBOUNCE = 500;
export default ({
  data,
  uischema,
}: {
  data: Ref<unknown>;
  uischema: MaybeRef<{ id: string } | { scope: string }>;
}) => {
  const customValidationMessage = ref<string | null>(null);

  const providedValidatorId = useInternalProvidedState<string>(
    uischema as never,
    "validatorId",
  );

  const validate = inject("validate");

  const performCustomValidationIfAvailable = async (data: unknown) => {
    if (providedValidatorId?.value) {
      customValidationMessage.value = await validate(
        providedValidatorId.value,
        data,
      );
    } else {
      customValidationMessage.value = null;
    }
  };

  watch(
    () => providedValidatorId.value,
    () => performCustomValidationIfAvailable(data.value),
    { immediate: true },
  );
  const performCustomValidationDebounced = debounce((data: unknown) => {
    performCustomValidationIfAvailable(data).catch((_err) => {});
  }, CUSTOM_VALIDATION_DEBOUNCE);

  return {
    customValidationMessage,
    performCustomValidationDebounced,
  };
};
