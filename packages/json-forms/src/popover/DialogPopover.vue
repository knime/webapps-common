<script setup lang="ts">
import { type Ref, computed, nextTick, ref, toRef, watch } from "vue";
import {
  arrow,
  autoUpdate,
  flip,
  limitShift,
  offset,
  shift,
  useFloating,
} from "@floating-ui/vue";
import type { Placement, Side } from "@floating-ui/vue";
import { FocusTrap } from "focus-trap-vue";
import { tabbable } from "tabbable";

import { FunctionButton, useClickOutside } from "@knime/components";

import getDeepActiveElement from "@/utils/getDeepActiveElement";
import inject from "../utils/inject";

import type { DialogPopoverProps } from "./types/DialogPopoverProps";

const props = withDefaults(defineProps<DialogPopoverProps>(), {
  ignoredClickOutsideTarget: null,
});

// dom elements
const reference: Ref<null | typeof FunctionButton> = ref(null);

const referenceEl: Ref<null | HTMLElement> = ref(null);
watch(
  () => reference.value,
  () => {
    if (reference.value !== null) {
      referenceEl.value = reference.value.getComponent();
    }
  },
);

const floating: Ref<null | HTMLElement> = ref(null);
const floatingArrow: Ref<null | HTMLElement> = ref(null);

// configuration using floating-ui
const shiftPadding = 10;
const { x, y, middlewareData, placement, update } = useFloating(
  referenceEl,
  floating,
  {
    placement: "top",
    whileElementsMounted: autoUpdate,
    middleware: [
      /**
       * Clip the floating popover to its referenceEl
       */
      shift({
        padding: shiftPadding,
        limiter: limitShift({
          crossAxis: false,
          offset: ({ rects }) => rects.reference.width + shiftPadding,
        }),
      }),
      /**
       * Enable positioning an arrow pointing to the referenceEl
       */
      arrow({ element: floatingArrow }),
      /**
       * Move the popover away from the referenceEl
       */
      // eslint-disable-next-line no-magic-numbers
      offset(10),
      flip(),
    ],
  },
);

// compute the side on which the arrow should be positioned
const placementToSide = (floatingPlacement: Placement): Side => {
  return floatingPlacement.split("-")[0] as Side;
};
const oppositeSide: Record<Side, Side> = {
  top: "bottom",
  right: "left",
  bottom: "top",
  left: "right",
};
const arrowSide = computed(
  () => oppositeSide[placementToSide(placement.value)],
);

// focus

const buttonFocused = ref(false);
const focusTrap: Ref<typeof FocusTrap | null> = ref(null);
watch(
  () => focusTrap.value,
  () => {
    /** setTimeout is necessary for the useClickOutside handler in the DialogPopover
     *  to not close the popover immediately again */
    setTimeout(() => {
      if (focusTrap.value !== null) {
        const firstFocusableElement = tabbable(focusTrap.value.$el).at(0);
        if (firstFocusableElement) {
          firstFocusableElement.focus();
          focusTrap.value.activate();
        }
      }
    });
  },
);
const body = document.body;
const focusButton = () => {
  reference.value?.focus();
};

const resizeObserver = ref<ResizeObserver | null>(null);

// expanding and closing
const expanded = ref(false);

const toggleResizeObserver = async () => {
  let observance: keyof ResizeObserver = "unobserve";
  if (expanded.value) {
    observance = "observe";
    await nextTick();
    // this resize observer is necessary to update the position of the popover when the dialog is resized without using
    // the native resize event which is used by "autoUpdate"
    resizeObserver.value = new ResizeObserver(update);
  }
  const floatingContainer = floating.value?.parentElement;
  if (floatingContainer) {
    resizeObserver.value?.[observance](floatingContainer);
  }
  if (!expanded.value) {
    resizeObserver.value = null;
  }
};

const toggleExpanded = () => {
  expanded.value = !expanded.value;
  toggleResizeObserver();
};

const close = () => {
  expanded.value = false;
};

const closeUnlessButtonFocused = () => {
  if (getDeepActiveElement() !== referenceEl.value) {
    close();
  }
};

const otherElement = toRef(props, "ignoredClickOutsideTarget");

// close the dialog when clicking outside the button, the popover and any other targets defined by the props
useClickOutside(
  { targets: [floating, otherElement], callback: closeUnlessButtonFocused },
  expanded,
);

const onEscapeOnButton = (event: KeyboardEvent) => {
  if (expanded.value) {
    event.stopPropagation();
    event.preventDefault();
    close();
    focusButton();
  }
};

const teleportDest = inject("getDialogPopoverTeleportDest")();
</script>

<template>
  <div class="popover-button-wrapper">
    <FunctionButton
      ref="reference"
      :title="tooltip"
      :active="expanded"
      @mouseup.stop="toggleExpanded"
      @keydown.space.stop="toggleExpanded"
      @keydown.enter.stop="toggleExpanded"
      @keydown.esc="onEscapeOnButton"
      @keydown.tab="close"
      @focus="buttonFocused = true"
      @blur="buttonFocused = false"
    >
      <slot name="icon" :expanded="expanded" :focused="buttonFocused" />
    </FunctionButton>
  </div>
  <Teleport :disabled="!teleportDest" :to="teleportDest">
    <div
      v-if="expanded"
      ref="floating"
      class="floating"
      :style="{ left: `${x}px`, top: `${y}px`, width: popoverWidth }"
      @keydown.esc.stop="() => [close(), focusButton()]"
    >
      <div
        ref="floatingArrow"
        class="arrow"
        :style="{
          left: `${middlewareData.arrow?.x}px`,
          [arrowSide]: '-4px',
        }"
      />
      <FocusTrap ref="focusTrap" :fallback-focus="() => body" :active="false">
        <div class="box">
          <slot name="popover" :expanded="expanded" />
        </div>
      </FocusTrap>
    </div>
  </Teleport>
</template>

<style lang="postcss" scoped>
.popover-button-wrapper {
  margin-left: 5px;

  --button-size: 15px;

  & :deep(.function-button.single) {
    width: var(--button-size);
    height: var(--button-size);
    padding: 0;

    & svg {
      width: var(--button-size);
      height: var(--button-size);
    }
  }
}

.floating {
  --popover-oversize: 10px;

  position: absolute;
  z-index: 3;
  background: var(--knime-white);
  max-width: calc(100% + 2 * var(--popover-oversize));

  & .arrow {
    --popover-arrow-size: 15px;

    position: absolute;
    transform: rotate(45deg);
    background: var(--knime-white);
    width: var(--popover-arrow-size);
    height: var(--popover-arrow-size);
  }

  & .box {
    background: var(--knime-white);
    padding: 15px;
    box-shadow: 0 2px 10px 0 var(--knime-gray-dark-semi);
  }
}
</style>
