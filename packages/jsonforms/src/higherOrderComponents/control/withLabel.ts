import { computed, h, ref, toRef } from "vue";

import { Checkbox } from "@knime/components";

import useHideOnNull from "../../uiComponents/composables/useHideOnNull";

import LabeledControl from "./LabeledControl.vue";
import { addErrorMessageToVNode } from "./errorMessage/withErrorMessage";
import type { PropsToComponent, VueControl, VueControlProps } from "./types";
import { defineControl, handleAsyncComponents } from "./util";

export type VueControlPropsForLabelContent<D> = Omit<
  VueControlProps<D>,
  "labelForId" | "messages"
> & {
  labelForId: string;
};

export type VueControlThatRequiresLabelWrapper<D> = PropsToComponent<
  VueControlPropsForLabelContent<D>
>;

export type VueControlExposed = {
  focus?: () => void;
};

const addLabelToComponent =
  ({ fill }: { fill: boolean } = { fill: false }) =>
  <D>(control: VueControlThatRequiresLabelWrapper<D>): VueControl<D> =>
    defineControl((props, { slots }) => {
      const controlRef = ref<({ $el: HTMLElement } & VueControlExposed) | null>(
        null,
      );
      const hideControlHeader = computed(
        () => props.control.uischema.options?.hideControlHeader,
      );

      const { checkboxProps, showCheckbox, showControl } = useHideOnNull({
        control: toRef(props, "control"),
        controlElement: controlRef,
        changeValue: props.changeValue as (value: unknown) => void,
        disabled: toRef(props, "disabled"),
      });
      return () => {
        if (hideControlHeader.value) {
          return h(control, { ...props, labelForId: "" });
        }
        return h(
          LabeledControl,
          {
            label: props.control.label,
            fill,
          },
          {
            "before-label": () =>
              showCheckbox.value ? h(Checkbox, checkboxProps.value) : null,
            default: ({ labelForId }: { labelForId: string }) => {
              if (!showControl.value) {
                return null;
              }
              const vnode = h(control, {
                ...props,
                labelForId,
                ref: controlRef,
              });
              return addErrorMessageToVNode({ fill })(vnode, props);
            },
            buttons: ({ hover }: { hover: boolean }) => {
              if (!slots.buttons) {
                return null;
              }
              return slots.buttons({
                hover,
                controlHTMLElement: controlRef.value as HTMLElement | null,
              });
            },
            icon: slots.icon,
          },
        );
      };
    });

export const withLabel = (config: { fill: boolean } = { fill: false }) =>
  handleAsyncComponents(addLabelToComponent(config));
