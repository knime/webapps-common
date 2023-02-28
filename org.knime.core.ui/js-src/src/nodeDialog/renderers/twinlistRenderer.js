import { uiTypeIs, rankWith, schemaMatches, and } from '@jsonforms/core';
import TwinlistInput from '../uiComponents/TwinlistInput.vue';
import { priorityRanks, inputFormats } from '../constants';

export const checkTwinlistStructure = and(uiTypeIs('Control'), schemaMatches(
    (s) => s.hasOwnProperty('properties') &&
     Object.values(s.properties).some(prop => prop.hasOwnProperty('anyOf'))
));


export const twinlistTester = (uischema, schema) => checkTwinlistStructure(uischema, schema) &&
    uischema.options?.format === inputFormats.anyOfTwinList;


export const twinlistRenderer = {
    renderer: TwinlistInput,
    tester: rankWith(priorityRanks.default, twinlistTester)
};
