import { type Ref, computed } from "vue";

export default (paddingTopBottom: Ref<number>) =>
  computed(() => ({
    "--knime-cell-padding-top": `${paddingTopBottom.value}px`,
    "--knime-cell-padding-bottom": `${paddingTopBottom.value}px`,
  }));
