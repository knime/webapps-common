import { isControl, rankWith } from '@jsonforms/core';
import DropdownInput from '../uiComponents/DropdownInput.vue';
import { priorityRanks, inputFormats } from '../constants';

export const dropdownTester = (uischema, _schema) => isControl(uischema) &&
    uischema.options?.format === inputFormats.dropDown;

export const dropdownRenderer = {
    renderer: DropdownInput,
    tester: rankWith(priorityRanks.default, dropdownTester)
};
