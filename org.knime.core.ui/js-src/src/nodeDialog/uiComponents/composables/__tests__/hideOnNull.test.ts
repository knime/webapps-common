import { describe, expect, it } from "vitest";
import { ref } from "vue";

import useHideOnNull from "../useHideOnNull";

describe("hideOnNull", () => {
  const useHideOnNullWrapper = (
    params: {
      hideOnNull?: boolean;
      data?: string | null | undefined;
      disabled?: boolean;
    } = {},
  ) => {
    const { hideOnNull = false, data, disabled = false } = params;
    return useHideOnNull(
      {
        control: {
          uischema: hideOnNull
            ? {
                options: {
                  hideOnNull,
                },
              }
            : {},
          data,
        } as any,
        disabled,
        controlElement: ref(null),
      },
      {
        setDefault: () => {},
        setNull: () => {},
      },
    );
  };

  it("sets showCheckbox to false per default", () => {
    const {
      showCheckbox: { value: showCheckbox },
      showControl: { value: showControl },
    } = useHideOnNullWrapper();
    expect(showCheckbox).toBeFalsy();
    expect(showControl).toBeTruthy();
  });

  it("sets showCheckbox to true", () => {
    const {
      showCheckbox: { value: showCheckbox },
    } = useHideOnNullWrapper({ hideOnNull: true });
    expect(showCheckbox).toBeTruthy();
  });

  it("sets disabled", () => {
    const {
      checkboxProps: {
        value: { disabled },
      },
    } = useHideOnNullWrapper({ disabled: true });
    expect(disabled).toBeTruthy();
  });

  it("sets checkbox modelValue to true on string data", () => {
    const {
      showControl: { value: showControl },
      checkboxProps: {
        value: { modelValue },
      },
    } = useHideOnNullWrapper({ hideOnNull: true, data: "string" });
    expect(modelValue).toBeTruthy();
    expect(showControl).toBeTruthy();
  });

  it("sets checkbox modelValue to false on null data", () => {
    const {
      showControl: { value: showControl },
      checkboxProps: {
        value: { modelValue },
      },
    } = useHideOnNullWrapper({ hideOnNull: true, data: null });
    expect(modelValue).toBeFalsy();
    expect(showControl).toBeFalsy();
  });

  it("sets checkbox modelValue to false on undefined data", () => {
    const {
      showControl: { value: showControl },
      checkboxProps: {
        value: { modelValue },
      },
    } = useHideOnNullWrapper({ hideOnNull: true, data: undefined });
    expect(modelValue).toBeFalsy();
    expect(showControl).toBeFalsy();
  });
});
