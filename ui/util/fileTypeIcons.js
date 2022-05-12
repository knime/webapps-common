import csvIcon from '../assets/img/icons/file-csv.svg';
import docxIcon from '../assets/img/icons/file-docx.svg';
import htmlIcon from '../assets/img/icons/file-html.svg';
import mdIcon from '../assets/img/icons/file-md.svg';
import odpIcon from '../assets/img/icons/file-odp.svg';
import odsIcon from '../assets/img/icons/file-ods.svg';
import odtIcon from '../assets/img/icons/file-odt.svg';
import pdfIcon from '../assets/img/icons/file-pdf.svg';
import pptxIcon from '../assets/img/icons/file-pptx.svg';
import psIcon from '../assets/img/icons/file-ps.svg';
import xlsIcon from '../assets/img/icons/file-xls.svg';
import xlsxIcon from '../assets/img/icons/file-xlsx.svg';
import xmlIcon from '../assets/img/icons/file-xml.svg';
import zipIcon from '../assets/img/icons/file-zip.svg';
import exeIcon from '../assets/img/icons/file-zip-exe.svg';
import txtIcon from '../assets/img/icons/file-text.svg';
import fileIcon from '../assets/img/icons/file-question.svg';

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
