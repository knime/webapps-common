import { NodeService, ServiceRequest } from '.';

/**
 * The parameters expected by the API layer for any callService call. The required members are:
 *
 *  - @member {NodeService} - the node service to call.
 *  - @member {ServiceRequest} - the request to make to the specified node service.
 *  - @member {any} [parameters] - optional parameters to pass to the call.
 */
export type ServiceParameters = [NodeService, ServiceRequest, any];
