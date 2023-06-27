<script setup lang="ts">
import type { Editor } from "@tiptap/vue-3";

import FunctionButton from "../FunctionButton.vue";
import type { EditorTools } from "./types";

interface Props {
  editor: Editor;
  tools: EditorTools;
  hotkeyFormatter: (hotkey: Array<string>) => string;
}

defineProps<Props>();
</script>

<template>
  <div class="tools">
    <FunctionButton
      v-for="tool of tools"
      :key="tool.id"
      class="tool"
      :disabled="tool.disabled?.()"
      :active="tool.active?.()"
      :title="hotkeyFormatter(tool.hotkey)"
      compact
      @click.stop="tool.onClick"
    >
      <Component :is="tool.icon" />
    </FunctionButton>
  </div>
</template>

<style lang="postcss" scoped>
.tools {
  --item-size: 32;

  display: flex;
  align-items: center;
  height: 100%;
  gap: 4px;

  & .tool {
    padding: 0;
    width: calc(var(--item-size) * 1px);
    height: calc(var(--item-size) * 1px);
    justify-content: center;
    align-items: center;

    & svg {
      background: initial !important;
      width: calc(calc(var(--item-size) - 14) * 1px);
      height: calc(calc(var(--item-size) - 14) * 1px);
    }
  }
}
</style>
