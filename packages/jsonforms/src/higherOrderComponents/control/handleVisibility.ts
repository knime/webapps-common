import { computed, h } from "vue";

import type { VueControl } from "./types";
import { defineControl } from "./util";

export const handleControlVisibility = <D>(
  component: VueControl<D>,
): VueControl<D> =>
  defineControl((props, ctx) => {
    const isVisible = computed(() => props.control.visible);
    return () => (isVisible.value ? h(component, props, ctx.slots) : null);
  });
