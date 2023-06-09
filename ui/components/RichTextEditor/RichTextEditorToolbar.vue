<script setup lang="ts">
import type { Editor } from "@tiptap/vue-3";
import type { EditorTools } from "./types";

interface Props {
  editor: Editor;
  tools: EditorTools;
}

defineProps<Props>();
</script>

<template>
  <div class="tools">
    <div
      v-for="tool of tools"
      :key="tool.id"
      :class="['tool', { active: tool.active ? tool.active() : false }]"
      @click.stop="tool.onClick"
    >
      <Component :is="tool.icon" />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.tools {
  display: flex;
  align-items: center;
  height: 100%;

  & .tool {
    width: 30px;
    height: 30px;

    & svg {
      background: initial !important;
      width: 30px;
      height: 30px;
    }

    &.active,
    &:hover {
      background: var(--knime-masala);

      & svg {
        stroke: var(--knime-white);
      }
    }
  }
}
</style>
