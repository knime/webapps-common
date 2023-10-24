import type { FlowSettings } from "@/nodeDialog/api/types";

type FlowVariablePopoverProps = {
  flowSettings?: FlowSettings;
  flowVariablesMap: Record<string, FlowSettings>;
  path: string;
  configKeys?: string[];
};

export default FlowVariablePopoverProps;
