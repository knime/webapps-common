import { controlToRenderer } from "../higherOrderComponents/control/controlToRenderer";
import type { VueControlRenderer } from "../higherOrderComponents/control/types";
import { layoutToRenderer } from "../higherOrderComponents/layout/layoutToRenderer";
import type { VueLayoutRenderer } from "../higherOrderComponents/layout/types";
import type { NamedRenderer } from "../higherOrderComponents/types";

import { checkboxesRenderer } from "./checkboxesRenderer";
import { columnFilterRenderer } from "./columnFilterRenderer";
import { columnSelectRenderer } from "./columnSelectRenderer";
import { comboBoxRenderer } from "./comboBoxRenderer";
import {
  dateTimeFormatPickerRenderer,
  dateTimeFormatPickerWithTypeRenderer,
} from "./dateTimeFormatPickerRenderer";
import { dateTimeRenderer } from "./dateTimeRenderer";
import { dropdownRenderer } from "./dropdownRenderer";
import {
  fallbackControlRenderers,
  fallbackLayoutRenderers,
} from "./fallbackRenderers";
import { horizontalLayoutRenderer } from "./horizontalLayoutRenderer";
import { integerRenderer } from "./integerRenderer";
import { intervalRenderer } from "./intervalRenderer";
import { localDateRenderer } from "./localDateRenderer";
import { localTimeRenderer } from "./localTimeRenderer";
import { nameFilterRenderer } from "./nameFilterRenderer";
import { numberRenderer } from "./numberRenderer";
import { radioRenderer } from "./radioRenderer";
import { richTextRenderer } from "./richTextRenderer";
import { sectionLayoutRenderer } from "./sectionLayoutRenderer";
import { simpleButtonRenderer } from "./simpleButtonRenderer";
import { sortListRenderer } from "./sortListRenderer";
import { textAreaRenderer } from "./textAreaRenderer";
import { textMessageRenderer } from "./textMessageRenderer";
import { simpleTwinlistRenderer, twinlistRenderer } from "./twinlistRenderer";
import { valueSwitchRenderer } from "./valueSwitchRenderer";
import { verticalLayoutRenderer } from "./verticalLayoutRenderer";
import { zonedDateTimeRenderer } from "./zonedDateTimeRenderer";

export const controls = {
  checkboxesRenderer,
  columnFilterRenderer,
  comboBoxRenderer,
  dateTimeRenderer,
  dateTimeFormatPickerRenderer,
  dateTimeFormatPickerWithTypeRenderer,
  integerRenderer,
  intervalRenderer,
  localDateRenderer,
  localTimeRenderer,
  nameFilterRenderer,
  numberRenderer,
  radioRenderer,
  richTextRenderer,
  simpleTwinlistRenderer,
  sortListRenderer,
  textAreaRenderer,
  twinlistRenderer,
  valueSwitchRenderer,
  zonedDateTimeRenderer,
  // without label:
  simpleButtonRenderer,
  textMessageRenderer,
  /**
   * Containing an optional checkbox. Keep Label in control until we have a framework for that.
   */
  dropdownRenderer,
  columnSelectRenderer,
  ...fallbackControlRenderers,
} satisfies Record<string, VueControlRenderer>;

export const layouts = {
  horizontalLayoutRenderer,
  verticalLayoutRenderer,
  sectionLayoutRenderer,
  ...fallbackLayoutRenderers,
} satisfies Record<string, VueLayoutRenderer>;

export const toRenderers = (
  renderers: NamedRenderer[],
  controls: VueControlRenderer[],
  layouts: VueLayoutRenderer[],
): readonly NamedRenderer[] =>
  Object.freeze([
    ...renderers,
    ...controls.map(({ name, tester, control, __asyncSetup }) => ({
      name,
      tester,
      renderer: controlToRenderer(control, __asyncSetup),
    })),
    ...layouts.map(({ name, tester, layout, __asyncSetup }) => ({
      name,
      tester,
      renderer: layoutToRenderer(layout, __asyncSetup),
    })),
  ]);

export const defaultRenderers: readonly NamedRenderer[] = toRenderers(
  [],
  Object.values(controls),
  Object.values(layouts),
);
