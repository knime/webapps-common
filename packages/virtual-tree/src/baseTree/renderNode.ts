import { type PropType, defineComponent, h, renderSlot, toRefs } from "vue";

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
      if (context.value.renderNode) {
        return context.value.renderNode(node.value);
      }
      if (context.value.slots.node) {
        return renderSlot(context.value.slots, "node", { node: node.value });
      }
      return h("span", { class: titleCls.value }, node.value.name);
    };
  },
});
