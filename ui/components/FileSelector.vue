<script>
import Button from './Button.vue';
import LensIcon from '../assets/img/icons/lens.svg';
import { isEqual } from 'lodash';

export default {
    components: {
        Button,
        LensIcon
    },
    props: {
        label: {
            type: String,
            default: ''
        },
        acceptedFileTypes: {
            type: String,
            default: '*'
        },
        multiple: {
            type: Boolean,
            default: false
        },
        files: {
            type: Array,
            default: null
        }
    },
    data() {
        return {
            internalFiles: null
        };
    },
    computed: {
        displayedFilename() {
            const placeholder = 'No file selected';
            if (!this.internalFiles?.length) {
                return placeholder;
            }
            return this.internalFiles?.map?.(({ name }) => name).join(', ') ?? placeholder;
        },
        fileSelectorId() {
            return `file-selector-${this._uid}`;
        },
        selectFileText() {
            return `Select file${this.multiple ? 's' : ''}`;
        }
    },
    watch: {
        files: {
            handler(newFiles, oldFiles) {
                if (!isEqual(newFiles, oldFiles)) {
                    this.internalFiles = this.files;
                }
            },
            deep: true,
            immediate: true
        }
    },
    methods: {
        openFileSelector() {
            this.$refs.fileSelector.click();
        },
        onSelect(event) {
            this.internalFiles = Array.from(event.target.files);
            this.$emit('input', this.internalFiles);
        }
    }
};
</script>

<template>
  <div class="wrapper">
    <label :for="fileSelectorId">
      <Button
        :compact="true"
        :with-border="true"
        @click="openFileSelector"
      >
        <LensIcon />{{ selectFileText }}
      </Button>
      <span class="filename">{{ displayedFilename }}</span>
    </label>
    <input
      :id="fileSelectorId"
      ref="fileSelector"
      :aria-label="label"
      type="file"
      :accept="acceptedFileTypes"
      :multiple="multiple"
      hidden
      @input="(event) => onSelect(event)"
    >
  </div>
</template>

<style lang="postcss" scoped>
.filename {
  font-size: 13px;
  line-height: 18px;
  font-weight: 500;
  color: var(--knime-dove-gray);
  margin-left: 10px;
}
</style>
