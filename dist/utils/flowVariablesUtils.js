// creates an object which maps the path of each element to their flow variable object
const createFlowVariablesMap = ({ viewVariables = {}, modelVariables = {} } = {}) => {
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
    return Object.assign(Object.assign({}, traverseObject(viewVariables, 'view')), traverseObject(modelVariables, 'model'));
};

export { createFlowVariablesMap };
