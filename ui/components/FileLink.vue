<script>
import filesize from 'filesize';
// file icons
import fileIcon from '../assets/img/icons/file-question.svg?inline';
// file type icons
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
import txtIcon from '../assets/img/icons/file-text.svg?inline';
import xlsIcon from '../assets/img/icons/file-xls.svg?inline';
import xlsxIcon from '../assets/img/icons/file-xlsx.svg?inline';
import xmlIcon from '../assets/img/icons/file-xml.svg?inline';
import zipIcon from '../assets/img/icons/file-zip.svg?inline';
import exeIcon from '../assets/img/icons/file-zip-exe.svg?inline';


export default {
    components: {
        // eslint-disable-next-line vue/no-unused-components
        csvIcon,
        // eslint-disable-next-line vue/no-unused-components
        docxIcon,
        // eslint-disable-next-line vue/no-unused-components
        htmlIcon,
        // eslint-disable-next-line vue/no-unused-components
        mdIcon,
        // eslint-disable-next-line vue/no-unused-components
        odpIcon,
        // eslint-disable-next-line vue/no-unused-components
        odsIcon,
        // eslint-disable-next-line vue/no-unused-components
        odtIcon,
        // eslint-disable-next-line vue/no-unused-components
        pdfIcon,
        // eslint-disable-next-line vue/no-unused-components
        pptxIcon,
        // eslint-disable-next-line vue/no-unused-components
        psIcon,
        // eslint-disable-next-line vue/no-unused-components
        txtIcon,
        // eslint-disable-next-line vue/no-unused-components
        xlsIcon,
        // eslint-disable-next-line vue/no-unused-components
        xlsxIcon,
        // eslint-disable-next-line vue/no-unused-components
        xmlIcon,
        // eslint-disable-next-line vue/no-unused-components
        zipIcon,
        // eslint-disable-next-line vue/no-unused-components
        exeIcon,
        // eslint-disable-next-line vue/no-unused-components
        fileIcon
    },
    props: {
        /** display text for the download link */
        text: {
            type: String,
            required: true
        },
        href: {
            type: String,
            required: true
        },
        /** extension based file type: exe, txt, zip, docx etc. */
        fileExt: {
            type: String,
            default: ''
        },
        mimeType: {
            type: String,
            default: 'application/octet-stream'
        },
        /** size in kilobytes */
        size: {
            type: Number,
            default: 0
        }
    },
    computed: {
        icon() {
            let candidate = `${this.fileExt}Icon`;
            return this.fileExt && this.$options.components[candidate] ? candidate : 'fileIcon';
        },
        humanFileSizeObject() {
            return filesize.partial({
                output: 'object'
            })(this.size);
        },
        humanFileSizeUnitFull() {
            return filesize.partial({
                output: 'object',
                fullform: true
            })(this.size).symbol;
        },
        hasFileInfo() {
            return this.size || this.fileExt;
        },
        fileInfoText() {
            let infoText = '';
            if (!this.hasFileInfo) {
                return infoText;
            }
            if (this.fileExt) {
                infoText += `${this.fileExt}${this.size ? ', ' : ''}`;
            }
            if (this.size) {
                infoText += this.humanFileSizeObject.value;
            }
            return infoText;
        },
        linkHtmlTitle() {
            let infoText = '';
            if (this.fileExt) {
                infoText += `${this.fileExt}${this.size ? ', ' : ''}`;
            }
            if (this.size) {
                infoText += `${this.humanFileSizeObject.value} ${this.humanFileSizeObject.symbol}`;
            }
            if (infoText) {
                return `${this.text} (${infoText})`;
            }
            return this.text;
        }
    }
};
</script>
<template>
  <figure class="file-link">
    <a
      :href="href"
      download
      :title="linkHtmlTitle"
      :type="mimeType"
    ><Component :is="icon" />{{ text || 'Download File' }}</a>
    <figcaption v-if="hasFileInfo">
      ({{ fileInfoText }}{{ size ? '&nbsp;' : '' }}<abbr
        v-if="size"
        :title="humanFileSizeUnitFull"
      >{{ humanFileSizeObject.symbol }}</abbr>)
    </figcaption>
  </figure>
</template>
<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

.file-link {
  /* figure has browser default margin which is not reset */
  margin: 0;
  display: block;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  & abbr {
    cursor: help;
  }

  & figcaption {
    display: inline-block;
    margin-left: 0.5ch;
  }

  & >>> svg {
    margin-right: 0.8ch;
    vertical-align: middle;
    stroke: var(--theme-text-link-foreground-color);
    width: 18px;
    height: 18px;
    stroke-width: calc(32px / 18);
  }
}
</style>
