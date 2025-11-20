import { type Mock, vi } from "vitest";
import { type Component, type ExtractPropTypes, ref } from "vue";
import { type VueWrapper, flushPromises, mount } from "@vue/test-utils";
import * as jsonformsVueModule from "@jsonforms/vue";

import type {
  VueControl,
  VueControlProps,
  VueControlPropsForLabelContent,
  VueControlThatRequiresLabelWrapper,
  VueLayout,
  VueLayoutProps,
} from "../src/higherOrderComponents";
import { subPanelDestInjectionKey } from "../src/layoutComponents/settingsSubPanel/SettingsSubPanel.vue";

export type ProvidedMethods = {
  sendAlert: Mock;
  trigger: Mock;
  addStateProviderListener: Mock;
};

export type VueControlTestProps<
  C extends abstract new (...args: never[]) => void,
> = Omit<
  InstanceType<C>["$props"],
  "handleChange" | "changeValue" | "onRegisterValidation"
>;

type RecordKeyTypes = string | number | symbol;

export const getGlobal = ({
  provide,
  stubs,
}: {
  provide?: Partial<ProvidedMethods>;
  stubs?: Record<RecordKeyTypes, unknown>;
}) => ({
  provide: {
    sendAlert: provide?.sendAlert || vi.fn(),
    addStateProviderListener: provide?.addStateProviderListener || vi.fn(),
    trigger: provide?.trigger || vi.fn(),
    [subPanelDestInjectionKey as symbol]: ref("body"),
    ...provide,
  },
  stubs: {
    DispatchRenderer: true,
    ...stubs,
  } as Record<string, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
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
    stubs?: Record<RecordKeyTypes, unknown>;
  },
): {
  wrapper: VueWrapper;
  handleChange: Mock;
  changeValue: Mock;
  onRegisterValidation: Mock;
} => {
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
    stubs?: Record<RecordKeyTypes, unknown>;
  },
): {
  wrapper: VueWrapper;
  handleChange: Mock;
  changeValue: Mock;
  onRegisterValidation: Mock;
} => {
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
    stubs?: Record<RecordKeyTypes, unknown>;
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
    stubs?: Record<RecordKeyTypes, unknown>;
  },
) =>
  mount(component, {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export const useInitialProvidedState = <T>() => {
  let provideState: (state: T) => void;
  const addStateProviderListener = vi.fn((_id, callback) => {
    provideState = callback;
  });
  return {
    addStateProviderListener,
    provideState: async (state: T) => {
      provideState(state);
      await flushPromises();
    },
  };
};
