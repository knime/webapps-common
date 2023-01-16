import { rankWith, schemaMatches } from '@jsonforms/core';
import TwinlistInput from '@/components/UIComponents/TwinlistInput.vue';
import { priorityRanks } from '@/constants';

export const twinlistTester = schemaMatches(
    (schema) => schema.hasOwnProperty('properties') &&
     Object.values(schema.properties).some(prop => prop.hasOwnProperty('anyOf'))
);


export const twinlistRenderer = {
    renderer: TwinlistInput,
    tester: rankWith(priorityRanks.default, twinlistTester)
};
