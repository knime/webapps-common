<script>
import CodeExample from "./demo/CodeExample.vue";
import { FileLink } from "@knime/components";
// import fileLinkCode from "webapps-common/ui/components/FileLink.vue?raw";
const fileLinkCode = "";

const codeExample = `
<FileLink
  href="https://example.com/file.pdf"
  file-ext="pdf"
  mime-type="application/pdf"
  :size="250"
  text="SomeFile"
/>

<FileLink
  href="https://example.com/x.docx"
  file-ext="docx"
  text="WordFile"
/>

<FileLink
  href="https://example.com/0342as"
  file-ext="bin"
  text="Download Me"
  file-name="firmware.bin"
/>

<FileLink
  href="https://example.com/unkown.file"
  text="Another File"
/>
`;

export default {
  components: {
    FileLink,
    CodeExample,
  },
  data() {
    return {
      fileLinkCode,
      codeExample,
    };
  },
};
</script>

<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-12">
        <p>
          The file link is a regular link with support for file icons and size
          display.
        </p>
        <div>
          <FileLink
            href="https://example.com/file.pdf"
            file-ext="pdf"
            mime-type="application/pdf"
            :size="250"
            text="SomeFile"
          />

          <FileLink
            href="https://example.com/x.docx"
            file-ext="docx"
            text="WordFile"
          />

          <FileLink
            href="https://example.com/0342as"
            file-ext="bin"
            text="Download Me"
            file-name="firmware.bin"
          />

          <FileLink
            href="https://example.com/unkown.file"
            text="Another File"
          />
        </div>

        <CodeExample summary="Show usage example">{{
          codeExample
        }}</CodeExample>
        <CodeExample summary="Show FileLink.vue source code">{{
          fileLinkCode
        }}</CodeExample>
      </div>
    </div>
  </section>
</template>
