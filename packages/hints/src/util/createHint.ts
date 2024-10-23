import { h, ref, render } from "vue";
import type { Placement } from "@floating-ui/vue";

import HintPopover from "../components/HintPopover.vue";

const sideAndAlignToPlacement = (
  side?: "top" | "right" | "bottom" | "left",
  align?: "start" | "center" | "end",
) => {
  const sideWithFallback = side ?? "bottom";

  if (!align || align === "center") {
    return sideWithFallback as Placement;
  }
  return `${sideWithFallback}-${align}` as Placement;
};

/**
 * Utility function to create a hint.
 * @param element querySelector string to find the element
 * @param title The title of the popover
 * @param description The description that is displayed on the popover
 * @param onCompleteHint Callback that is triggered when hint is completed
 * @param onSkipAllHints Callback that is triggered when 'Skip all hints' is clicked
 * @param linkHref Optional link that can be provided
 * @param linkText Optional text for the provided link
 * @param side Optional: bottom (default), top, left, right
 * @param align Optional: start (default), end, center
 *
 * @returns An object containing the callbacks showHint and closeHint
 */
export const createHint = ({
  element,
  title,
  description,
  linkHref,
  linkText,
  align,
  side,
  onCompleteHint,
  onSkipAllHints,
}: {
  element: string;
  title: string;
  description: string;
  linkHref?: string;
  linkText?: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  onCompleteHint: () => void;
  onSkipAllHints: () => void;
}) => {
  const isVisible = ref(false);
  const show = () => {
    isVisible.value = true;
  };
  const destroy = () => {
    isVisible.value = false;
  };

  const popoverInstance = h(HintPopover, {
    content: {
      title,
      description,
      linkText,
      linkHref,
      completeHint: () => {
        destroy();
        onCompleteHint();
      },
      skipAllHints: () => {
        destroy();
        onSkipAllHints();
      },
    },
    isVisible,
    reference: element,
    placement: sideAndAlignToPlacement(side, align),
  });

  render(popoverInstance, document.body);

  return {
    showHint: () => show(),
    closeHint: () => destroy(),
  };
};
