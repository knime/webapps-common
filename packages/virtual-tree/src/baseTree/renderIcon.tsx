import {
  type PropType,
  computed,
  defineComponent,
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
      // eslint-disable-next-line no-nested-ternary
      return renderIcon ? (
        renderIcon({ node, loading: loading.value, expanded: expanded.value })
      ) : slots.icon ? (
        renderSlot(slots, "icon", {
          node,
          loading: loading.value,
          expanded: expanded.value,
        })
      ) : (
        <div class="def-arrow">
          {loading.value ? (
            <i class="icon loading" />
          ) : (
            <i class="icon expand" />
          )}
        </div>
      );
    };
  },
});
