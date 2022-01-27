/**
 * An environment-specific service function implementation (callable) which acts as an injectable API layer.
 *
 * @property {any} [env] - optional environment flag to denote where the service is executing.
 * @param {any[]} payload - the payload to pass during invocation.
 * @returns {Promise<any>} the service response as a Promise.
 */
type CallableService = {
    env?: string;
    (...payload: any[]): Promise<any>;
};
export { CallableService };
