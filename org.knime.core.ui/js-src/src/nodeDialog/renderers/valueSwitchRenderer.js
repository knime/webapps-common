import { rankWith, isOneOfControl } from '@jsonforms/core';
import { priorityRanks, inputFormats } from '@/nodeDialog/constants';
import ValueSwitchInput from '@/nodeDialog/UIComponents/ValueSwitchInput.vue';

export const valueSwitchTester = (uischema, schema) => {
    const isOneOf = isOneOfControl(uischema, schema);
    return isOneOf && uischema.options?.format === inputFormats.oneOfValueSwitch;
};

export const valueSwitchRenderer = {
    renderer: ValueSwitchInput,
    tester: rankWith(priorityRanks.default, valueSwitchTester)
};
