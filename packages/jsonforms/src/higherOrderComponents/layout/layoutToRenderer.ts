import { computed, defineComponent, h } from "vue";
import { rendererProps, useJsonFormsLayout } from "@jsonforms/vue";

import type { ParameterizedComponent, RendererParams } from "../types";
import { getAsyncSetupMethod } from "../utils";

import type { VueLayout } from "./types";

/**
 * The last transformation step, since JSONForms expects renderers with core params.
 */
export const layoutToRenderer = (
  component: VueLayout,
  asyncSetup?: () => Promise<void>,
): ParameterizedComponent<RendererParams> =>
  defineComponent(
    async (props, ctx) => {
      const { layout } = useJsonFormsLayout(props as any);
      const isVisible = computed(() => layout.value.visible);
      await (asyncSetup || getAsyncSetupMethod(component))?.();
      return () =>
        isVisible.value
          ? h(component, { layout: layout.value }, ctx.slots)
          : null;
    },
    {
      props: rendererProps(),
    },
  );
