import type { FlowSettings } from "@/nodeDialog/api/types";

type FlowVariableSelectorProps = {
  flowSettings?: FlowSettings;
  flowVariablesMap: Record<string, FlowSettings>;
  persistPath: string;
  dataPath: string;
};

export default FlowVariableSelectorProps;
