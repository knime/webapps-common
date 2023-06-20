import { rankWith } from '@jsonforms/core';
import { priorityRanks, inputFormats } from '../constants';
import ButtonInput from '../uiComponents/ButtonInput.vue';

export const buttonTester = (uischema, _schema) => uischema.options?.format === inputFormats.button;

export const buttonRenderer = {
    renderer: ButtonInput,
    tester: rankWith(priorityRanks.default, buttonTester)
};
