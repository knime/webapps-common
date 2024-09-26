import type { IdAndText } from "@/nodeDialog/types/ChoicesUiSchema";

type LoadingDropdownProps = {
  possibleValues: IdAndText[] | null;
  modelValue: string;
  id: string;
  ariaLabel: string;
  disabled: boolean;
};

export default LoadingDropdownProps;
