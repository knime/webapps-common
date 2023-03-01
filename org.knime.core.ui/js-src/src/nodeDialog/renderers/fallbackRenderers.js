import { rankWith,
    isOneOfControl,
    isNumberControl,
    isBooleanControl,
    isIntegerControl,
    isStringControl,
    isAnyOfControl } from '@jsonforms/core';
import { priorityRanks } from '../constants';
import { numberRenderer } from './numberRenderer';
import { checkboxRenderer } from './checkboxRenderer';
import { simpleDropdownRenderer } from './simpleDropdownRenderer';
import { textRenderer } from './textRenderer';
import { checkTwinlistStructure, twinlistRenderer } from './twinlistRenderer';
import { simpleTwinlistRenderer } from './simpleTwinlistRenderer';
import { integerRenderer } from './integerRenderer';

export const fallbackRenderers = [
    { ...simpleDropdownRenderer, tester: rankWith(priorityRanks.fallback, isOneOfControl) },
    { ...simpleTwinlistRenderer, tester: rankWith(priorityRanks.fallback, isAnyOfControl) },
    { ...twinlistRenderer, tester: rankWith(priorityRanks.fallback, checkTwinlistStructure) },
    { ...numberRenderer, tester: rankWith(priorityRanks.fallback, isNumberControl) },
    { ...checkboxRenderer, tester: rankWith(priorityRanks.fallback, isBooleanControl) },
    { ...integerRenderer, tester: rankWith(priorityRanks.fallback, isIntegerControl) },
    { ...textRenderer, tester: rankWith(priorityRanks.fallback, isStringControl) }
];
