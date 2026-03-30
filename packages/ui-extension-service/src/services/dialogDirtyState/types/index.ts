export interface SettingState<T = unknown> {
  setValue: (t: T, options?: { cleanPreserving?: boolean }) => void;
  addControllingFlowVariable: (flowVarName: string | null) => {
    set: (
      flowVarName: string,
      options?: { isFlawed?: boolean; cleanPreserving?: boolean },
    ) => void;
    unset: (options?: { cleanPreserving?: boolean }) => void;
  };
  addExposedFlowVariable: (flowVarName: string | null) => {
    set: (flowVarName: string, options?: { cleanPreserving?: boolean }) => void;
    unset: (options?: { cleanPreserving?: boolean }) => void;
  };
}
