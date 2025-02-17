import type { ValueSwitchItem } from "../../ValueSwitch/ValueSwitch.vue";

export type FormatDateType = "DATE" | "TIME" | "DATE_TIME" | "ZONED_DATE_TIME";
export type FormatCategory = "STANDARD" | "EUROPEAN" | "AMERICAN" | "RECENT";
export type FormatWithExample = {
  format: string;
  temporalType: FormatDateType;
  category: FormatCategory;
  example: string;
};

export type DateTimeFormatModel = {
  temporalType: FormatDateType;
  format: string;
};

export const dateTemporalTypesAsValueItems: ValueSwitchItem[] = [
  {
    id: "DATE",
    text: "Date",
  },
  {
    id: "TIME",
    text: "Time",
  },
  {
    id: "DATE_TIME",
    text: "Date & Time",
  },
  {
    id: "ZONED_DATE_TIME",
    text: "Date & Time & Zone",
  },
];
