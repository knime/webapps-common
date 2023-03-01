import { rankWith } from '@jsonforms/core';
import ColumnSelect from '../uiComponents/ColumnSelect.vue';
import { priorityRanks, inputFormats } from '../constants';
import { checkDropdownStructure } from './dropdownRenderer';

export const columnSelectTester = (uischema, schema) => checkDropdownStructure(uischema, schema) &&
    uischema.options?.format === inputFormats.columnSelect;

export const columnSelectRenderer = {
    renderer: ColumnSelect,
    tester: rankWith(priorityRanks.default, columnSelectTester)
};

