import { rankWith, isAnyOfControl } from '@jsonforms/core';
import SimpleTwinlistInput from '../uiComponents/SimpleTwinlistInput.vue';
import { priorityRanks, inputFormats } from '../constants';

export const simpleTwinlistTester = (uischema, schema) => {
    const isAnyOf = isAnyOfControl(uischema, schema);
    return isAnyOf && uischema.options?.format === inputFormats.anyOfTwinList;
};

export const simpleTwinlistRenderer = {
    renderer: SimpleTwinlistInput,
    tester: rankWith(priorityRanks.default, simpleTwinlistTester)
};
