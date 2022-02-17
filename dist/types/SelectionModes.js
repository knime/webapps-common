/**
 * Selection service modes available by default to UI Extension nodes.
 *
 * @enum {string}
 */
var SelectionModes;
(function (SelectionModes) {
    SelectionModes["ADD"] = "ADD";
    SelectionModes["REMOVE"] = "REMOVE";
    SelectionModes["REPLACE"] = "REPLACE";
})(SelectionModes || (SelectionModes = {}));

export { SelectionModes };
