import { uiTypeIs, rankWith, schemaMatches, and } from '@jsonforms/core';
import DropdownInput from '../uiComponents/DropdownInput.vue';
import { priorityRanks, inputFormats } from '../constants';


export const checkDropdownStructure = and(uiTypeIs('Control'), schemaMatches(
    (s) => s.hasOwnProperty('properties') &&
     Object.values(s.properties).some(prop => prop.hasOwnProperty('oneOf'))
));

export const dropdownTester = (uischema, schema) => checkDropdownStructure(uischema, schema) &&
    uischema.options?.format === inputFormats.oneOfDropdown;

export const dropdownRenderer = {
    renderer: DropdownInput,
    tester: rankWith(priorityRanks.default, dropdownTester)
};
