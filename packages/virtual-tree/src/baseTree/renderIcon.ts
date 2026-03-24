import {
  type PropType,
  computed,
  defineComponent,
  h,
  renderSlot,
  toRefs,
} from "vue";

import { BaseTreeNode } from "./baseTreeNode";
import type { TreeContext } from "./types";

export default defineComponent({
  name: "RenderIcon",
  props: {
    node: {
      type: Object as PropType<BaseTreeNode>,
      required: true,
    },
    context: {
      type: Object as PropType<TreeContext>,
      required: true,
    },
  },
  setup({ context, node }) {
    const { loading, key } = toRefs(node);
    const { expandedKeys, renderIcon, slots } = context;
    const expanded = computed(() => expandedKeys.has(key.value));
    return () => {
      if (renderIcon) {
        return renderIcon({
          node,
          loading: loading.value,
          expanded: expanded.value,
        });
      }
      if (slots.icon) {
        return renderSlot(slots, "icon", {
          node,
          loading: loading.value,
          expanded: expanded.value,
        });
      }
      return h("div", { class: "def-arrow" }, [
        loading.value
          ? h("i", { class: "icon loading" })
          : h("i", { class: "icon expand" }),
      ]);
    };
  },
});
