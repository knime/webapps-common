import { intervalUtils } from "@knime/utils";

export const periodNumericKeys: (keyof intervalUtils.Period)[] = [
  "years",
  "months",
  "weeks",
  "days",
];
export const durationNumericKeys: (keyof intervalUtils.Duration)[] = [
  "hours",
  "minutes",
  "seconds",
  "milliseconds",
];
export const bounds: { [key: string]: { min: number; max: number } } = {
  years: { min: 0, max: Number.MAX_SAFE_INTEGER },
  months: { min: 0, max: Number.MAX_SAFE_INTEGER },
  weeks: { min: 0, max: Number.MAX_SAFE_INTEGER },
  days: { min: 0, max: Number.MAX_SAFE_INTEGER },
  hours: { min: 0, max: Number.MAX_SAFE_INTEGER },
  minutes: { min: 0, max: Number.MAX_SAFE_INTEGER },
  seconds: { min: 0, max: Number.MAX_SAFE_INTEGER },
  milliseconds: { min: 0, max: 999 },
};
