import {
  type PropType,
  type SetupContext,
  type SlotsType,
  type VNode,
  defineComponent,
} from "vue";

import { getAsyncSetupMethod } from "../utils";

import {
  type ControlSlots,
  type VueControl,
  type VueControlProps,
  type VueControlRenderer,
} from "./types";

export const controlProps = {
  control: {
    type: Object as PropType<VueControlProps<any>["control"]>,
    required: true,
  },
  handleChange: {
    type: Function as PropType<VueControlProps<any>["handleChange"]>,
    required: true,
  },
  changeValue: {
    type: Function as PropType<VueControlProps<any>["changeValue"]>,
    required: true,
  },
  disabled: {
    type: Boolean as PropType<VueControlProps<any>["disabled"]>,
    required: true,
  },
};

export const defineControl = <D>(
  setup: (
    props: VueControlProps<D>,
    ctx: SetupContext<any, SlotsType<ControlSlots>>,
  ) => () => VNode | null,
): VueControl<D> =>
  defineComponent(setup, {
    props: controlProps,
  });

export const mapControls =
  (mapper: (control: VueControl<any>, key: string) => VueControl<any>) =>
  <T extends Record<string, VueControlRenderer>>(cs: T): T =>
    Object.entries(cs).reduce(
      (acc, [key, { control, name, tester, __asyncSetup }]) => {
        // @ts-expect-error
        acc[key] = {
          control: mapper(control, key),
          name,
          tester,
          __asyncSetup: __asyncSetup || getAsyncSetupMethod(control),
        };
        return acc;
      },
      {} as T,
    );
