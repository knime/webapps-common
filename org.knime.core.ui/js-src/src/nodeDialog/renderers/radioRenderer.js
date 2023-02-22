import { rankWith, isOneOfControl } from '@jsonforms/core';
import { priorityRanks, inputFormats } from '@/nodeDialog/constants';
import RadioInput from '@/nodeDialog/UIComponents/RadioInput.vue';

export const radioTester = (uischema, schema) => {
    const isOneOf = isOneOfControl(uischema, schema);
    return isOneOf && uischema.options?.format === inputFormats.oneOfRadio;
};

export const radioRenderer = {
    renderer: RadioInput,
    tester: rankWith(priorityRanks.default, radioTester)
};
