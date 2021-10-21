/**
 * Service type for node-level data services. Other, custom services may be implemented, but those known by the
 * framework are listed here.
 *
 * @enum {string}
 *
 * TODO: NXT-761 convert to interfaces which are then members of the <Type>DataService implementations.
 */
declare enum DataServices {
    INITIAL_DATA = "initial_data",
    DATA = "data",
    APPLY_DATA = "apply_data"
}
export { DataServices };
