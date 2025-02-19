import { type VNode, h } from "vue";

import type { VueControl, VueControlProps } from "../types";
import { defineControl, handleAsyncComponents } from "../util";

import ErrorMessages from "./ErrorMessages.vue";

export const addErrorMessageToVNode = (
  vNode: VNode,
  props: Pick<VueControlProps<any>, "messages">,
): VNode | VNode[] =>
  h(
    ErrorMessages,
    { errors: props.messages.errors },
    {
      default: () => vNode,
    },
  );

const addErrorMessageToControl = <D>(control: VueControl<D>): VueControl<D> =>
  defineControl((props, ctx) => () => {
    const controlVNode = h(control, props, ctx.slots);
    return addErrorMessageToVNode(controlVNode, props);
  });

export const withErrorMessage = handleAsyncComponents(addErrorMessageToControl);
