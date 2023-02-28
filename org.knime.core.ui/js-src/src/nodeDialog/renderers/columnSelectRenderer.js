import { rankWith, isOneOfControl } from '@jsonforms/core';
import ColumnSelect from '@/nodeDialog/uiComponents/ColumnSelect.vue';
import { priorityRanks, inputFormats } from '@/nodeDialog/constants';

export const columnSelectTester = (uischema, schema) => {
    const isOneOf = isOneOfControl(uischema, schema);
    return isOneOf && uischema.options?.format === inputFormats.columnSelect;
};

export const columnSelectRenderer = {
    renderer: ColumnSelect,
    tester: rankWith(priorityRanks.default, columnSelectTester)
};
