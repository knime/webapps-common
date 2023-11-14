import type { FlowSettings } from "@/nodeDialog/api/types";

type FlowVariableButtonProps = {
  flowSettings?: FlowSettings;
  flowVariablesMap: Record<string, FlowSettings>;
  path: string;
  configKeys?: string[];
  /**
   * In case the setting consists of mulitple flow variables by design.
   * The entries in this list might be deeply nested config keys like "sub.config.key"
   */
  subConfigKeys?: string[];
  hover: boolean;
};

export default FlowVariableButtonProps;
