import { rankWith } from '@jsonforms/core';
import ColumnFilter from '@/nodeDialog/UIComponents/ColumnFilter.vue';
import { priorityRanks, inputFormats } from '@/nodeDialog/constants';
import { checkTwinlistStructure } from './twinlistRenderer';

export const columnFilterTester = (uischema, schema) => checkTwinlistStructure(uischema, schema) &&
    uischema.options?.format === inputFormats.columnFilter;

export const columnFilterRenderer = {
    renderer: ColumnFilter,
    tester: rankWith(priorityRanks.default, columnFilterTester)
};
