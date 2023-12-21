<script>
import CodeExample from "./demo/CodeExample.vue";
import FileSelector from "../../ui/components/FileSelector.vue";
import code from "!!raw-loader!../../ui/components/FileSelector";

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
  computed: {
    codeExample() {
      return codeExample;
    },
    code() {
      return code;
    },
  },
};
</script>

<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-12">
        <h2>FileSelector</h2>
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
        <p>Select single files</p>
        <FileSelector
          accepted-file-types="*"
          label="Select a file"
          :multiple="false"
        />
        <CodeExample summary="Show usage example">{{
          codeExample
        }}</CodeExample>
        <CodeExample summary="Show FileSelector.vue source code">{{
          code
        }}</CodeExample>
      </div>
    </div>
  </section>
</template>
