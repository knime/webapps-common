/**
 * This composable wraps the getScroll and scrollToPosition
 * methods of a RecycleScroller in oder to be able to have a
 * consistent behavior when navigating inside a virtual scroller
 * using the keyboard.
 * It is only possible to use this composable when a constant
 * itemSize is used as a RecycleScroller prop.
 * */

import { computed, ref, type Ref } from "vue";

type RecycleScroller = {
  itemSize: number;
  items: Array<any>;
  getScroll(): { start: number; end: number };
  scrollToItem(index: number): void;
  scrollToPosition(position: number): void;
};

const isRecycleScroller = (element: any): element is RecycleScroller => {
  return (
    typeof element.itemSize === "number" &&
    Array.isArray(element.items) &&
    typeof element.getScroll === "function" &&
    typeof element.scrollToItem === "function" &&
    typeof element.scrollToPosition === "function"
  );
};

export default () => {
  const scroller: Ref<null | any> = ref(null);

  const recycleScroller = computed(() => {
    const element = scroller.value;
    if (element === null) {
      return null;
    }
    if (isRecycleScroller(element)) {
      return element;
    } else {
      // @ts-ignore typescript needs to be configured to allow consola
      consola.error("Invalid RecycleScroller element!");
      throw new Error("Invalid RecycleScroller element!");
    }
  });

  const scrollToItem = (index: number, direction: "up" | "down"): void => {
    if (recycleScroller.value === null) {
      return;
    }
    const { start, end } = recycleScroller.value.getScroll();
    const elementStart = index * recycleScroller.value.itemSize;
    const elementEnd = (index + 1) * recycleScroller.value.itemSize;
    const elementIsOutOfBounds = elementStart < start || elementEnd > end;
    if (elementIsOutOfBounds) {
      if (direction === "down") {
        recycleScroller.value.scrollToPosition(elementEnd - (end - start));
      } else {
        recycleScroller.value.scrollToItem(index);
      }
    }
  };

  return { scrollToItem, scroller };
};
