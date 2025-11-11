import { type MaybeRef, type Ref, ref, watch } from "vue";

import { useInternalProvidedState } from "../../../uiComponents/composables/useProvidedState";
import inject from "../../../utils/inject";

const CUSTOM_VALIDATION_DEBOUNCE = 500;

const createDebounce = <T extends (...args: never[]) => unknown>(
  fn: T,
  delay: number,
): T => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return ((...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  }) as T;
};

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
  const performCustomValidationDebounced = createDebounce((data: unknown) => {
    performCustomValidationIfAvailable(data).catch((_err) => {});
  }, CUSTOM_VALIDATION_DEBOUNCE);

  return {
    customValidationMessage,
    performCustomValidationDebounced,
  };
};
