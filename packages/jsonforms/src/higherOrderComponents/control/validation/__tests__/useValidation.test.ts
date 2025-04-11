import { beforeEach, describe, expect, it, vi } from "vitest";
import { type Ref, computed, ref } from "vue";
import { mount } from "@vue/test-utils";

import type { Messages } from "../types";

import UseValidationTestComponent from "./UseValidationTestComponent.vue";

const mountUseValidationTestComponent = ({
  data,
  options,
  executeCustomValidation = vi.fn(),
}: {
  data: Ref<any>;
  options: Ref<Record<string, any>>;
  executeCustomValidation?: Function;
}) => {
  return mount(UseValidationTestComponent, {
    props: {
      data,
      options,
    },
    global: {
      provide: {
        executeCustomValidation,
      },
    },
  });
};

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
    const wrapper = mountUseValidationTestComponent({ data, options });
    expect(wrapper.vm.isValid).toBe(true);
    expect(wrapper.vm.messages.errors).toStrictEqual([]);
  });

  it("updates messages when registering a validation method", () => {
    const wrapper = mountUseValidationTestComponent({ data, options });
    wrapper.vm.onRegisterValidation(
      invalidatingValidatorWithMessage("Must be true"),
    );
    expect(wrapper.vm.isValid).toBe(false);
    expect(wrapper.vm.messages.errors).toStrictEqual(["Must be true"]);
  });

  it("is able to combine multiple validator messages", () => {
    const wrapper = mountUseValidationTestComponent({ data, options });
    wrapper.vm.onRegisterValidation(
      invalidatingValidatorWithMessage("Must be true"),
    );
    wrapper.vm.onRegisterValidation(
      invalidatingValidatorWithMessage("Must be true!!"),
    );
    expect(wrapper.vm.isValid).toBe(false);
    expect(wrapper.vm.messages.errors).toStrictEqual([
      "Must be true",
      "Must be true!!",
    ]);
  });

  it("updates on data change", () => {
    const wrapper = mountUseValidationTestComponent({ data, options });
    wrapper.vm.onRegisterValidation(
      invalidatingValidatorWithMessage("Must be true"),
    );
    expect(wrapper.vm.isValid).toBe(false);
    expect(wrapper.vm.messages.errors).toStrictEqual(["Must be true"]);
    data.value = true;
    expect(wrapper.vm.isValid).toBe(true);
    expect(wrapper.vm.messages.errors).toStrictEqual([]);
  });

  it("allows adding computed validators that can change", () => {
    const validValue = ref(false);
    const validator = computed(() => (value: boolean) => ({
      errors: validValue.value === value ? [] : ["Some error"],
    }));
    const wrapper = mountUseValidationTestComponent({ data, options });
    wrapper.vm.onRegisterValidation(validator);
    expect(wrapper.vm.isValid).toBe(true);
    validValue.value = true;
    expect(wrapper.vm.isValid).toBe(false);
  });

  describe("with custom validation", () => {
    const executeCustomValidation = vi.fn((_id, value, callback) => {
      callback(value === false ? "CustomVal: Must be true" : null);
    });

    beforeEach(() => {
      options.value.customValidationHandler = "customValidationHandlerId1";
    });

    it("is able to combine messages of validation methods and custom validations", () => {
      vi.useFakeTimers();
      const wrapper = mountUseValidationTestComponent({
        data,
        options,
        executeCustomValidation,
      });
      wrapper.vm.onRegisterValidation(
        invalidatingValidatorWithMessage("Must be true"),
      );
      wrapper.vm.performCustomValidationDebounced(false);
      vi.runAllTimers();
      expect(wrapper.vm.messages.errors).toStrictEqual([
        "Must be true",
        "CustomVal: Must be true",
      ]);
    });

    it("removes not applicable messages", () => {
      vi.useFakeTimers();
      const wrapper = mountUseValidationTestComponent({
        data,
        options,
        executeCustomValidation,
      });

      wrapper.vm.performCustomValidationDebounced(false);
      vi.runAllTimers();
      expect(wrapper.vm.messages.errors).toStrictEqual([
        "CustomVal: Must be true",
      ]);

      wrapper.vm.performCustomValidationDebounced(true);
      vi.runAllTimers();
      expect(wrapper.vm.messages.errors).toStrictEqual([]);
    });

    it("debounces custom validation execution", () => {
      vi.useFakeTimers();
      const wrapper = mountUseValidationTestComponent({
        data,
        options,
        executeCustomValidation,
      });

      wrapper.vm.performCustomValidationDebounced(false);
      vi.advanceTimersByTime(200);
      expect(wrapper.vm.messages.errors).toStrictEqual([]);
      wrapper.vm.performCustomValidationDebounced(true);
      vi.advanceTimersByTime(200);
      expect(wrapper.vm.messages.errors).toStrictEqual([]);
      wrapper.vm.performCustomValidationDebounced(false);
      vi.runAllTimers();
      expect(wrapper.vm.messages.errors).toStrictEqual([
        "CustomVal: Must be true",
      ]);
    });

    it("is able to combine messages of different custom validations", () => {
      vi.useFakeTimers();
      const executeCustomValidation = vi.fn((_id, value, callback) => {
        callback(`Message for value: ${value}`);
      });
      const wrapper = mountUseValidationTestComponent({
        data,
        options,
        executeCustomValidation,
      });
      wrapper.vm.performCustomValidationDebounced(false);
      vi.runAllTimers();
      options.value.customValidationHandler = "customValidationHandlerId2";
      wrapper.vm.performCustomValidationDebounced(true);
      vi.runAllTimers();
      expect(wrapper.vm.messages.errors).toStrictEqual([
        "Message for value: false",
        "Message for value: true",
      ]);
    });
  });
});
