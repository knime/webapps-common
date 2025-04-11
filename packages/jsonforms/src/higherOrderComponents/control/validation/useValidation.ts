import { type Ref, computed, reactive, unref } from "vue";
import { debounce } from "lodash-es";

import inject from "../../../utils/inject";

import type { Messages, ValidationMethod } from "./types";

const CUSTOM_VALIDATION_DEBOUNCE = 500;

export const useValidation = <T = any>({
  data,
  options,
}: {
  data: Ref<T>;
  options: Ref<Record<string, any>>;
}) => {
  const hasCustomValidationHandler = computed(() =>
    Boolean(options.value?.customValidationHandler),
  );
  const executeCustomValidation = inject("executeCustomValidation");

  const validationMethods: ValidationMethod<T>[] = reactive([]);
  const customValidations: Record<string, string> = reactive({});
  const onRegisterValidation = (validationMethod: ValidationMethod<T>) =>
    validationMethods.push(validationMethod);
  const setCustomValidationMessage = (
    validationId: string,
    validationMessage: string | null,
  ) => {
    if (validationMessage === null) {
      delete customValidations[validationId];
    } else {
      customValidations[validationId] = validationMessage;
    }
  };

  const performCustomValidation = (value: T) => {
    if (hasCustomValidationHandler.value) {
      const customValidationHandler = options.value.customValidationHandler;
      executeCustomValidation(
        customValidationHandler,
        value,
        (error: string | null) => {
          setCustomValidationMessage(customValidationHandler, error);
        },
      );
    }
  };

  const performCustomValidationDebounced = debounce((value: T) => {
    performCustomValidation(value);
  }, CUSTOM_VALIDATION_DEBOUNCE);

  const validationMessages = computed(() =>
    validationMethods.map((method) => unref(method)?.(data.value)),
  );

  const customValidationMessages = computed(() =>
    Object.values(customValidations),
  );

  const combinedMessages = computed<Messages>(() => ({
    errors: [
      ...validationMessages.value.flatMap(
        ({ errors } = { errors: [] }) => errors,
      ),
      ...customValidationMessages.value,
    ],
  }));

  const isValid = computed(() => combinedMessages.value.errors.length === 0);

  return {
    messages: combinedMessages,
    isValid,
    onRegisterValidation,
    performCustomValidationDebounced,
  };
};
