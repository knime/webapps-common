import { computed, defineComponent, h } from "vue";
import {
  type ControlProps,
  rendererProps,
  useJsonFormsControl,
} from "@jsonforms/vue";

import type { ParameterizedComponent, RendererParams } from "../types";
import { getAsyncSetupMethod } from "../utils";

import type { VueControl } from "./types";
import { useValidation } from "./validation/useValidation";

/**
 * The last transformation step, since JSONForms expects renderers with core params.
 */
export const controlToRenderer = (
  component: VueControl<any>,
  asyncSetup?: () => Promise<void>,
): ParameterizedComponent<RendererParams> =>
  defineComponent(
    async (props, ctx) => {
      const processedProps = useJsonFormsControl(props as ControlProps);
      const isVisible = computed(() => processedProps.control.value.visible);
      const data = computed(() => processedProps.control.value.data);
      const { messages, isValid, onRegisterValidation } = useValidation({
        data,
      });
      await (asyncSetup || getAsyncSetupMethod(component))?.();
      return () =>
        isVisible.value
          ? h(
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
                isValid: isValid.value,
                messages: messages.value,
                onRegisterValidation,
              },
              ctx.slots,
            )
          : null;
    },
    {
      props: rendererProps(),
    },
  );
