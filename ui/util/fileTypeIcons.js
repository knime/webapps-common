import csvIcon from '../assets/img/icons/file-csv.svg?inline';
import docxIcon from '../assets/img/icons/file-docx.svg?inline';
import htmlIcon from '../assets/img/icons/file-html.svg?inline';
import mdIcon from '../assets/img/icons/file-md.svg?inline';
import odpIcon from '../assets/img/icons/file-odp.svg?inline';
import odsIcon from '../assets/img/icons/file-ods.svg?inline';
import odtIcon from '../assets/img/icons/file-odt.svg?inline';
import pdfIcon from '../assets/img/icons/file-pdf.svg?inline';
import pptxIcon from '../assets/img/icons/file-pptx.svg?inline';
import psIcon from '../assets/img/icons/file-ps.svg?inline';
import xlsIcon from '../assets/img/icons/file-xls.svg?inline';
import xlsxIcon from '../assets/img/icons/file-xlsx.svg?inline';
import xmlIcon from '../assets/img/icons/file-xml.svg?inline';
import zipIcon from '../assets/img/icons/file-zip.svg?inline';
import exeIcon from '../assets/img/icons/file-zip-exe.svg?inline';
import txtIcon from '../assets/img/icons/file-text.svg?inline';
import fileIcon from '../assets/img/icons/file-question.svg?inline';

const icons = {
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
    fileIcon
};

export default {
    ...icons
};

export const isIconExisting = function (iconName) {
    return icons.hasOwnProperty(iconName);
};
