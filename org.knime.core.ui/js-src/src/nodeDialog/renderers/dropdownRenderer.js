import { rankWith, isOneOfControl } from '@jsonforms/core';
import SimpleColumnSelect from '../uiComponents/SimpleColumnSelect.vue';
import { priorityRanks, inputFormats } from '../constants';

export const dropdownTester = (uischema, schema) => {
    const isOfControl = isOneOfControl(uischema, schema);
    return isOfControl && uischema.options?.format === inputFormats.oneOfDropdown;
};

export const dropdownRenderer = {
    renderer: SimpleColumnSelect,
    tester: rankWith(priorityRanks.default, dropdownTester)
};
