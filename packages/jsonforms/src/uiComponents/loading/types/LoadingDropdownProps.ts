import type {
  TypedIdAndText,
  TypedIdAndTextWithLiveStatus,
} from "../../../types/ChoicesUiSchema";

export type LoadingDropdownProps = {
  possibleValues: (TypedIdAndText | TypedIdAndTextWithLiveStatus)[] | null;
  modelValue: string;
  id: string;
  ariaLabel: string;
  disabled: boolean;
  error: boolean;
};
