import {
  type FilterConfig,
  type PossibleValue,
  filterComponents,
} from "@knime/knime-ui-table";

export const createDefaultFilterConfig = (
  isMultiselect: boolean,
  possibleValues: PossibleValue[] | null,
): FilterConfig => {
  if (isMultiselect) {
    return {
      is: "ControlMultiselect",
      possibleValues: possibleValues ?? [],
      modelValue: filterComponents.Multiselect.getInitialValue(),
    };
  }
  return {
    is: "FilterInputField",
    modelValue: filterComponents.InputField.getInitialValue(),
  };
};

export const arrayEquals = (a: any[], b: any[]) =>
  a.length === b.length && a.every((val, index) => val === b[index]);

type ContentType = "img_path" | "html" | "txt";

export const isImage = (contentType: ContentType) => contentType === "img_path";

export const isHtml = (contentType: ContentType) => contentType === "html";
