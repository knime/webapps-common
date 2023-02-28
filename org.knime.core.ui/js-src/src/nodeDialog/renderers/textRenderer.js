import { rankWith, isStringControl } from '@jsonforms/core';
import { priorityRanks } from '@/nodeDialog/constants';
import TextInput from '@/nodeDialog/uiComponents/TextInput.vue';

export const textTester = isStringControl;

export const textRenderer = {
    renderer: TextInput,
    tester: rankWith(priorityRanks.default, textTester)
};
