import { type Ref, computed, reactive, unref } from "vue";

import type { Messages, ValidationMethod } from "./types";

export const useValidation = <T = any>({ data }: { data: Ref<T> }) => {
  const validationMethods: ValidationMethod<T>[] = reactive([]);
  const onRegisterValidation = (validationMethod: ValidationMethod<T>) =>
    validationMethods.push(validationMethod);
  const validationMessages = computed(() =>
    validationMethods.map((method) => unref(method)?.(data.value)),
  );

  const combinedMessages = computed<Messages>(() => ({
    errors: validationMessages.value.flatMap(
      ({ errors } = { errors: [] }) => errors,
    ),
  }));

  const isValid = computed(() => combinedMessages.value.errors.length === 0);

  return {
    messages: combinedMessages,
    isValid,
    onRegisterValidation,
  };
};
