<script>
import CodeExample from "./demo/CodeExample.vue";
import FileSelector from "webapps-common/ui/components/FileSelector.vue";
import fileSelectorCode from "webapps-common/ui/components/FileSelector.vue?raw";

const codeExample = `<FileSelector
                        accepted-file-types="*"
                        label="Select a file"
                        :multiple="true"
                    />`;

export default {
  components: {
    FileSelector,
    CodeExample,
  },
  data() {
    return {
      codeExample,
      fileSelectorCode,
    };
  },
};
</script>

<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-12">
        <p>
          The file selector allows the user to choose a file or multiple files
          from the file system.
        </p>
        <p>Select multiple files</p>
        <FileSelector
          accepted-file-types="*"
          label="Select a file"
          :multiple="true"
        />
        <p>Select a single file</p>
        <FileSelector
          accepted-file-types="*"
          label="Select a file"
          :multiple="false"
        />
        <CodeExample summary="Show usage example">{{
          codeExample
        }}</CodeExample>
        <CodeExample summary="Show FileSelector.vue source code">{{
          fileSelectorCode
        }}</CodeExample>
      </div>
    </div>
  </section>
</template>
