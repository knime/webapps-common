<script setup lang="ts">
import { computed } from "vue";
import type { Editor } from "@tiptap/vue-3";
import MoreActionsIcon from "@knime/styles/img/icons/menu-options.svg";
import { FunctionButton, type MenuItem, SubMenu } from "@knime/components";
import type { EditorTools } from "../types";

interface Props {
  editor: Editor;
  tools: EditorTools;
  hotkeyFormatter: (hotkey: Array<string>) => string;
}

const props = defineProps<Props>();

const baseTools = computed(() =>
  props.tools.filter(({ secondary }) => !secondary),
);
const secondaryTools = computed(() =>
  props.tools.filter(({ secondary }) => secondary),
);
const secondaryToolsMenuItems = computed<MenuItem[]>(() =>
  secondaryTools.value.map((tool) => ({
    text: tool.name,
    disabled: tool.disabled?.(),
    hotkeyText: props.hotkeyFormatter(tool.hotkey ?? []),
    icon: tool.icon,
    id: tool.id,
    selected: tool.active?.(),
    children:
      tool.children?.map(({ item, id: childId, active, hotkey }) => ({
        ...item,
        id: { toolId: tool.id, childId },
        selected: active?.(),
        hotkeyText: props.hotkeyFormatter(hotkey ?? []),
      })) ?? [],
  })),
);

const onSecondaryToolClick = (
  _: any,
  { id }: { id: string | { toolId: string; childId: unknown } },
) => {
  const isChildElement = typeof id === "object";
  const toolId = isChildElement ? id.toolId : id;
  const foundTool = secondaryTools.value.find((tool) => tool.id === toolId);
  if (isChildElement) {
    foundTool?.onChildClick?.(id.childId);
  } else {
    foundTool?.onClick?.();
  }
};
</script>

<template>
  <div class="tools">
    <FunctionButton
      v-for="tool of baseTools"
      :key="tool.id"
      class="tool"
      :data-testid="tool.id"
      :disabled="tool.disabled?.()"
      :active="tool.active?.()"
      :title="hotkeyFormatter(tool.hotkey ?? [])"
      compact
      @keydown.enter.prevent="tool.onClick"
      @click.stop="tool.onClick"
    >
      <Component :is="tool.icon" />
    </FunctionButton>
    <SubMenu
      v-if="secondaryTools.length > 0"
      :items="secondaryToolsMenuItems"
      orientation="left"
      @item-click="onSecondaryToolClick"
    >
      <MoreActionsIcon />
    </SubMenu>
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
