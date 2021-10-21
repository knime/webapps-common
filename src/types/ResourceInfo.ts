import { ResourceTypeString } from './ResourceTypes';

/**
 * @property {string} id - unique identifier based on the factory class of the node.
 * @property {ResourceType} type - the resource type associated with the extension.
 * @property {string} [path] - the optional relative path of the resource (for remote resources).
 * @property {string} [url] - the optional absolute url of the resource (for local resources).
 */
export type ResourceInfo = {
    id: string;
    type: ResourceTypeString;
    path?: string;
    url?: string;
};
