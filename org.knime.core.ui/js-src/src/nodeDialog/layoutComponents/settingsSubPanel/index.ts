import { type InjectionKey, type Ref, inject, provide, ref } from "vue";

// exported for tests only
export const applyButtonInjectionKey: InjectionKey<{
  element: Ref<null | HTMLElement>;
  disabled: Ref<boolean>;
  text: Ref<string>;
  /**
   * Triggered whenever the apply button is pressed. When the returned promise resolves, the sub panel is closed.
   */
  onApply: Ref<undefined | (() => Promise<void>)>;
}> = Symbol("useApplyButton");

export const setUpApplyButton = () => {
  const applyButton = ref(null);
  const applyText = ref("Apply");
  const applyDisabled = ref(false);
  const onClick = ref<undefined | (() => Promise<void>)>();
  const provided = {
    element: applyButton,
    disabled: applyDisabled,
    text: applyText,
    onApply: onClick,
  };
  provide(applyButtonInjectionKey, provided);
  return provided;
};

export const useApplyButton = () => inject(applyButtonInjectionKey)!;
