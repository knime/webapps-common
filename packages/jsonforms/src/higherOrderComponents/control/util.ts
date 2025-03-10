import {
  type Component,
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
    type: Object as PropType<VueControlProps<any>["control"]>, // TODO: replace any
    required: true,
  },
  handleChange: {
    type: Function as PropType<VueControlProps<any>["handleChange"]>, // TODO: replace any
    required: true,
  },
  changeValue: {
    type: Function as PropType<VueControlProps<any>["changeValue"]>, // TODO: replace any
    required: true,
  },
  disabled: {
    type: Boolean as PropType<VueControlProps<any>["disabled"]>, // TODO: replace any
    required: true,
  },
  isValid: {
    type: Boolean as PropType<VueControlProps<any>["isValid"]>, // TODO: replace any
    required: true,
  },
  messages: {
    type: Object as PropType<VueControlProps<any>["messages"]>, // TODO: replace any
    required: true,
  },
  onRegisterValidation: {
    type: Function as PropType<VueControlProps<any>["onRegisterValidation"]>, // TODO: replace any
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
  // TODO: replace any


    (mapper: (control: VueControl<any>, key: string) => VueControl<any>) =>
    <T extends Record<string, VueControlRenderer>>(cs: T): T =>
      Object.entries(cs).reduce(
        (acc, [key, { control, name, tester, __asyncSetup }]) => {
          // @ts-expect-error Type 'T' is generic and can only be indexed for reading ts(2862)
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
