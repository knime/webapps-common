import { isControl, rankWith } from '@jsonforms/core';
import ColumnFilter from '../uiComponents/ColumnFilter.vue';
import { priorityRanks, inputFormats } from '../constants';

export const columnFilterTester = (uischema, _schema) => isControl(uischema) &&
    uischema.options?.format === inputFormats.columnFilter;


export const columnFilterRenderer = {
    renderer: ColumnFilter,
    tester: rankWith(priorityRanks.default, columnFilterTester)
};
