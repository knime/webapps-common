import { rankWith, uiTypeIs } from '@jsonforms/core';
import SectionLayout from '@/nodeDialog/layoutComponents/SectionLayout.vue';
import { priorityRanks } from '@/nodeDialog/constants';

export const sectionLayoutTester = uiTypeIs('Section');

export const sectionLayoutRenderer = {
    renderer: SectionLayout,
    tester: rankWith(priorityRanks.default, sectionLayoutTester)
};
