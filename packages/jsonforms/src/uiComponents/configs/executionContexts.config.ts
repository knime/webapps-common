export const EXECUTION_CONTEXT_STATUS = Object.freeze({
  DISABLED: "Disabled",
  RUNNING: "Running",
  STARTING_UP: "Starting up",
  SHUTTING_DOWN: "Shutting down",
  STOPPED: "Stopped",
  UPDATING: "Updating",
  PROCESSING: "Processing",
  AT_FULL_CAPACITY: "At full capacity",
  NOT_CONFIGURED: "Not configured",
  UNKNOWN: "Unknown",
});

export const EXECUTION_CONTEXT_SHARED_STATUS = Object.freeze({
  SHARED: "Shared",
  DEFAULT: "Default",
});

export const EXECUTION_CONTEXT_STATUS_TO_CLASS = {
  [EXECUTION_CONTEXT_STATUS.RUNNING]: "status-running",
  [EXECUTION_CONTEXT_STATUS.STOPPED]: "status-stopped",
  [EXECUTION_CONTEXT_STATUS.PROCESSING]: "status-processing",
  [EXECUTION_CONTEXT_STATUS.SHUTTING_DOWN]: "status-shutting-down",
  [EXECUTION_CONTEXT_STATUS.STARTING_UP]: "status-starting-up",
  [EXECUTION_CONTEXT_STATUS.UPDATING]: "status-updating",
  [EXECUTION_CONTEXT_STATUS.DISABLED]: "status-disabled",
  [EXECUTION_CONTEXT_STATUS.AT_FULL_CAPACITY]: "status-at-full-capacity",
  [EXECUTION_CONTEXT_STATUS.NOT_CONFIGURED]: "status-not-configured",
  [EXECUTION_CONTEXT_STATUS.UNKNOWN]: "status-unknown",
};

export type ECStatusToClassKeyType =
  keyof typeof EXECUTION_CONTEXT_STATUS_TO_CLASS;
