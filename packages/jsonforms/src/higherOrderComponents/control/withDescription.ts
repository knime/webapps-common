import { computed, h } from "vue";

import DescriptionPopover from "./DescriptionPopover.vue";
import type { VueControl } from "./types";
import { defineControl } from "./util";

export const withDescriptionButton = <D>(
  component: VueControl<D>,
): VueControl<D> =>
  defineControl((props, ctx) => {
    const description = computed(() => props.control.description);
    return () =>
      h(component, props, {
        ...ctx.slots,
        buttons: (slotProps: {
          controlHTMLElement?: HTMLElement;
          hover: boolean;
        }) => {
          const hasDescription =
            typeof description.value !== "undefined" &&
            description.value !== "";
          return [
            ...(ctx.slots.buttons ? [ctx.slots.buttons(slotProps)] : []),
            ...(hasDescription
              ? [
                  h(DescriptionPopover, {
                    html: description.value,
                    hover: slotProps.hover,
                  }),
                ]
              : []),
          ];
        },
      });
  });
