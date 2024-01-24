<script>
import CodeExample from './demo/CodeExample.vue';
import FileSelector from '../../ui/components/FileSelector.vue';
import code from '!!raw-loader!../../ui/components/FileSelector';
import Dropdown from "webapps-common/ui/components/forms/Dropdown.vue";

const codeExample = `<FileSelector
  accepted-file-types="*"
  label="Select a file"
  :multiple="true"
/>`;

export default {
    components: {
        FileSelector,
        CodeExample,
        Dropdown,
    },
    data() {
      return {
        acceptedFileTypes: "*",
      }
    },
    computed: {
        codeExample() {
            return codeExample;
        },
        code() {
            return code;
        }
    }
};
</script>

<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-12">
        <h2>FileSelector</h2>
        <p>
          The file selector allows the user to choose a file or multiple files
          from the file system. Accepted file types can be set via the
          <code>"accepted-file-types"</code> property.
        </p>
        <div class="grid-container selector-container">
          <div class="grid-item-6">
            <p>Select a single file</p>
            <FileSelector
              :accepted-file-types="acceptedFileTypes"
              label="Select a file"
              :multiple="false"
            />
          </div>
          <div class="grid-item-3">
            <p>Example of accepted file types</p>
            <Dropdown
              v-model="acceptedFileTypes"
              aria-label="Accepted file types"
              :possible-values="[
                {
                  id: '*',
                  text: '*',
                },
                {
                  id: 'text/plain',
                  text: 'text/plain',
                },
                {
                  id: 'image/png',
                  text: 'image/png',
                },
                {
                  id: 'video/*',
                  text: 'video/*',
                },
                {
                  id: '.pdf',
                  text: '.pdf',
                },
              ]"
            />
          </div>
        </div>
        <div class="selector-container">
          <p>Select multiple files</p>
          <FileSelector
            accepted-file-types="*"
            label="Select files"
            :multiple="true"
          />
        </div>
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
<style lang="postcss" scoped>
.grid-container {
  justify-content: start;
}

.selector-container {
  margin-bottom: 30px;
}
</style>


