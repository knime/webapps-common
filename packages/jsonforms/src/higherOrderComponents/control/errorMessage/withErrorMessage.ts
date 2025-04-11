import { type VNode, h } from "vue";

import type { VueControl, VueControlProps } from "../types";
import { defineControl, handleAsyncComponents } from "../util";

import ErrorMessages from "./ErrorMessages.vue";

export const addErrorMessageToVNode =
  ({ fill }: { fill: boolean }) =>
  (
    vNode: VNode,
    props: Pick<VueControlProps<any>, "messages">,
  ): VNode | VNode[] =>
    h(
      ErrorMessages,
      { errors: props.messages.errors, fill },
      {
        default: () => vNode,
      },
    );

const addErrorMessageToControl =
  (config: { fill: boolean }) =>
  <D>(control: VueControl<D>): VueControl<D> =>
    defineControl((props, ctx) => () => {
      const controlVNode = h(control, props, ctx.slots);
      return addErrorMessageToVNode(config)(controlVNode, props);
    });

export const withErrorMessage = (
  config: {
    /**
     * Set to true if the renderer should grow within its parent
     */
    fill: boolean;
  } = { fill: false },
) => handleAsyncComponents(addErrorMessageToControl(config));
