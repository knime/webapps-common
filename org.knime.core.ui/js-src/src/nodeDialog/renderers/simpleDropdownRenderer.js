import { rankWith, isOneOfControl } from '@jsonforms/core';
import SimpleDropdownInput from '../uiComponents/SimpleDropdownInput.vue';
import { priorityRanks, inputFormats } from '../constants';

export const simpleDropdownTester = (uischema, schema) => {
    const isOfControl = isOneOfControl(uischema, schema);
    return isOfControl && uischema.options?.format === inputFormats.oneOfDropdown;
};

export const simpleDropdownRenderer = {
    renderer: SimpleDropdownInput,
    tester: rankWith(priorityRanks.default, simpleDropdownTester)
};
