import { ref, type Ref } from "vue";

const preventEvent = (event: Event) => {
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
};

export type DropdownNavigationElement = {
  index: number;
  onClick: () => any;
};

export type DropdownNavigationOptions = {
  /**
   * callback for retreiving the next clickable item and an index
   */
  getNextElement(
    current: number | null,
    direction: -1 | 1
  ): DropdownNavigationElement;
  /**
   * callback for retreiving the first clickable item and an index.
   * When provided, navigating to this item via the home key is possible
   */
  getFirstElement?(): DropdownNavigationElement;
  /**
   * callback for retreiving the last clickable item and an index.
   * When provided, navigating to this item via the end key is possible
   */
  getLastElement?(): DropdownNavigationElement;
  /**
   * method called when the dropdown is to be closed
   */
  close(): void;
  /**
   * disables use of Space key to click on item
   */
  disableSpaceToClick?: boolean;
};

type DropdownNavigationOutput = {
  /**
   * current index of the current element. -1 if no element is selected
   */
  currentIndex: Ref<number | null>;
  /**
   * unsets the current element and its index
   */
  resetNavigation: () => void;
  /**
   * callback to be triggered on keydown
   */
  onKeydown: (event: KeyboardEvent) => void;
};

export default ({
  getNextElement,
  getFirstElement,
  getLastElement,
  close,
  disableSpaceToClick,
}: DropdownNavigationOptions): DropdownNavigationOutput => {
  const currentIndex: Ref<number | null> = ref(null);

  const noop = () => {
    // Empty function that doesn't do anything. Used as the default value
    // to initialize or reset the `currentElementClickHandler`
  };

  let currentElementClickHandler: DropdownNavigationElement["onClick"] = noop;

  const resetNavigation = () => {
    currentIndex.value = null;
    currentElementClickHandler = noop;
  };

  const setElement = (item: DropdownNavigationElement) => {
    currentIndex.value = item.index;
    currentElementClickHandler = item.onClick;
  };

  const setNextElement = (step: -1 | 1) => {
    setElement(getNextElement(currentIndex.value, step));
  };

  const resetAndClose = () => {
    resetNavigation();
    close();
  };

  const onKeydown = (event: KeyboardEvent) => {
    switch (event.code) {
      case "ArrowDown":
        preventEvent(event);
        setNextElement(1);
        break;
      case "ArrowUp":
        preventEvent(event);
        setNextElement(-1);
        break;
      case "Enter":
      case "Space": {
        const isEnter = event.code === "Enter";
        const isSpace = event.code === "Space";
        const hasCurrenIndex = currentIndex.value !== null;
        const canClick = isEnter || (isSpace && !disableSpaceToClick);

        if (hasCurrenIndex && canClick) {
          preventEvent(event);
          currentElementClickHandler();
        }
        break;
      }
      case "Home":
        if (getFirstElement) {
          setElement(getFirstElement());
        }
        break;
      case "End":
        if (getLastElement) {
          setElement(getLastElement());
        }
        break;
      case "Escape":
        preventEvent(event);
        resetAndClose();
        break;
      case "Tab":
        resetAndClose();
        break;
    }
  };

  return { onKeydown, currentIndex, resetNavigation };
};
