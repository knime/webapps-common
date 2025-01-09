import { defineComponent, h } from "vue";
import {
  type ControlProps,
  rendererProps,
  useJsonFormsControl,
} from "@jsonforms/vue";

import type { ParameterizedComponent, RendererParams } from "../types";

import type { VueControl } from "./types";

/**
 * The last transformation step, since JSONForms expects renderers with core params.
 */
export const controlToRenderer = (
  component: VueControl<any>,
): ParameterizedComponent<RendererParams> =>
  defineComponent(
    (props, ctx) => {
      const processedProps = useJsonFormsControl(props as ControlProps);
      return () =>
        h(
          component,
          {
            handleChange: processedProps.handleChange,
            control: processedProps.control.value as any,
            disabled: !processedProps.control.value.enabled,
            changeValue: (newValue: any) =>
              processedProps.handleChange(
                processedProps.control.value.path,
                newValue,
              ),
          },
          ctx.slots,
        );
    },
    {
      props: rendererProps(),
    },
  );
