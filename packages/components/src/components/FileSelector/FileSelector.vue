<script>
import { getCurrentInstance } from "vue";

import LensIcon from "@knime/styles/img/icons/lens.svg";

import Button from "../Buttons/Button.vue";

export default {
  name: "FileSelector",
  components: {
    Button,
    LensIcon,
  },
  props: {
    modelValue: {
      type: Array,
      default: null,
    },
    label: {
      type: String,
      default: "",
    },
    acceptedFileTypes: {
      type: String,
      default: "*",
    },
    multiple: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
  computed: {
    displayedFilename() {
      return (
        this.modelValue?.map?.(({ name }) => name).join(", ") ||
        "No file selected"
      );
    },
    fileSelectorId() {
      const uid = getCurrentInstance().uid;
      return `file-selector-${uid}`;
    },
    selectFileText() {
      return `Select file${this.multiple ? "s" : ""}`;
    },
  },
  methods: {
    openFileSelector() {
      this.$refs.fileSelector.click();
    },
    onSelect(event) {
      this.$emit("update:modelValue", Array.from(event.target.files));
    },
  },
};
</script>

<template>
  <div class="wrapper">
    <label :for="fileSelectorId">
      <Button :compact="true" :with-border="true" @click="openFileSelector">
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
    />
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
