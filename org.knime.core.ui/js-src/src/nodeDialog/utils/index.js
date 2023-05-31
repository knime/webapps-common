export const optionsMapper = ({ const: id, title: text }) => ({ id, text });

const isObject = (item) => item && typeof item === 'object' && !Array.isArray(item);

const extractFromUiSchemaOptions = (control, key) => {
    const options = control.uischema.options;
    return options ? options[key] : false;
};

export const getPossibleValuesFromUiSchema = (control) => {
    const normalPossibleValues = extractFromUiSchemaOptions(control, 'possibleValues') || [];
    const showNoneColumn = Boolean(extractFromUiSchemaOptions(control, 'showNoneColumn'));
    const showRowKeys = Boolean(extractFromUiSchemaOptions(control, 'showRowKeys'));
    return [
        ...showNoneColumn ? [{ id: '<none>', text: 'None' }] : [],
        ...showRowKeys ? [{ id: '<row-keys>', text: 'RowIDs' }] : [],
        ...normalPossibleValues
    ];
};

// Merge two objects deeply while overwriting only keys of obj1 if necessary. This can be used to alter the data
// in the dialog settings in a more simple way for complex data structures.
export const mergeDeep = (obj1, obj2) => {
    let output = Object.assign({}, obj1);
    if (isObject(obj2)) {
        Object.keys(obj2).forEach(key => {
            if (isObject(obj2[key])) {
                if (isObject(obj1) && !(key in obj1)) {
                    Object.assign(output, { [key]: obj2[key] });
                } else {
                    output[key] = mergeDeep(obj1[key], obj2[key]);
                }
            } else {
                Object.assign(output, { [key]: obj2[key] });
            }
        });
    }
    return output;
};

export const isModelSettingAndHasNodeView = (control) => control?.rootSchema?.hasNodeView &&
    control?.uischema?.scope?.startsWith('#/properties/model');

// expects a modified root schema which includes a flowVariablesMap
// the root schema should look like the following:
// rootSchema: {
//    flowVariablesMap: {},
//    schema: {},
//    uischema: {},
//    ...
// }
export const getFlowVariablesMap = ({ rootSchema, path, schema }) => {
    if (rootSchema?.flowVariablesMap) {
        if (schema.configKeys) {
            // Controlled by configs with other keys
            const parentPath = path.split('.').slice(0, -1).join('.');
            return schema.configKeys
                .map(key => rootSchema.flowVariablesMap[[parentPath, key].join('.')])
                .filter(v => v)
                .reduce((a, b) => ({
                    controllingFlowVariableAvailable:
                        a?.controllingFlowVariableAvailable || b?.controllingFlowVariableAvailable,
                    controllingFlowVariableName: a?.controllingFlowVariableName
                        ? a?.controllingFlowVariableName
                        : b?.controllingFlowVariableName,
                    exposedFlowVariableName: a?.exposedFlowVariableName
                        ? a?.exposedFlowVariableName
                        : b?.exposedFlowVariableName
                }), null);
        } else {
            // Controlled by configs with the key for this path
            return rootSchema.flowVariablesMap.hasOwnProperty(path) ? rootSchema.flowVariablesMap[path] : null;
        }
    }
    return null;
};

// eslint-disable-next-line max-params
// recursive function to check if the object contains a key value pair with a given parent
const isKeyValuePresentInObject = (object, parentKey, keyName, value, currentParentKey = '') => {
    if (object === null || typeof object === 'undefined') {
        return false;
    }

    for (const [key, val] of Object.entries(object)) {
        if (parentKey === currentParentKey && key === keyName && val === value) {
            return true;
        } else if (typeof val === 'object') {
            currentParentKey = key;
            if (isKeyValuePresentInObject(val, parentKey, keyName, value, currentParentKey) === true) {
                return true;
            }
        }
    }
    return false;
};
export const hasAdvancedOptions = (uischema) => isKeyValuePresentInObject(uischema, 'options', 'isAdvanced', true);

