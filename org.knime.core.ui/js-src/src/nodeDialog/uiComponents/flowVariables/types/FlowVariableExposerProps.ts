import type { FlowSettings } from "@/nodeDialog/api/types";

type FlowVariableSelectorProps = {
  flowSettings?: FlowSettings;
  flowVariablesMap: Record<string, FlowSettings>;
  persistPath: string;
};

export default FlowVariableSelectorProps;
