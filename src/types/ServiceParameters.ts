import { Service, ServiceMethod } from '.';

/**
 * The parameters expected by the API layer for any callService call. The required members are:
 *
 *  - @member {ServiceMethod} - the top-level service.
 *  - @member {Service} - the service type.
 *  - @member {any} [parameters] - optional parameters to pass to the call.
 */
export type ServiceParameters = [ServiceMethod, Service, any];
