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

export const EXECUTION_CONTEXT_CAPACITY = Object.freeze({
  SMALL: "small",
  MEDIUM: "medium",
  LARGE: "large",
});
export const EXECUTION_CONTEXT_VCORES = Object.freeze({
  [EXECUTION_CONTEXT_CAPACITY.SMALL]: 2,
  [EXECUTION_CONTEXT_CAPACITY.MEDIUM]: 4,
  [EXECUTION_CONTEXT_CAPACITY.LARGE]: 8,
});

export const EXECUTION_CONTEXT_MEMORY_IN_MB = Object.freeze({
  [EXECUTION_CONTEXT_CAPACITY.SMALL]: 8,
  [EXECUTION_CONTEXT_CAPACITY.MEDIUM]: 16,
  [EXECUTION_CONTEXT_CAPACITY.LARGE]: 32,
});

export const EXECUTION_CONTEXT_DESCRIPTIONS = Object.freeze({
  [EXECUTION_CONTEXT_CAPACITY.SMALL]:
    "Suitable for lightweight data processing with low complexity workflows. Slightly slower than your average home computer but good enough for repetitive, lightweight automation.",
  [EXECUTION_CONTEXT_CAPACITY.MEDIUM]:
    "Suitable for most data processing use cases with medium complex workflows. Similar to the performance of KNIME Analytics Platform on an average home PC.",
  [EXECUTION_CONTEXT_CAPACITY.LARGE]:
    "For more demanding use cases with more data, complex workflows and more parallel processing and faster computation times required.",
});

export const PRODUCT_METADATA_BASE_FIELD = "knime.hub.product.base";
export const EXECUTION_BASE_PRODUCT_ID = "execution-payg-base";
export const SHARED_EXECUTION_CONTEXT = "hub:global";

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
