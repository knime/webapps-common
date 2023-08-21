import type { FlowSettings } from "@/nodeDialog/api/types";

type FlowVariableButtonProps = {
  flowSettings?: FlowSettings;
  flowVariablesMap: Record<string, FlowSettings>;
  path: string;
  configKeys?: string[];
  hover: boolean;
};

export default FlowVariableButtonProps;
