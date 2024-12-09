import type { IdAndText } from "../../../types/ChoicesUiSchema";

export type LoadingDropdownProps = {
  possibleValues: IdAndText[] | null;
  modelValue: string;
  id: string;
  ariaLabel: string;
  disabled: boolean;
};
