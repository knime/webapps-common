import { rankWith, uiTypeIs } from '@jsonforms/core';
import HorizontalLayout from '@/nodeDialog/layoutComponents/HorizontalLayout.vue';
import { priorityRanks } from '@/nodeDialog/constants';

export const horizontalLayoutTester = uiTypeIs('HorizontalLayout');

export const horizontalLayoutRenderer = {
    renderer: HorizontalLayout,
    tester: rankWith(priorityRanks.default, horizontalLayoutTester)
};
