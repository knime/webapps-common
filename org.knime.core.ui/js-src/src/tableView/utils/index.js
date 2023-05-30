import { filterComponents } from '@knime/knime-ui-table';

export const createDefaultFilterConfig = (isMultiselect, possibleValues) => {
    const component = isMultiselect ? filterComponents.Multiselect : filterComponents.InputField;
    return {
        is: component.is,
        ...isMultiselect && { possibleValues },
        modelValue: component.getInitialValue()
    };
};

export const arrayEquals = (a, b) => a.length === b.length && a.every((val, index) => val === b[index]);

export const isImage = contentType => contentType === 'img_path';

export const isHtml = contentType => contentType === 'html';

