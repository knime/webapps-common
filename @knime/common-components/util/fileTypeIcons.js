import csvIcon from '../../icons/icons/file-csv.svg?inline';
import docxIcon from '../../icons/icons/file-docx.svg?inline';
import htmlIcon from '../../icons/icons/file-html.svg?inline';
import mdIcon from '../../icons/icons/file-md.svg?inline';
import odpIcon from '../../icons/icons/file-odp.svg?inline';
import odsIcon from '../../icons/icons/file-ods.svg?inline';
import odtIcon from '../../icons/icons/file-odt.svg?inline';
import pdfIcon from '../../icons/icons/file-pdf.svg?inline';
import pptxIcon from '../../icons/icons/file-pptx.svg?inline';
import psIcon from '../../icons/icons/file-ps.svg?inline';
import xlsIcon from '../../icons/icons/file-xls.svg?inline';
import xlsxIcon from '../../icons/icons/file-xlsx.svg?inline';
import xmlIcon from '../../icons/icons/file-xml.svg?inline';
import zipIcon from '../../icons/icons/file-zip.svg?inline';
import exeIcon from '../../icons/icons/file-zip-exe.svg?inline';
import txtIcon from '../../icons/icons/file-text.svg?inline';
import fileIcon from '../../icons/icons/file-question.svg?inline';

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
    fileIcon
};

export const isIconExisting = function (iconName) {
    return icons.hasOwnProperty(iconName);
};
