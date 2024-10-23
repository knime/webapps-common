import { h, render } from "vue";
import { type DriveStep, driver } from "driver.js";

import HintPopover from "../components/HintPopover.vue";

// Remove this click handler when https://github.com/kamranahmedse/driver.js/issues/476 is added
let backDropClickCallback: any = null;

const removeBackDropClickCallback = () => {
  document.removeEventListener("click", backDropClickCallback, {
    capture: true,
  });
  backDropClickCallback = null;
};

const createBackDropClickCallback = ({
  onCompleteHint,
}: {
  onCompleteHint: () => void;
}) => {
  if (backDropClickCallback) {
    removeBackDropClickCallback();
  }
  backDropClickCallback = (event: MouseEvent) => {
    const overlay = document.getElementsByClassName("driver-overlay")?.[0];
    const path = overlay?.children?.[0];

    if (event.target === path) {
      onCompleteHint();
    }
  };
  document.addEventListener("click", backDropClickCallback, { capture: true });
  return backDropClickCallback;
};

/**
 * Utility function to create a hint.
 * @param elementId The DOM element id of the hint target
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
  elementId,
  title,
  description,
  linkHref,
  linkText,
  align,
  side,
  onCompleteHint,
  onSkipAllHints,
}: {
  elementId: string;
  title: string;
  description: string;
  linkHref?: string;
  linkText?: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  onCompleteHint: () => void;
  onSkipAllHints: () => void;
}) => {
  const driverObj = driver({
    animate: true,
    stageRadius: 0,
    popoverOffset: 15,
    popoverClass: "driver-wrapper",
    overlayOpacity: 0.0,
    onPopoverRender: (popover, options) => {
      const activeStep = options.state.activeStep! as DriveStep & {
        custom: any;
      };
      const popoverInstance = h(HintPopover, {
        title: activeStep.custom.title,
        description: activeStep.custom.description,
        linkText: activeStep.custom.linkText,
        linkHref: activeStep.custom.linkHref,
        completeHint: () => {
          activeStep.custom.onCompleteHint();
          driverObj.destroy();
        },
        skipAllHints: () => {
          activeStep.custom.onSkipAllHints();
          driverObj.destroy();
        },
      });
      // handle click on backdrop overlay
      createBackDropClickCallback({
        onCompleteHint: activeStep.custom.onCompleteHint,
      });

      render(popoverInstance, popover.wrapper);
    },
    onDestroyed: () => {
      removeBackDropClickCallback();
    },
  });
  // configure driver hint
  return {
    showHint: () =>
      driverObj.highlight({
        element: elementId,
        popover: {
          align: align ?? "start",
          side: side ?? "bottom",
        },
        // @ts-ignore
        custom: {
          onCompleteHint,
          onSkipAllHints,
          title,
          description,
          linkHref,
          linkText,
        },
      }),
    closeHint: () => driverObj.destroy(),
  };
};
