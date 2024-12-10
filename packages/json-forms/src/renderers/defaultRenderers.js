import { arrayLayoutRenderer } from "./arrayLayoutRenderer";
import { buttonRenderer } from "./buttonRenderer";
import { checkboxRenderer } from "./checkboxRenderer";
import { checkboxesRenderer } from "./checkboxesRenderer";
import { columnFilterRenderer } from "./columnFilterRenderer";
import { columnSelectRenderer } from "./columnSelectRenderer";
import { comboBoxRenderer } from "./comboBoxRenderer";
import { credentialsRenderer } from "./credentialsRenderer";
import { dateTimeRenderer } from "./dateTimeRenderer";
import { dropdownRenderer } from "./dropdownRenderer";
import { dynamicValueRenderer } from "./dynamicValueRenderer";
import { editResetButtonRenderer } from "./editResetButtonRenderer";
import { elementCheckboxRenderer } from "./elementCheckboxRenderer";
import { fileChooserRenderer } from "./fileChooserRenderer";
import { horizontalLayoutRenderer } from "./horizontalLayoutRenderer";
import { integerRenderer } from "./integerRenderer";
import { intervalRenderer } from "./intervalRenderer";
import { legacyCredentialsRenderer } from "./legacyCredentialsRenderer";
import { localDateRenderer } from "./localDateRenderer";
import { localFileChooserRenderer } from "./localFileChooserRenderer";
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
import { vennDiagramLayoutRenderer } from "./vennDiagramRenderer";
import { verticalLayoutRenderer } from "./verticalLayoutRenderer";

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
  localDateRenderer,
  localTimeRenderer,
  dateTimeRenderer,
  dropdownRenderer,
  integerRenderer,
  intervalRenderer,
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
  textMessageRenderer,
  /**
   * Internal synchronous renderers
   */
  editResetButtonRenderer,
  elementCheckboxRenderer,
];
