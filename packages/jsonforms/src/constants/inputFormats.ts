import type { Tester } from "@jsonforms/core";

export const inputFormats = {
  singleSelect: "singleSelection",
  dropDown: "dropDown",
  radio: "radio",
  valueSwitch: "valueSwitch",
  checkboxes: "checkboxes",
  integer: "integer",
  number: "number",
  typedStringFilter: "typedStringFilter",
  nameFilter: "nameFilter",
  richTextInput: "richTextInput",
  twinList: "twinList",
  comboBox: "comboBox",
  sortList: "sortList",
  simpleButton: "simpleButton",
  textArea: "textArea",
  textMessage: "textMessage",
  localTime: "localTime",
  localDate: "localDate",
  zonedDateTime: "zonedDateTime",
  dateTime: "dateTime",
  interval: "interval",
  dateTimeFormatWithType: "dateTimeFormatWithType",
  dateTimeFormat: "dateTimeFormat",
  multiSelectListBox: "multiSelectListBox",
  singleSelectListBox: "singleSelectListBox",
} as const;

// union type of the values of the inputFormats object:
export type InputFormat = (typeof inputFormats)[keyof typeof inputFormats];

export const hasFormat =
  (format: InputFormat): Tester =>
  (uischema) =>
    uischema.options?.format === format;
