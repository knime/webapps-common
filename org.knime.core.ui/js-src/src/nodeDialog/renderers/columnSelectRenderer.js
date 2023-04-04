import { uiTypeIs, rankWith, schemaMatches, and } from '@jsonforms/core';
import ColumnSelect from '../uiComponents/ColumnSelect.vue';
import { priorityRanks } from '../constants';

export const columnSelectTester = and(uiTypeIs('Control'), schemaMatches(
    (s) => s.hasOwnProperty('properties') &&
    s.properties.hasOwnProperty('selected') && s.properties.selected.hasOwnProperty('oneOf')
));

export const columnSelectRenderer = {
    renderer: ColumnSelect,
    tester: rankWith(priorityRanks.default, columnSelectTester)
};

