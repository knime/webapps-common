import { describe, expect, it, vi, beforeEach, type Mock } from "vitest";
import getWrappedAroundIndex from "@knime/utils";
import useDropdownNavigation, {
  type DropdownNavigationOptions,
} from "../useDropdownNavigation";

describe("useDropdownNavigation", () => {
  let props: DropdownNavigationOptions, clickSpy: Mock;

  beforeEach(() => {
    clickSpy = vi.fn();
    props = {
      getNextElement: vi.fn((i, j) => {
        let index: number;
        // Indices between 0 and 10.
        if (i === null) {
          if (j === 1) {
            index = 0;
          } else {
            index = 9;
          }
        } else {
          const outOfBoundsIndex = i + j;
          index = getWrappedAroundIndex(outOfBoundsIndex, 10);
        }
        return { index, onClick: () => clickSpy(index) };
      }),
      close: vi.fn(),
    };
  });

  it("sets focused index to null per default", () => {
    const { currentIndex } = useDropdownNavigation(props);
    expect(currentIndex.value).toBeNull();
  });

  describe("keyboard navigation", () => {
    let simulateEventCall: (callback: (event: any) => any, code: string) => any;

    beforeEach(() => {
      simulateEventCall = (callback, code) => {
        const eventMethodsMock = {
          preventDefault: vi.fn(),
          stopPropagation: vi.fn(),
          stopImmediatePropagation: vi.fn(),
        };
        callback({ code, ...eventMethodsMock });
        return eventMethodsMock;
      };
    });

    it("navigates to the next element on ArrowDown", () => {
      const { currentIndex, onKeydown } = useDropdownNavigation(props);
      simulateEventCall(onKeydown, "ArrowDown");
      expect(currentIndex.value).toBe(0);
      simulateEventCall(onKeydown, "ArrowDown");
      expect(currentIndex.value).toBe(1);
    });

    it("navigates to the previous element on ArrowUp", () => {
      const { currentIndex, onKeydown } = useDropdownNavigation(props);
      simulateEventCall(onKeydown, "ArrowUp");
      expect(currentIndex.value).toBe(9);
      simulateEventCall(onKeydown, "ArrowUp");
      expect(currentIndex.value).toBe(8);
    });

    it("navigates to the last element on End", () => {
      const simulatedLastIndex = 10;
      props.getLastElement = vi.fn(() => ({
        index: simulatedLastIndex,
        onClick: () => clickSpy(simulatedLastIndex),
      }));
      const { currentIndex, onKeydown } = useDropdownNavigation(props);
      simulateEventCall(onKeydown, "End");
      expect(currentIndex.value).toBe(simulatedLastIndex);
      simulateEventCall(onKeydown, "Enter");
      expect(clickSpy).toHaveBeenCalledWith(simulatedLastIndex);
    });

    it("navigates to the first element on Home", () => {
      const simulatedFirstIndex = -1;
      props.getFirstElement = vi.fn(() => ({
        index: simulatedFirstIndex,
        onClick: () => clickSpy(simulatedFirstIndex),
      }));
      const { currentIndex, onKeydown } = useDropdownNavigation(props);
      simulateEventCall(onKeydown, "Home");
      expect(currentIndex.value).toBe(simulatedFirstIndex);
      simulateEventCall(onKeydown, "Enter");
      expect(clickSpy).toHaveBeenCalledWith(simulatedFirstIndex);
    });

    it("calls close on Escape", () => {
      const { onKeydown } = useDropdownNavigation(props);
      expect(props.close).not.toHaveBeenCalled();
      simulateEventCall(onKeydown, "Escape");
      expect(props.close).toHaveBeenCalled();
    });

    it("calls close on Tab", () => {
      const { onKeydown } = useDropdownNavigation(props);
      expect(props.close).not.toHaveBeenCalled();
      simulateEventCall(onKeydown, "Tab");
      expect(props.close).toHaveBeenCalled();
    });

    describe("select an item", () => {
      it("clicks on focused element on Enter", () => {
        const { onKeydown } = useDropdownNavigation(props);

        simulateEventCall(onKeydown, "ArrowDown");
        simulateEventCall(onKeydown, "Enter");
        expect(clickSpy).toHaveBeenCalledWith(0);

        simulateEventCall(onKeydown, "ArrowDown");
        simulateEventCall(onKeydown, "Enter");
        expect(clickSpy).toHaveBeenCalledWith(1);
      });

      it("clicks on focused element on Space", () => {
        const { onKeydown } = useDropdownNavigation(props);

        simulateEventCall(onKeydown, "ArrowDown");
        simulateEventCall(onKeydown, "Space");
        expect(clickSpy).toHaveBeenCalledWith(0);

        simulateEventCall(onKeydown, "ArrowDown");
        simulateEventCall(onKeydown, "Space");
        expect(clickSpy).toHaveBeenCalledWith(1);
      });

      it("does not click on Space if the `disableSpaceToClick` option is set to true", () => {
        const { onKeydown } = useDropdownNavigation({
          ...props,
          disableSpaceToClick: true,
        });

        simulateEventCall(onKeydown, "ArrowDown");
        simulateEventCall(onKeydown, "Space");
        expect(clickSpy).not.toHaveBeenCalled();

        // make sure enter still works
        simulateEventCall(onKeydown, "Enter");
        expect(clickSpy).toHaveBeenCalledWith(0);
      });

      it("does not trigger a click if no element is focused", () => {
        const { onKeydown } = useDropdownNavigation(props);

        simulateEventCall(onKeydown, "Enter");
        simulateEventCall(onKeydown, "Space");

        expect(clickSpy).toHaveBeenCalledTimes(0);
      });
    });

    it("returns a method which allows to reset the navigation", () => {
      const { onKeydown, currentIndex, resetNavigation } =
        useDropdownNavigation(props);
      simulateEventCall(onKeydown, "ArrowDown");
      expect(currentIndex.value).toBe(0);

      resetNavigation();

      expect(currentIndex.value).toBeNull();
      simulateEventCall(onKeydown, "Enter");
      expect(clickSpy).toHaveBeenCalledTimes(0);
    });

    describe("prevent events", () => {
      const expectEventPrevented = (eventMethodsMock: any) => {
        expect(eventMethodsMock.preventDefault).toHaveBeenCalled();
        expect(eventMethodsMock.stopPropagation).toHaveBeenCalled();
        expect(eventMethodsMock.stopImmediatePropagation).toHaveBeenCalled();
      };
      const expectEventNotPrevented = (eventMethodsMock: any) => {
        expect(eventMethodsMock.preventDefault).not.toHaveBeenCalled();
        expect(eventMethodsMock.stopPropagation).not.toHaveBeenCalled();
        expect(
          eventMethodsMock.stopImmediatePropagation,
        ).not.toHaveBeenCalled();
      };

      it("prevents ArrowDown", () => {
        const { onKeydown } = useDropdownNavigation(props);
        expectEventPrevented(simulateEventCall(onKeydown, "ArrowDown"));
      });

      it("prevents ArrowUp", () => {
        const { onKeydown } = useDropdownNavigation(props);
        expectEventPrevented(simulateEventCall(onKeydown, "ArrowUp"));
      });

      it("prevents Enter if and only if an item is focused", () => {
        const { onKeydown } = useDropdownNavigation(props);
        expectEventNotPrevented(simulateEventCall(onKeydown, "Enter"));
        simulateEventCall(onKeydown, "ArrowDown");
        expectEventPrevented(simulateEventCall(onKeydown, "Enter"));
      });

      it("prevents Space if and only if an item is focused", () => {
        const { onKeydown } = useDropdownNavigation(props);
        expectEventNotPrevented(simulateEventCall(onKeydown, "Space"));
        simulateEventCall(onKeydown, "ArrowDown");
        expectEventPrevented(simulateEventCall(onKeydown, "Space"));
      });

      it("prevents Escape", () => {
        const { onKeydown } = useDropdownNavigation(props);
        expectEventPrevented(simulateEventCall(onKeydown, "Escape"));
      });

      it("does not prevent Tab", () => {
        const { onKeydown } = useDropdownNavigation(props);
        expectEventNotPrevented(simulateEventCall(onKeydown, "Tab"));
      });
    });
  });
});
