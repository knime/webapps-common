import { beforeEach, describe, expect, it } from "vitest";
import { type Ref, computed, ref } from "vue";

import type { Messages } from "../types";
import { useValidation } from "../useValidation";

describe("useValidation", () => {
  let data: Ref<boolean>;

  beforeEach(() => {
    data = ref(false);
  });

  const invalidatingValidatorWithMessage =
    (message: string) =>
    (value: boolean): Messages => ({
      errors: value ? [] : [message],
    });

  it("has empty initial state", () => {
    const { isValid, messages } = useValidation({ data });
    expect(isValid.value).toBe(true);
    expect(messages.value.errors).toStrictEqual([]);
  });

  it("updates messages when registering a validation method", () => {
    const { isValid, messages, onRegisterValidation } = useValidation({ data });
    onRegisterValidation(invalidatingValidatorWithMessage("Must be true"));
    expect(isValid.value).toBe(false);
    expect(messages.value.errors).toStrictEqual(["Must be true"]);
  });

  it("is able to combine multiple validator messages", () => {
    const { isValid, messages, onRegisterValidation } = useValidation({ data });
    onRegisterValidation(invalidatingValidatorWithMessage("Must be true"));
    onRegisterValidation(invalidatingValidatorWithMessage("Must be true!!"));
    expect(isValid.value).toBe(false);
    expect(messages.value.errors).toStrictEqual([
      "Must be true",
      "Must be true!!",
    ]);
  });

  it("updates on data change", () => {
    const { isValid, messages, onRegisterValidation } = useValidation({ data });
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
    const { isValid, onRegisterValidation } = useValidation({ data });
    onRegisterValidation(validator);
    expect(isValid.value).toBe(true);
    validValue.value = true;
    expect(isValid.value).toBe(false);
  });
});
