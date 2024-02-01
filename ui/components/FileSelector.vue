<script>
import Button from './Button.vue';
import LensIcon from '../assets/img/icons/lens.svg';

export default {
    components: {
        Button,
        LensIcon
    },
    props: {
        value: {
            type: Array,
            default: null
        },
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
    computed: {
        displayedFilename() {
            return this.value?.map?.(({ name }) => name).join(', ') ||  'No file selected';
        },
        fileSelectorId() {
            return `file-selector-${this._uid}`;
        },
        selectFileText() {
            return `Select file${this.multiple ? 's' : ''}`;
        }
    },
    methods: {
        openFileSelector() {
            this.$refs.fileSelector.click();
        },
        onSelect(event) {
            this.$emit('input', Array.from(event.target.files));
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
