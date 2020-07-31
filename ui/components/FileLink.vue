<script>
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
        text: {
            type: String,
            required: true
        },
        href: {
            type: String,
            required: true
        },
        fileType: {
            type: String,
            default: null
        },
        /** size in kilobytes */
        size: {
            type: Number,
            default: -1
        }
    },
    computed: {
        icon() {
            return this.fileType ? `${this.fileType}Icon` : 'fileIcon';
        }
    },
    methods: {
        focus() {
            /** This can be called from outside via focus on a $ref */
            this.$el.focus();
        }
    }
};
</script>
<template>
  <figure class="fileLink">
    <a
      :href="href"
      download
    ><!--
      --><Component :is="icon" />{{ text }}<!--
    --></a>
    <figcaption v-if="size > 0 || fileType">
      (<span v-if="fileType">{{ fileType }}</span><span v-if="size > 0">, {{ size }}
        <abbr title="Kilobyte">kb</abbr></span>)
    </figcaption>
  </figure>
</template>
<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

.fileLink {

  & figcaption {
    display: inline-block;
  }

  & >>> svg {
    margin-right: 0.8ch;
    vertical-align: middle;
    stroke: var(--theme-button-function-foreground-color);
    width: 18px;
    height: 18px;
    stroke-width: calc(32px / 18);
  }
}
</style>
