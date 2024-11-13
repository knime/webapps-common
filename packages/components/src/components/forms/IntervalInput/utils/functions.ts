import { intervalUtils } from "@knime/utils";

import type { PopoverModelType } from "./types";

/**
 * When the popover model is committed using the accept button, we need to apply the changes
 * to the duration model and text field. This function takes care of that.
 * @param model
 * @param dateOrTime
 */
export const convertPopoverModelToPeriodOrDuration = (
  model: PopoverModelType,
  dateOrTime: "DATE" | "TIME",
): intervalUtils.PeriodOrDuration => {
  if (dateOrTime === "DATE") {
    return {
      type: "DATE",
      interval: model.periodPart,
    };
  } else {
    return {
      type: "TIME",
      interval: model.durationPart,
    };
  }
};

/**
 * Used to update the popover model when the duration model is changed from outside,
 * or when the user commits the changes in the text field.
 *
 * @param interval the interval to convert to the popover model.
 * @param fallback since the popover model is a union of period and duration, we need
 * to provide a fallback for the other part when the interval is changed.
 */
export const convertPeriodOrDurationToPopoverModel = (
  interval: intervalUtils.PeriodOrDuration,
  fallback: PopoverModelType,
): PopoverModelType => {
  if (interval.type === "DATE") {
    return {
      ...fallback,
      periodPart: interval.interval,
    };
  } else {
    return {
      ...fallback,
      durationPart: interval.interval,
    };
  }
};

export const toTitleCase = (key: string): string =>
  key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
