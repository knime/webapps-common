import type { intervalUtils } from "@knime/utils";

export type UsedIntervalFormatsType = "DATE" | "TIME";
export type AllowedIntervalFormatsType = "DATE" | "TIME" | "DATE_OR_TIME";
export type IntervalDirectionalityType = "ASCENDING" | "DESCENDING";

/**
 * We use this type for the popover model, as it is capable of remembering the
 * period part of the model even when we are displaying the duration part, and vice
 * versa. This way, switching between date and time doesn't wipe out any data until
 * the settings are applied.
 */
export type PopoverModelType = {
  periodPart: intervalUtils.Period;
  durationPart: intervalUtils.Duration;
};
