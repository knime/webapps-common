<script>
import { partial } from "filesize";

import { icons } from "@knime/utils";

export default {
  name: "FileLink",
  components: {
    ...icons,
  },
  props: {
    /** display text for the download link */
    text: {
      type: String,
      required: true,
    },
    href: {
      type: String,
      required: true,
    },
    /** extension based file type: exe, txt, zip, docx etc. */
    fileExt: {
      type: String,
      default: "",
    },
    mimeType: {
      type: String,
      default: "application/octet-stream",
    },
    /** size in kilobytes */
    size: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    icon() {
      const candidate = `${this.fileExt}Icon`;
      return this.fileExt && this.$options.components[candidate]
        ? candidate
        : "fileIcon";
    },
    humanFileSizeObject() {
      return partial({
        output: "object",
        standard: "jedec",
        base: 2,
      })(this.size);
    },
    humanFileSizeUnitFull() {
      return partial({
        output: "object",
        standard: "jedec",
        base: 2,
        fullform: true,
      })(this.size).symbol;
    },
    hasFileInfo() {
      return this.size || this.fileExt;
    },
    fileInfoText() {
      let infoText = "";
      if (!this.hasFileInfo) {
        return infoText;
      }
      if (this.fileExt) {
        infoText += this.fileExt;
      }
      if (this.size) {
        infoText += `, ${this.humanFileSizeObject.value} `;
      }
      return infoText;
    },
    linkHtmlTitle() {
      let titleText = this.text;
      if (this.fileInfoText) {
        titleText += ` (${this.fileInfoText}${
          this.size ? this.humanFileSizeObject.symbol : ""
        })`;
      }
      return titleText;
    },
  },
};
</script>

<template>
  <figure class="file-link">
    <a :href="href" download :title="linkHtmlTitle" :type="mimeType"
      ><Component :is="icon" />{{ text || "Download File" }}</a
    >
    <figcaption v-if="hasFileInfo">
      ({{ fileInfoText
      }}<abbr v-if="size" :title="humanFileSizeUnitFull">{{
        humanFileSizeObject.symbol
      }}</abbr
      >)
    </figcaption>
  </figure>
</template>

<style lang="postcss" scoped>
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

  & :deep(svg) {
    margin-right: 0.8ch;
    vertical-align: middle;
    stroke: var(--theme-text-link-foreground-color);
    width: 18px;
    height: 18px;
    stroke-width: calc(32px / 18);
  }

  & a {
    background: var(--theme-text-link-background-color);
    color: var(--theme-text-link-foreground-color);

    &:hover {
      background: var(--theme-text-link-background-color-hover);
      color: var(--theme-text-link-foreground-color-hover);

      & :deep(svg) {
        stroke: var(--theme-text-link-foreground-color-hover);

        /* text on file icons use fill in path with class text */
        & path.text {
          fill: var(--theme-text-link-foreground-color-hover);
        }
      }
    }

    &:focus {
      background: var(--theme-text-link-background-color-focus);
      color: var(--theme-text-link-foreground-color-focus);

      & :deep(svg) {
        stroke: var(--theme-text-link-foreground-color-focus);

        /* text on file icons use fill in path with class text */
        & path.text {
          fill: var(--theme-text-link-foreground-color-focus);
        }
      }
    }
  }
}
</style>
