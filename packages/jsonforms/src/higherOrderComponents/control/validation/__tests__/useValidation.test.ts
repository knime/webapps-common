import { beforeEach, describe, expect, it, vi } from "vitest";
import { type Ref, computed, nextTick, ref } from "vue";

import type { Messages } from "../types";
import { useValidation } from "../useValidation";

describe("useValidation", () => {
  let data: Ref<boolean>, options: Ref<Record<string, any>>;

  beforeEach(() => {
    data = ref(false);
    options = ref({});
  });

  const invalidatingValidatorWithMessage =
    (message: string) =>
    (value: boolean): Messages => ({
      errors: value ? [] : [message],
    });

  it("has empty initial state", () => {
    const { isValid, messages } = useValidation({ data, options });
    expect(isValid.value).toBe(true);
    expect(messages.value.errors).toStrictEqual([]);
  });

  it("updates messages when registering a validation method", () => {
    const { isValid, messages, onRegisterValidation } = useValidation({
      data,
      options,
    });
    onRegisterValidation(invalidatingValidatorWithMessage("Must be true"));
    expect(isValid.value).toBe(false);
    expect(messages.value.errors).toStrictEqual(["Must be true"]);
  });

  it("is able to combine multiple validator messages", () => {
    const { isValid, messages, onRegisterValidation } = useValidation({
      data,
      options,
    });
    onRegisterValidation(invalidatingValidatorWithMessage("Must be true"));
    onRegisterValidation(invalidatingValidatorWithMessage("Must be true!!"));
    expect(isValid.value).toBe(false);
    expect(messages.value.errors).toStrictEqual([
      "Must be true",
      "Must be true!!",
    ]);
  });

  it("updates on data change", () => {
    const { isValid, messages, onRegisterValidation } = useValidation({
      data,
      options,
    });
    onRegisterValidation(invalidatingValidatorWithMessage("Must be true"));
    expect(isValid.value).toBe(false);
    expect(messages.value.errors).toStrictEqual(["Must be true"]);
    data.value = true;
    expect(isValid.value).toBe(true);
    expect(messages.value.errors).toStrictEqual([]);
  });

  it("allows adding computed validators that can change", () => {
    const validValue = ref(false);
    const validator = computed(() => (value: boolean) => ({
      errors: validValue.value === value ? [] : ["Some error"],
    }));
    const { isValid, onRegisterValidation } = useValidation({ data, options });
    onRegisterValidation(validator);
    expect(isValid.value).toBe(true);
    validValue.value = true;
    expect(isValid.value).toBe(false);
  });

  describe("with external validation", () => {
    const performExternalValidation = vi.fn((_id, value) =>
      Promise.resolve(value === false ? "ExternalVal: Must be true" : null),
    );
    const externalValidationHandlerId1 = "externalValidationHandlerId1";

    beforeEach(() => {
      options.value.externalValidationHandler = externalValidationHandlerId1;
    });

    it("is able to combine messages of validation methods and external validations", async () => {
      const {
        onRegisterValidation,
        performExternalValidationDebounced,
        messages,
      } = useValidation({ data, options, performExternalValidation });
      onRegisterValidation(invalidatingValidatorWithMessage("Must be true"));

      vi.useFakeTimers();
      performExternalValidationDebounced(false);
      vi.runAllTimers();

      await nextTick();
      expect(messages.value.errors).toStrictEqual([
        "Must be true",
        "ExternalVal: Must be true",
      ]);
    });

    it("removes not applicable messages", async () => {
      vi.useFakeTimers();
      const { performExternalValidationDebounced, messages } = useValidation({
        data,
        options,
        performExternalValidation,
      });

      performExternalValidationDebounced(false);
      vi.runAllTimers();

      await nextTick();
      expect(messages.value.errors).toStrictEqual([
        "ExternalVal: Must be true",
      ]);

      performExternalValidationDebounced(true);
      vi.runAllTimers();
      await nextTick();
      expect(messages.value.errors).toStrictEqual([]);
    });

    it("debounces external validation execution", async () => {
      vi.useFakeTimers();
      const { performExternalValidationDebounced, messages } = useValidation({
        data,
        options,
        performExternalValidation,
      });

      performExternalValidationDebounced(false);
      vi.advanceTimersByTime(200);
      await nextTick();
      expect(messages.value.errors).toStrictEqual([]);

      performExternalValidationDebounced(true);
      vi.advanceTimersByTime(200);
      await nextTick();
      expect(messages.value.errors).toStrictEqual([]);

      performExternalValidationDebounced(false);
      vi.runAllTimers();
      await nextTick();
      expect(messages.value.errors).toStrictEqual([
        "ExternalVal: Must be true",
      ]);
    });

    it("is able to combine messages of different external validations", async () => {
      vi.useFakeTimers();
      const performExternalValidation = vi.fn((_id, value) =>
        Promise.resolve(`Message for value: ${value}`),
      );
      const { performExternalValidationDebounced, messages } = useValidation({
        data,
        options,
        performExternalValidation,
      });

      performExternalValidationDebounced(false);
      vi.runAllTimers();

      options.value.externalValidationHandler = "externalValidationHandlerId2";
      performExternalValidationDebounced(true);
      vi.runAllTimers();

      await nextTick();
      expect(messages.value.errors).toStrictEqual([
        "Message for value: false",
        "Message for value: true",
      ]);
    });
  });
});
