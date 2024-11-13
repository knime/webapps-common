import { computed, ref } from "vue";

import type { MaybeElement, VideoSource } from "../types";

/**
 * Manages the created hints options state between the HintComponents and the useHint composable.
 */

export type HintComponentOptions = {
  /** querySelector string to find the element */
  element: string | MaybeElement;
  /** The title of the popover */
  title: string;
  /** The description that is displayed on the popover */
  description: string;
  /** link that can be provided */
  linkHref?: string;
  /** text for the provided link */
  linkText?: string;
  /** Hide the skip all and got it buttons */
  hideButtons?: boolean;
  /** Source paths and type of the video */
  video?: VideoSource;
  /** side defaults to bottom */
  side?: "top" | "right" | "bottom" | "left";
  /** alignment defaults to center */
  align?: "start" | "center" | "end";
  onCompleteHint: () => void;
  onSkipAllHints: () => void;
  isVisible?: boolean;
};

const hintComponentOptions = ref<Record<string, HintComponentOptions>>({});

const createHintData = (
  hintId: string,
  options: Omit<HintComponentOptions, "isVisible">,
) => {
  // add to ref
  hintComponentOptions.value[hintId] = { ...options, isVisible: false };

  const result = {
    showHint: (hintId: string) => {
      hintComponentOptions.value[hintId].isVisible = true;
    },
    closeHint: (hintId: string) => {
      hintComponentOptions.value[hintId].isVisible = false;
    },
  };
  return result;
};

export const useHintProvider = () => {
  return {
    createHintData,
    hintData: computed<HintComponentOptions[]>(() =>
      Object.values(hintComponentOptions.value),
    ),
  };
};
