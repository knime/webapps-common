import { DialogService } from "@knime/ui-extension-service";
import { vi } from "vitest";

export const controllingFlowVariableState = {
  set: vi.fn(),
  unset: vi.fn(),
};
export const exposedFlowVariableState = {
  set: vi.fn(),
  unset: vi.fn(),
};
export const registeredSettingState = {
  addControllingFlowVariable: vi.fn(() => controllingFlowVariableState),
  addExposedFlowVariable: vi.fn(() => exposedFlowVariableState),
  setValue: vi.fn(),
};

export const mockRegisterSettings = () =>
  vi
    .spyOn(DialogService.prototype, "registerSettings")
    .mockImplementation(() => () => registeredSettingState);
