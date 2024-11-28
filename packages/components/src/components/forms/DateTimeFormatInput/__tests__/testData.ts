import type { FormatWithExample } from "../utils/types";

export const DEFAULT_FORMATS: FormatWithExample[] = [
  // standard
  {
    format: "yyyy-MM-dd-blahblahblah",
    temporalType: "DATE",
    category: "STANDARD",
    example: "2021-01-01",
  },
  {
    format: "yyyy-MM-dd-yyyy",
    temporalType: "DATE",
    category: "STANDARD",
    example: "2021-01-01-2021",
  },
  {
    format: "HH:mm:ss",
    temporalType: "TIME",
    category: "STANDARD",
    example: "12:00:00",
  },
  {
    format: "yyyy-MM-dd HH:mm:ss",
    temporalType: "DATE_TIME",
    category: "STANDARD",
    example: "2021-01-01 12:00:00",
  },
  {
    format: "yyyy-MM-dd HH:mm:ss z",
    temporalType: "ZONED_DATE_TIME",
    category: "STANDARD",
    example: "2021-01-01 12:00:00 UTC",
  },
  // european
  {
    format: "dd/MM/yyyy",
    temporalType: "DATE",
    category: "EUROPEAN",
    example: "01/01/2021",
  },
  {
    format: "HH:mm:ss",
    temporalType: "TIME",
    category: "EUROPEAN",
    example: "12:00:00",
  },
  {
    format: "dd/MM/yyyy HH:mm:ss",
    temporalType: "DATE_TIME",
    category: "EUROPEAN",
    example: "01/01/2021 12:00:00",
  },
  {
    format: "dd/MM/yyyy HH:mm:ss z",
    temporalType: "ZONED_DATE_TIME",
    category: "EUROPEAN",
    example: "01/01/2021 12:00:00 UTC",
  },
  // american
  {
    format: "MM/dd/yyyy",
    temporalType: "DATE",
    category: "AMERICAN",
    example: "01/01/2021",
  },
  {
    format: "HH:mm:ss",
    temporalType: "TIME",
    category: "AMERICAN",
    example: "12:00:00",
  },
  {
    format: "MM/dd/yyyy HH:mm:ss",
    temporalType: "DATE_TIME",
    category: "AMERICAN",
    example: "01/01/2021 12:00:00",
  },
  {
    format: "MM/dd/yyyy HH:mm:ss z",
    temporalType: "ZONED_DATE_TIME",
    category: "AMERICAN",
    example: "01/01/2021 12:00:00 UTC",
  },
  // recent - the DATE_TIME example is intentionally missing.
  {
    format: "HH:mm:ss",
    temporalType: "TIME",
    category: "RECENT",
    example: "12:00:00",
  },
  {
    format: "yyyy-MM-dd",
    temporalType: "DATE",
    category: "RECENT",
    example: "2021-01-01 12:00:00",
  },
  {
    format: "yyyy-MM-dd HH:mm:ss z",
    temporalType: "ZONED_DATE_TIME",
    category: "RECENT",
    example: "2021-01-01 12:00:00 UTC",
  },
];
