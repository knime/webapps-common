import { type VNode, h } from "vue";

import ErrorMessageWrapper from "./ErrorMessageWrapper.vue";
import type { VueControl, VueControlProps } from "./types";
import { defineControl, handleAsyncComponents } from "./util";

export const addErrorMessageToVNode = (
  vNode: VNode,
  props: Pick<VueControlProps<any>, "messages">,
): VNode | VNode[] => {
  if (props.messages.errors.length > 0) {
    return h(
      ErrorMessageWrapper,
      { errors: props.messages.errors },
      {
        default: () => vNode,
      },
    );
  }
  return vNode;
};

const addErrorMessageToControl = <D>(control: VueControl<D>): VueControl<D> =>
  defineControl((props, ctx) => () => {
    const controlVNode = h(control, props, ctx.slots);
    return addErrorMessageToVNode(controlVNode, props);
  });

export const withErrorMessage = handleAsyncComponents(addErrorMessageToControl);
