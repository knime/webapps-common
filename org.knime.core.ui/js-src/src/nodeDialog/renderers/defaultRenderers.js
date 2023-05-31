import { sectionLayoutRenderer } from './sectionLayoutRenderer';
import { checkboxRenderer } from './checkboxRenderer';
import { dropdownRenderer } from './dropdownRenderer';
import { numberRenderer } from './numberRenderer';
import { radioRenderer } from './radioRenderer';
import { textRenderer } from './textRenderer';
import { twinlistRenderer, simpleTwinlistRenderer } from './twinlistRenderer';
import { columnFilterRenderer } from './columnFilterRenderer';
import { columnSelectRenderer } from './columnSelectRenderer';
import { integerRenderer } from './integerRenderer';
import { arrayLayoutRenderer } from './arrayLayoutRenderer';
import { horizontalLayoutRenderer } from './horizontalLayoutRenderer';
import { valueSwitchRenderer } from './valueSwitchRenderer';

export const defaultRenderers = [
    sectionLayoutRenderer,
    checkboxRenderer,
    dropdownRenderer,
    simpleTwinlistRenderer,
    numberRenderer,
    radioRenderer,
    textRenderer,
    twinlistRenderer,
    columnFilterRenderer,
    columnSelectRenderer,
    integerRenderer,
    arrayLayoutRenderer,
    horizontalLayoutRenderer,
    valueSwitchRenderer
];

