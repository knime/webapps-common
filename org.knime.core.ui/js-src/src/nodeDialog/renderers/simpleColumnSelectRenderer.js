import { rankWith, isOneOfControl } from '@jsonforms/core';
import SimpleColumnSelect from '../uiComponents/SimpleColumnSelect.vue';
import { priorityRanks, inputFormats } from '../constants';

export const simpleColumnSelectTester = (uischema, schema) => {
    const isOfControl = isOneOfControl(uischema, schema);
    return isOfControl && uischema.options?.format === inputFormats.columnSelect;
};

export const simpleColumnSelectRenderer = {
    renderer: SimpleColumnSelect,
    tester: rankWith(priorityRanks.default, simpleColumnSelectTester)
};
