export interface SettingState<T = any> {
  setValue: (t: T) => void;
  addControllingFlowVariable: (flowVarName: string | null) => {
    set: (flowVarName: string, options?: { isFlawed: boolean }) => void;
    unset: () => void;
  };
  addExposedFlowVariable: (flowVarName: string | null) => {
    set: (flowVarName: string) => void;
    unset: () => void;
  };
}
