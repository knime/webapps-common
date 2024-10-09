import csvIcon from "@knime/styles/img/icons/file-csv.svg";
import docxIcon from "@knime/styles/img/icons/file-docx.svg";
import htmlIcon from "@knime/styles/img/icons/file-html.svg";
import mdIcon from "@knime/styles/img/icons/file-md.svg";
import odpIcon from "@knime/styles/img/icons/file-odp.svg";
import odsIcon from "@knime/styles/img/icons/file-ods.svg";
import odtIcon from "@knime/styles/img/icons/file-odt.svg";
import pdfIcon from "@knime/styles/img/icons/file-pdf.svg";
import pptxIcon from "@knime/styles/img/icons/file-pptx.svg";
import psIcon from "@knime/styles/img/icons/file-ps.svg";
import fileIcon from "@knime/styles/img/icons/file-question.svg";
import txtIcon from "@knime/styles/img/icons/file-text.svg";
import xlsIcon from "@knime/styles/img/icons/file-xls.svg";
import xlsxIcon from "@knime/styles/img/icons/file-xlsx.svg";
import xmlIcon from "@knime/styles/img/icons/file-xml.svg";
import exeIcon from "@knime/styles/img/icons/file-zip-exe.svg";
import zipIcon from "@knime/styles/img/icons/file-zip.svg";

export const icons = {
  csvIcon,
  docxIcon,
  htmlIcon,
  mdIcon,
  odpIcon,
  odsIcon,
  odtIcon,
  pdfIcon,
  pptxIcon,
  psIcon,
  xlsIcon,
  xlsxIcon,
  xmlIcon,
  zipIcon,
  exeIcon,
  txtIcon,
  fileIcon,
};

export const isIconExisting = function (iconName: string): boolean {
  return icons.hasOwnProperty(iconName);
};
