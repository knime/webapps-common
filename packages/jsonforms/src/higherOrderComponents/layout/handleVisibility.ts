import { computed, h } from "vue";

import type { VueLayout } from "./types";
import { defineLayout } from "./util";

export const handleLayoutVisibility = (component: VueLayout): VueLayout =>
  defineLayout((props, ctx) => {
    const isVisible = computed(() => props.layout.visible);
    return () => (isVisible.value ? h(component, props, ctx.slots) : null);
  });
