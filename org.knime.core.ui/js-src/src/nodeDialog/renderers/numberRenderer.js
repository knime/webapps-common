import { rankWith, isNumberControl } from '@jsonforms/core';
import NumberInput from '@/nodeDialog/UIComponents/NumberInput.vue';
import { priorityRanks, inputFormats } from '@/nodeDialog/constants';

export const numberTester = (uischema, schema) => {
    const isNumber = isNumberControl(uischema, schema);
    return isNumber && uischema.options?.format === inputFormats.number;
};

export const numberRenderer = {
    renderer: NumberInput,
    tester: rankWith(priorityRanks.default, numberTester)
};
