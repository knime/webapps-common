import { NodeService, ExtensionService } from "../index-b5c74bb8";
/**
 * The parameters expected by the API layer for any callService call. The required members are:
 *
 *  - @member {NodeService} - the node service to call.
 *  - @member {ExtensionService} - the extension service to call.
 *  - @member {any} [parameters] - optional parameters to pass to the call.
 */
type ServiceParameters = [NodeService, ExtensionService, any];
export { ServiceParameters };
