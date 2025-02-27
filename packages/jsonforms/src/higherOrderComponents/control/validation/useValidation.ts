import { type Ref, computed, reactive, unref } from "vue";
import { debounce } from "lodash-es"; // eslint-disable-line depend/ban-dependencies
import { v4 as uuidv4 } from "uuid";

import type {
  Messages,
  PerformExternalValidation,
  ValidationMethod,
} from "./types";

const EXTERNAL_VALIDATION_DEBOUNCE = 500;

export const useValidation = <T = unknown>({
  data,
  options,
  performExternalValidation,
}: {
  data: Ref<T>;
  options: Ref<Record<string, any>>;
  performExternalValidation?: PerformExternalValidation<unknown>;
}) => {
  const hasExternalValidationHandler = computed(() =>
    Boolean(options.value?.externalValidationHandler),
  );

  const validationMethods: Record<string, ValidationMethod<T>> = reactive({});
  const externalValidations: Record<string, string> = reactive({});
  const onRegisterValidation = (validationMethod: ValidationMethod<T>) => {
    const id = uuidv4();
    validationMethods[id] = validationMethod;
    return () => {
      delete validationMethods[id];
    };
  };
  const setExternalValidationMessage = (
    validationId: string,
    validationMessage: string | null,
  ) => {
    if (validationMessage === null) {
      delete externalValidations[validationId];
    } else {
      externalValidations[validationId] = validationMessage;
    }
  };

  const performExternalValidationIfAvailable = async (value: T) => {
    if (
      hasExternalValidationHandler.value &&
      typeof performExternalValidation === "function"
    ) {
      const externalValidationHandler = options.value.externalValidationHandler;
      const extValidationResult = await performExternalValidation(
        externalValidationHandler,
        value,
      );
      setExternalValidationMessage(
        externalValidationHandler,
        extValidationResult,
      );
    }
  };

  const performExternalValidationDebounced = debounce((value: T) => {
    performExternalValidationIfAvailable(value);
  }, EXTERNAL_VALIDATION_DEBOUNCE);

  const validationMessages = computed(() =>
    Object.values(validationMethods).map((method) =>
      unref(method)?.(data.value),
    ),
  );

  const externalValidationMessages = computed(() =>
    Object.values(externalValidations),
  );

  const combinedMessages = computed<Messages>(() => ({
    errors: [
      ...validationMessages.value.flatMap(
        ({ errors } = { errors: [] }) => errors,
      ),
      ...externalValidationMessages.value,
    ],
  }));

  const isValid = computed(() => combinedMessages.value.errors.length === 0);

  return {
    messages: combinedMessages,
    isValid,
    onRegisterValidation,
    performExternalValidationDebounced,
  };
};
