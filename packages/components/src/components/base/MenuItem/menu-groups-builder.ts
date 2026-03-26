import type { MenuItem } from "./MenuItems.vue";

/**
 * Helper that enables easily creating separators between different menu item groups
 */
export const menuGroupsBuilder = function <TItem extends MenuItem>(
  opts: { removeDisabledItems?: boolean } = { removeDisabledItems: true },
) {
  let currItems: TItem[] = [];

  const isEnabled = (item: TItem) => !item.disabled;

  const removeInvalidItems = (items: TItem[]): TItem[] => {
    return (
      items
        .filter((item) => (opts.removeDisabledItems ? isEnabled(item) : true))
        .map((item) =>
          item.children
            ? {
                ...item,
                children: removeInvalidItems(item.children as TItem[]),
              }
            : item,
        )
        // also remove items whose children were all filtered out
        .filter((item) => (item.children ? item.children.length > 0 : true))
    );
  };

  return {
    append(groupItems: TItem[]) {
      const newItems = removeInvalidItems(groupItems);

      if (currItems.length !== 0 && newItems.length > 0) {
        // add separator to last item of previous group
        currItems.at(-1)!.separator = true;
      }

      currItems = currItems.concat(newItems);

      return this;
    },

    build: () => currItems,
  };
};
