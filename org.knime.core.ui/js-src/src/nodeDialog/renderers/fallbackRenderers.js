import { rankWith,
    isNumberControl,
    isBooleanControl,
    isIntegerControl,
    isStringControl,
    isOneOfControl,
    isAnyOfControl } from '@jsonforms/core';
import { priorityRanks } from '../constants';
import { numberRenderer } from './numberRenderer';
import { checkboxRenderer } from './checkboxRenderer';
import { integerRenderer } from './integerRenderer';
import OneOfDropdown from '../uiComponents/OneOfDropdown.vue';
import AnyOfTwinlist from '../uiComponents/AnyOfTwinlist.vue';
import { textRenderer } from './textRenderer';


export const fallbackRenderers = [
    { renderer: OneOfDropdown, tester: rankWith(priorityRanks.fallback, isOneOfControl) },
    { renderer: AnyOfTwinlist, tester: rankWith(priorityRanks.fallback, isAnyOfControl) },
    { ...numberRenderer, tester: rankWith(priorityRanks.fallback, isNumberControl) },
    { ...checkboxRenderer, tester: rankWith(priorityRanks.fallback, isBooleanControl) },
    { ...integerRenderer, tester: rankWith(priorityRanks.fallback, isIntegerControl) },
    { ...textRenderer, tester: rankWith(priorityRanks.fallback, isStringControl) }
];
