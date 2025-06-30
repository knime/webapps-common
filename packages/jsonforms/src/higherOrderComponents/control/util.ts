import {
  type Component,
  type PropType,
  type SetupContext,
  type SlotsType,
  type VNode,
  defineComponent,
} from "vue";

import type { VueLayout, VueLayoutRenderer } from "../layout";
import { getAsyncSetupMethod } from "../utils";

import {
  type ControlSlots,
  type VueControl,
  type VueControlProps,
  type VueControlRenderer,
} from "./types";

export const controlProps = {
  control: {
    type: Object as PropType<VueControlProps<never>["control"]>,
    required: true,
  },
  handleChange: {
    type: Function as PropType<VueControlProps<never>["handleChange"]>,
    required: true,
  },
  changeValue: {
    type: Function as PropType<VueControlProps<unknown>["changeValue"]>,
    required: true,
  },
  disabled: {
    type: Boolean as PropType<VueControlProps<never>["disabled"]>,
    required: true,
  },
  isValid: {
    type: Boolean as PropType<VueControlProps<never>["isValid"]>,
    required: true,
  },
  messages: {
    type: Object as PropType<VueControlProps<never>["messages"]>,
    required: true,
  },
  onRegisterValidation: {
    type: Function as PropType<VueControlProps<never>["onRegisterValidation"]>,
    required: true,
  },
};

export const defineControl = <D>(
  setup: (
    props: VueControlProps<D>,
    ctx: SetupContext<unknown, SlotsType<ControlSlots>>,
  ) => () => VNode | null | VNode[],
): VueControl<D> =>
  defineComponent(setup, {
    props: controlProps,
  });

export const mapControls =
  (
    mapper: (control: VueControl<any>, key: string) => VueControl<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  ) =>
  <T extends Record<string, VueControlRenderer>>(cs: T): T =>
    Object.entries(cs).reduce(
      (acc, [key, { control, name, tester, __asyncSetup }]) => {
        // @ts-expect-error Type 'T' is generic and can only be indexed for reading
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

export const mapLayouts =
  (mapper: (layout: VueLayout, key: string) => VueLayout) =>
  <T extends Record<string, VueLayoutRenderer>>(ls: T): T =>
    Object.entries(ls).reduce(
      (acc, [key, { layout, name, tester, __asyncSetup }]) => {
        // @ts-expect-error Type 'T' is generic and can only be indexed for reading.
        acc[key] = {
          layout: mapper(layout, key),
          name,
          tester,
          __asyncSetup: __asyncSetup || getAsyncSetupMethod(layout),
        };
        return acc;
      },
      {} as T,
    );

export type SpecialControlRenderer<SpecialControl> = Omit<
  VueControlRenderer,
  "control"
> & {
  control: SpecialControl;
};

export const handleAsyncComponents =
  <S extends Component, T>(mapper: (s: S) => T) =>
  ({
    control,
    tester,
    name,
    __asyncSetup,
  }: SpecialControlRenderer<S>): SpecialControlRenderer<T> => ({
    name,
    tester,
    __asyncSetup: __asyncSetup || getAsyncSetupMethod(control),
    control: mapper(control),
  });
