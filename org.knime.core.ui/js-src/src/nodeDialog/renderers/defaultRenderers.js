import { arrayLayoutRenderer } from "./arrayLayoutRenderer";
import { horizontalLayoutRenderer } from "./horizontalLayoutRenderer";
import { verticalLayoutRenderer } from "./verticalLayoutRenderer";
import { sectionLayoutRenderer } from "./sectionLayoutRenderer";

import { buttonRenderer } from "./buttonRenderer";
import { simpleButtonRenderer } from "./simpleButtonRenderer";
import { checkboxRenderer } from "./checkboxRenderer";
import { checkboxesRenderer } from "./checkboxesRenderer";
import { columnFilterRenderer } from "./columnFilterRenderer";
import { nameFilterRenderer } from "./nameFilterRenderer";
import { columnSelectRenderer } from "./columnSelectRenderer";
import { comboBoxRenderer } from "./comboBoxRenderer";
import { dateTimeRenderer } from "./dateTimeRenderer";
import { dropdownRenderer } from "./dropdownRenderer";
import { integerRenderer } from "./integerRenderer";
import { numberRenderer } from "./numberRenderer";
import { radioRenderer } from "./radioRenderer";
import { richTextRenderer } from "./richTextRenderer";
import { twinlistRenderer, simpleTwinlistRenderer } from "./twinlistRenderer";
import { sortListRenderer } from "./sortListRenderer";
import { valueSwitchRenderer } from "./valueSwitchRenderer";
import { textAreaRenderer } from "./textAreaRenderer";
import { credentialsRenderer } from "./credentialsRenderer";
import { localFileChooserRenderer } from "./localFileChooserRenderer";
import { fileChooserRenderer } from "./fileChooserRenderer";
import { legacyCredentialsRenderer } from "./legacyCredentialsRenderer";
import { vennDiagramLayoutRenderer } from "./vennDiagramRenderer";
import { dynamicValueRenderer } from "./dynamicValueRenderer";
import { editResetButtonRenderer } from "./editResetButtonRenderer";
import { elementCheckboxRenderer } from "./elementCheckboxRenderer";

export const defaultRenderers = [
  /* layout renderers */
  arrayLayoutRenderer,
  horizontalLayoutRenderer,
  verticalLayoutRenderer,
  sectionLayoutRenderer,
  vennDiagramLayoutRenderer,

  /* component renderers */
  buttonRenderer,
  simpleButtonRenderer,
  checkboxRenderer,
  checkboxesRenderer,
  columnFilterRenderer,
  nameFilterRenderer,
  columnSelectRenderer,
  comboBoxRenderer,
  dateTimeRenderer,
  dropdownRenderer,
  integerRenderer,
  numberRenderer,
  radioRenderer,
  richTextRenderer,
  simpleTwinlistRenderer,
  twinlistRenderer,
  sortListRenderer,
  valueSwitchRenderer,
  textAreaRenderer,
  credentialsRenderer,
  legacyCredentialsRenderer,
  localFileChooserRenderer,
  fileChooserRenderer,
  dynamicValueRenderer,
  /**
   * Internal renderers
   */
  editResetButtonRenderer,
  elementCheckboxRenderer,
];
