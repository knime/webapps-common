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
      const options = computed(
        () => processedProps.control.value.uischema.options || {},
      );
      const {
        messages,
        isValid,
        onRegisterValidation,
        performExternalValidationDebounced,
      } = useValidation({
        data,
        options,
        performExternalValidation: config?.performExternalValidation,
      });
      await (asyncSetup || getAsyncSetupMethod(component))?.();
      return () =>
        isVisible.value
          ? h(
              component,
              {
                handleChange: processedProps.handleChange,
                control: processedProps.control.value,
                disabled: !processedProps.control.value.enabled,
                changeValue: (newValue: unknown) => {
                  processedProps.handleChange(
                    processedProps.control.value.path,
                    newValue,
                  );
                  performExternalValidationDebounced(newValue);
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
