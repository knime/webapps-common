import type { TypedIdAndText } from "../../../types/ChoicesUiSchema";

export type LoadingDropdownProps = {
  possibleValues: TypedIdAndText[] | null;
  modelValue: string;
  id: string;
  ariaLabel: string;
  disabled: boolean;
};
