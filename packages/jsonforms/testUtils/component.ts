import { type Mock, vi } from "vitest";
import { type Component, type ExtractPropTypes } from "vue";
import { mount } from "@vue/test-utils";
import * as jsonformsVueModule from "@jsonforms/vue";

import type {
  VueControl,
  VueControlProps,
  VueControlPropsForLabelContent,
  VueControlThatRequiresLabelWrapper,
  VueLayout,
  VueLayoutProps,
} from "../src/higherOrderComponents";

export type ProvidedMethods = {
  sendAlert: Mock;
  trigger: Mock;
  addStateProviderListener: Mock;
};

export type VueControlTestProps<C extends abstract new (...args: any) => any> =
  Omit<
    InstanceType<C>["$props"],
    "handleChange" | "changeValue" | "onRegisterValidation"
  >;

const getGlobal = ({
  provide,
  stubs,
}: {
  provide?: Partial<ProvidedMethods>;
  stubs?: Record<any, any>;
}) => ({
  provide: {
    sendAlert: provide?.sendAlert || vi.fn(),
    addStateProviderListener: provide?.addStateProviderListener || vi.fn(),
    trigger: provide?.trigger || vi.fn(),
    ...provide,
  },
  stubs: {
    DispatchRenderer: true,
    ...stubs,
  },
});

export const mountJsonFormsControl = <D>(
  component: VueControl<D>,
  {
    props,
    provide = {},
    stubs = {},
  }: {
    props: NoInfer<
      Omit<
        VueControlProps<D>,
        "handleChange" | "changeValue" | "onRegisterValidation"
      >
    >;
    provide?: Partial<ProvidedMethods>;
    stubs?: Record<any, any>;
  },
) => {
  const handleChange = vi.fn();
  const changeValue = vi.fn();
  const onRegisterValidation = vi.fn();

  const wrapper = mount(component, {
    props: {
      ...props,
      handleChange,
      changeValue,
      onRegisterValidation,
    },
    global: getGlobal({ provide, stubs }),
  });
  return {
    wrapper,
    handleChange,
    changeValue,
    onRegisterValidation,
  };
};

export const mountJsonFormsControlLabelContent = <D>(
  component: VueControlThatRequiresLabelWrapper<D>,
  {
    props,
    provide = {},
    stubs = {},
  }: {
    props: NoInfer<
      Omit<
        VueControlPropsForLabelContent<D>,
        "handleChange" | "changeValue" | "onRegisterValidation"
      >
    >;
    provide?: Partial<ProvidedMethods>;
    stubs?: Record<any, any>;
  },
) => {
  const handleChange = vi.fn();
  const changeValue = vi.fn();
  const onRegisterValidation = vi.fn();

  const wrapper = mount(component, {
    props: {
      ...props,
      handleChange,
      changeValue,
      onRegisterValidation,
    },
    global: getGlobal({ provide, stubs }),
  });
  return {
    wrapper,
    handleChange,
    changeValue,
    onRegisterValidation,
  };
};

export const mountJsonFormsLayout = (
  component: VueLayout,
  {
    props,
    provide = {},
    stubs = {},
  }: {
    props: VueLayoutProps;
    provide?: Partial<ProvidedMethods>;
    stubs?: Record<any, any>;
  },
) => {
  const wrapper = mount(component, {
    props,
    global: getGlobal({ provide, stubs }),
  });
  return {
    wrapper,
  };
};

export const mountJsonFormsRenderer = (
  component: Component,
  {
    props,
    provide = {},
    stubs = {},
  }: {
    props:
      | {
          control: ReturnType<
            typeof jsonformsVueModule.useJsonFormsControl
          >["control"];
        }
      | {
          layout: ReturnType<
            typeof jsonformsVueModule.useJsonFormsLayout
          >["layout"];
        };
    provide?: Partial<ProvidedMethods>;
    stubs?: Record<any, any>;
  },
) =>
  mount(component, {
    props: props as any,
    global: getGlobal({ provide, stubs }),
  });

export const getControlBase = (path: string) =>
  ({
    path,
    enabled: true,
    visible: true,
    label: "defaultLabel",
    rootSchema: {
      type: "object",
      properties: {
        [path]: {},
      },
    },
    renderers: [],
    cells: [],
    errors: "",
    id: "defaultId",
    config: {},
    description: "",
    required: false,
    i18nKeyPrefix: "i18n",
  }) satisfies Partial<
    ExtractPropTypes<ReturnType<typeof jsonformsVueModule.rendererProps>> &
      ReturnType<
        typeof jsonformsVueModule.useJsonFormsControl
      >["control"]["value"]
  >;
