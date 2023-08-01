import { DataServiceTypes } from "./DataServiceTypes";
import { SelectionModes } from "./SelectionModes";

/**
 * Any node service request supported by that specific node service.
 */
export type ServiceRequest = DataServiceTypes | SelectionModes;
