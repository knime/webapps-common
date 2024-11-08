import type { ComponentPublicInstance } from "vue";

export type VideoSource = Array<{
  /** src attribute of the <source> tag */
  source: string;
  /** a valid MIME type like video/webm */
  type: string;
}>;

export type MaybeElement = Element | ComponentPublicInstance | null | undefined;

export interface HintConfiguration {
  /** The title of the hint */
  title: string;
  /** The description that is displayed on the hint */
  description: string;
  /** Text for the provided link */
  linkText?: string;
  /** Link that can be provided */
  linkHref?: string;
  /** Source paths and type of the video */
  video?: VideoSource;
  /** Hide the skip all and got it buttons */
  hideButtons?: boolean;
  /** Hint ids that need to be shown before this one is shown */
  dependsOn: string[];
  /** side, bottom is default */
  side?: "top" | "right" | "bottom" | "left";
  /** alignment, center is default */
  align?: "start" | "center" | "end";
  /** querySelector to find the anchor element, if omitted the id (object key) is used as `#<id>` */
  referenceSelector?: string;
}

export type HintState = {
  completedHints: string[];
  skipAll: boolean;
};
