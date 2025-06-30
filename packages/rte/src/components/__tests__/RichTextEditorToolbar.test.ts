import { describe, expect, it, vi } from "vitest";
import { shallowMount } from "@vue/test-utils";

import { type MenuItem, SubMenu } from "@knime/components";
import BoldIcon from "@knime/styles/img/icons/bold.svg";

import type { EditorToolItem } from "../../types";
import RichTextEditorToolbar from "../RichTextEditorToolbar.vue";

describe("RichTextEditorToolbar.vue", () => {
  it("displays secondary tools", () => {
    const toolName = "Tool name";
    const toolId = "toolId";
    const toolWithChildren: EditorToolItem<string | number> = {
      id: toolId,
      icon: BoldIcon,
      name: toolName,
      secondary: true,
      onChildClick: vi.fn(),
      children: [
        {
          item: {
            text: "Option 1",
          },
          id: 1,
          active: () => true,
        },
        {
          item: {
            text: "Option 2",
          },
          id: 2,
          active: () => false,
        },
      ],
    };

    const wrapper = shallowMount(RichTextEditorToolbar as any, {
      props: {
        tools: [toolWithChildren],
        editor: {},
        hotkeyFormatter: () => {},
      },
    });
    const secondaryItemsMenu = wrapper.findComponent(SubMenu);
    const secondaryItem = (secondaryItemsMenu.props().items as MenuItem[]).find(
      ({ text }) => text === toolName,
    );
    expect(secondaryItem).toBeDefined();

    expect(
      secondaryItem?.children?.map((child) => (child as any).id.childId),
    ).toStrictEqual([1, 2]);

    const clickedChildId = 2;
    secondaryItemsMenu.vm.$emit(
      "item-click",
      {},
      { id: { toolId, childId: clickedChildId } },
    );
    expect(toolWithChildren.onChildClick).toHaveBeenCalledWith(clickedChildId);
  });
});
