import { NodeService, ServiceRequest } from "../index-f7c46dc0";
/**
 * The parameters expected by the API layer for any callService call. The required members are:
 *
 *  - @member {NodeService} - the node service to call.
 *  - @member {ServiceRequest} - the request to make to the specified node service.
 *  - @member {any} [parameters] - optional parameters to pass to the call.
 */
type ServiceParameters = [NodeService, ServiceRequest, any];
export { ServiceParameters };
