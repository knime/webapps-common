import { rankWith, isBooleanControl } from '@jsonforms/core';
import CheckboxInput from '@/nodeDialog/UIComponents/CheckboxInput.vue';
import { priorityRanks, inputFormats } from '@/nodeDialog/constants';

export const checkboxTester = (uischema, schema) => {
    const isBoolean = isBooleanControl(uischema, schema);
    return isBoolean && uischema.options?.format === inputFormats.checkbox;
};

export const checkboxRenderer = {
    renderer: CheckboxInput,
    tester: rankWith(priorityRanks.default, checkboxTester)
};
