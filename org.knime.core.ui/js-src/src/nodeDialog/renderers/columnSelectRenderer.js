import { isControl, rankWith } from '@jsonforms/core';
import ColumnSelect from '../uiComponents/ColumnSelect.vue';
import { inputFormats, priorityRanks } from '../constants';

export const columnSelectTester = (uischema, _schema) => isControl(uischema) &&
    uischema.options?.format === inputFormats.columnSelect;

export const columnSelectRenderer = {
    renderer: ColumnSelect,
    tester: rankWith(priorityRanks.default, columnSelectTester)
};

