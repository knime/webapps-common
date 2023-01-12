export const optionsMapper = ({ const: id, title: text }) => ({ id, text });

export const isModelSettingAndHasNodeView = (control) => control?.rootSchema?.hasNodeView &&
    control?.uischema?.scope?.startsWith('#/properties/model');

// creates an object which maps the path of each element to their flow variable object
export const createFlowVariablesMap = ({ viewVariables, modelVariables } = {}) => {
    const traverseObject = (variables, currentPath, initialValue = {}) => {
        if (!variables) {
            return {};
        }

        return Object.entries(variables).reduce((acc, [key, value]) => {
            if (value.leaf) {
                acc[currentPath ? `${currentPath}.${key}` : key] = value;
                return acc;
            }

            // TODO: Remove key === 'value' check when it's removed from backend implementation.
            return traverseObject(value, `${currentPath}${key === 'value' ? '' : `.${key}`}`, acc);
        }, initialValue);
    };

    return { ...traverseObject(viewVariables, 'view'),
        ...traverseObject(modelVariables, 'model') };
};

// expects a modified root schema which includes a flowVariablesMap
// the root schema should look like the following:
// rootSchema: {
//    flowVariablesMap: {},
//    schema: {},
//    uischema: {},
//    ...
// }
export const getFlowVariablesMap = ({ rootSchema, path }) => rootSchema?.flowVariablesMap
    ? rootSchema.flowVariablesMap[path]
    : null;

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

