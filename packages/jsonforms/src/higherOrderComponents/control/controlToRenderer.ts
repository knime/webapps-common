import { computed, defineComponent, h } from "vue";
import {
  type ControlProps,
  rendererProps,
  useJsonFormsControl,
} from "@jsonforms/vue";

import type { ParameterizedComponent, RendererParams } from "../types";
import { getAsyncSetupMethod } from "../utils";

import type { VueControl } from "./types";
import type { PerformExternalValidation } from "./validation/types";
import useCustomValidation from "./validation/useCustomValidation";
import { useValidation } from "./validation/useValidation";

/**
 * The last transformation step, since JSONForms expects renderers with core params.
 */
export const controlToRenderer = ({
  component,
  asyncSetup,
  config = {},
}: {
  component: VueControl<unknown>;
  asyncSetup?: () => Promise<void>;
  config?: {
    performExternalValidation?: PerformExternalValidation<unknown>;
  };
}): ParameterizedComponent<RendererParams> =>
  defineComponent(
    async (props, ctx) => {
      const processedProps = useJsonFormsControl(props as ControlProps);
      const isVisible = computed(() => processedProps.control.value.visible);
      const data = computed(() => processedProps.control.value.data);

      const uischema = computed(
        () => processedProps.control.value.uischema || {},
      );

      const { customValidationMessage, performCustomValidationDebounced } =
        useCustomValidation({ data, uischema });

      const options = computed(() => uischema.value.options || {});
      const {
        messages,
        isValid,
        onRegisterValidation,
        performExternalValidationDebounced,
      } = useValidation({
        data,
        options,
        performExternalValidation: config?.performExternalValidation,
        customValidationMessage,
      });
      await (asyncSetup || getAsyncSetupMethod(component))?.();
      const handleChange = (path: string, value: unknown) => {
        processedProps.handleChange(path, value);
        performExternalValidationDebounced(value);
        performCustomValidationDebounced(value);
      };
      return () =>
        isVisible.value
          ? h(
              component,
              {
                handleChange,
                control: processedProps.control.value,
                disabled: !processedProps.control.value.enabled,
                changeValue: (newValue: unknown) => {
                  handleChange(processedProps.control.value.path, newValue);
                },
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
