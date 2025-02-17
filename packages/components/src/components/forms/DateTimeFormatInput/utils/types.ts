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
