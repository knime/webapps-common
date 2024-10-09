import { type PropType, defineComponent, renderSlot, toRefs } from "vue";

import { BaseTreeNode } from "./baseTreeNode";
import type { TreeContext } from "./types";

export default defineComponent({
  name: "RenderNode",
  props: {
    titleCls: {
      type: String,
      default: "",
    },
    node: {
      type: Object as PropType<BaseTreeNode>,
      required: true,
    },
    context: {
      type: Object as PropType<TreeContext>,
      required: true,
    },
  },
  setup(props) {
    const { context, node, titleCls } = toRefs(props);
    return () => {
      // eslint-disable-next-line no-nested-ternary
      return context.value.renderNode ? (
        context.value.renderNode(node.value)
      ) : context.value.slots.node ? (
        renderSlot(context.value.slots, "node", { node: node.value })
      ) : (
        <span class={titleCls.value}>{node.value.name}</span>
      );
    };
  },
});
