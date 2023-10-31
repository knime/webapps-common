import { arrayLayoutRenderer } from "./arrayLayoutRenderer";
import { horizontalLayoutRenderer } from "./horizontalLayoutRenderer";
import { sectionLayoutRenderer } from "./sectionLayoutRenderer";

import { buttonRenderer } from "./buttonRenderer";
import { checkboxRenderer } from "./checkboxRenderer";
import { checkboxesRenderer } from "./checkboxesRenderer";
import { columnFilterRenderer } from "./columnFilterRenderer";
import { columnSelectRenderer } from "./columnSelectRenderer";
import { comboBoxRenderer } from "./comboBoxRenderer";
import { dateTimeRenderer } from "./dateTimeRenderer";
import { dropdownRenderer } from "./dropdownRenderer";
import { integerRenderer } from "./integerRenderer";
import { numberRenderer } from "./numberRenderer";
import { radioRenderer } from "./radioRenderer";
import { richTextInputRenderer } from "./richTextInputRenderer";
import { twinlistRenderer, simpleTwinlistRenderer } from "./twinlistRenderer";
import { valueSwitchRenderer } from "./valueSwitchRenderer";
import { textAreaRenderer } from "./textAreaRenderer";
import { credentialsRenderer } from "./credentialsRenderer";
import { fileChooserRenderer } from "./fileChooserRenderer";

export const defaultRenderers = [
  /* layout renderers */
  arrayLayoutRenderer,
  horizontalLayoutRenderer,
  sectionLayoutRenderer,

  /* component renderers */
  buttonRenderer,
  checkboxRenderer,
  checkboxesRenderer,
  columnFilterRenderer,
  columnSelectRenderer,
  comboBoxRenderer,
  dateTimeRenderer,
  dropdownRenderer,
  integerRenderer,
  numberRenderer,
  radioRenderer,
  richTextInputRenderer,
  simpleTwinlistRenderer,
  twinlistRenderer,
  valueSwitchRenderer,
  textAreaRenderer,
  credentialsRenderer,
  fileChooserRenderer,
];
