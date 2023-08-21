import type { FlowSettings } from "@/nodeDialog/api/types";

type FlowVariableSelectorProps = {
  flowSettings?: FlowSettings;
  flowVariablesMap: Record<string, FlowSettings>;
  path: string;
  configKeys?: string[];
};

export default FlowVariableSelectorProps;
