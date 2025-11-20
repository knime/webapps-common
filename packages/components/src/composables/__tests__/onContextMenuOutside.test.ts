import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import { unrefElement, useEventListener } from "@vueuse/core";

import onContextMenuOutside from "../onContextMenuOutside";

vi.mock("@vueuse/core", () => ({
  useEventListener: vi.fn(),
  unrefElement: vi.fn(),
}));

describe("onContextMenuOutside", () => {
  let mockHandler: ReturnType<typeof vi.fn>;
  let mockUseEventListener: ReturnType<typeof vi.fn>;
  let mockUnrefElement: ReturnType<typeof vi.fn>;
  let capturedEventHandler: ((event: MouseEvent) => void) | undefined;

  beforeEach(() => {
    mockUseEventListener = useEventListener as ReturnType<typeof vi.fn>;
    mockUnrefElement = unrefElement as ReturnType<typeof vi.fn>;

    mockHandler = vi.fn();
    capturedEventHandler = undefined;

    mockUseEventListener.mockImplementation((_, handler) => {
      capturedEventHandler = handler as (event: MouseEvent) => void;
    });

    vi.clearAllMocks();
  });

  it("should set up contextmenu event listener", () => {
    const targetElement = document.createElement("div");
    const targetRef = ref(targetElement);

    onContextMenuOutside(targetRef, mockHandler as (event: MouseEvent) => void);

    expect(mockUseEventListener).toHaveBeenCalledWith(
      "contextmenu",
      expect.any(Function),
    );
  });

  it("should call handler when contextmenu event occurs outside target element", () => {
    const targetElement = document.createElement("div");
    const outsideElement = document.createElement("div");
    const targetRef = ref(targetElement);

    mockUnrefElement.mockReturnValue(targetElement);

    targetElement.contains = vi.fn().mockReturnValue(false);

    onContextMenuOutside(targetRef, mockHandler as (event: MouseEvent) => void);

    const mockEvent = new MouseEvent("contextmenu", { bubbles: true });
    Object.defineProperty(mockEvent, "target", {
      value: outsideElement,
    });
    capturedEventHandler?.(mockEvent);

    expect(mockUnrefElement).toHaveBeenCalledWith(targetRef);
    expect(targetElement.contains).toHaveBeenCalledWith(outsideElement);
    expect(mockHandler).toHaveBeenCalledWith(mockEvent);
  });

  it("should not call handler when contextmenu event occurs inside target element", () => {
    const targetElement = document.createElement("div");
    const insideElement = document.createElement("div");
    const targetRef = ref(targetElement);

    mockUnrefElement.mockReturnValue(targetElement);

    targetElement.contains = vi.fn().mockReturnValue(true);

    onContextMenuOutside(targetRef, mockHandler as (event: MouseEvent) => void);

    const mockEvent = new MouseEvent("contextmenu", { bubbles: true });
    Object.defineProperty(mockEvent, "target", { value: insideElement });

    capturedEventHandler?.(mockEvent);

    expect(mockUnrefElement).toHaveBeenCalledWith(targetRef);
    expect(targetElement.contains).toHaveBeenCalledWith(insideElement);
    expect(mockHandler).not.toHaveBeenCalled();
  });

  it("should not call handler when target element is null", () => {
    const targetRef = ref(null);

    mockUnrefElement.mockReturnValue(null);

    onContextMenuOutside(targetRef, mockHandler as (event: MouseEvent) => void);

    const mockEvent = new MouseEvent("contextmenu", { bubbles: true });
    Object.defineProperty(mockEvent, "target", {
      value: document.createElement("div"),
    });

    capturedEventHandler?.(mockEvent);

    expect(mockUnrefElement).toHaveBeenCalledWith(targetRef);
    expect(mockHandler).not.toHaveBeenCalled();
  });

  it("should not call handler when target element is undefined", () => {
    const targetRef = ref(undefined);

    mockUnrefElement.mockReturnValue(undefined);

    onContextMenuOutside(targetRef, mockHandler as (event: MouseEvent) => void);

    const mockEvent = new MouseEvent("contextmenu", { bubbles: true });
    Object.defineProperty(mockEvent, "target", {
      value: document.createElement("div"),
    });

    capturedEventHandler?.(mockEvent);

    expect(mockUnrefElement).toHaveBeenCalledWith(targetRef);
    expect(mockHandler).not.toHaveBeenCalled();
  });

  it("should handle different MaybeElementRef types", () => {
    const targetElement = document.createElement("div");

    mockUnrefElement.mockReturnValue(targetElement);
    targetElement.contains = vi.fn().mockReturnValue(false);

    onContextMenuOutside(
      targetElement,
      mockHandler as (event: MouseEvent) => void,
    );

    const mockEvent = new MouseEvent("contextmenu", { bubbles: true });
    Object.defineProperty(mockEvent, "target", {
      value: document.createElement("div"),
    });

    capturedEventHandler?.(mockEvent);

    expect(mockUnrefElement).toHaveBeenCalledWith(targetElement);
    expect(mockHandler).toHaveBeenCalledWith(mockEvent);
  });

  describe("event target handling", () => {
    it("should handle event target as HTMLElement", () => {
      const targetElement = document.createElement("div");
      const eventTarget = document.createElement("span");
      const targetRef = ref(targetElement);

      mockUnrefElement.mockReturnValue(targetElement);
      targetElement.contains = vi.fn().mockReturnValue(false);

      onContextMenuOutside(
        targetRef,
        mockHandler as (event: MouseEvent) => void,
      );

      const mockEvent = new MouseEvent("contextmenu", { bubbles: true });
      Object.defineProperty(mockEvent, "target", { value: eventTarget });

      capturedEventHandler?.(mockEvent);

      expect(targetElement.contains).toHaveBeenCalledWith(eventTarget);
      expect(mockHandler).toHaveBeenCalledWith(mockEvent);
    });

    it("should handle nested elements correctly", () => {
      const targetElement = document.createElement("div");
      const childElement = document.createElement("span");
      const nestedElement = document.createElement("p");

      targetElement.appendChild(childElement);
      childElement.appendChild(nestedElement);

      const targetRef = ref(targetElement);

      mockUnrefElement.mockReturnValue(targetElement);
      targetElement.contains = vi.fn().mockReturnValue(true);

      onContextMenuOutside(
        targetRef,
        mockHandler as (event: MouseEvent) => void,
      );

      const mockEvent = new MouseEvent("contextmenu", { bubbles: true });
      Object.defineProperty(mockEvent, "target", { value: nestedElement });

      capturedEventHandler?.(mockEvent);

      expect(targetElement.contains).toHaveBeenCalledWith(nestedElement);
      expect(mockHandler).not.toHaveBeenCalled();
    });
  });

  describe("integration scenarios", () => {
    it("should work correctly when element is found but click is outside", () => {
      const container = document.createElement("div");
      const targetElement = document.createElement("div");
      const outsideElement = document.createElement("div");

      container.appendChild(targetElement);
      container.appendChild(outsideElement);

      const targetRef = ref(targetElement);

      mockUnrefElement.mockReturnValue(targetElement);

      onContextMenuOutside(
        targetRef,
        mockHandler as (event: MouseEvent) => void,
      );

      const mockEvent = new MouseEvent("contextmenu", { bubbles: true });
      Object.defineProperty(mockEvent, "target", { value: outsideElement });

      capturedEventHandler?.(mockEvent);

      expect(mockHandler).toHaveBeenCalledWith(mockEvent);
    });

    it("should work correctly when element is found and click is inside", () => {
      const container = document.createElement("div");
      const targetElement = document.createElement("div");
      const childElement = document.createElement("span");

      container.appendChild(targetElement);
      targetElement.appendChild(childElement);

      const targetRef = ref(targetElement);

      mockUnrefElement.mockReturnValue(targetElement);

      onContextMenuOutside(
        targetRef,
        mockHandler as (event: MouseEvent) => void,
      );

      const mockEvent = new MouseEvent("contextmenu", { bubbles: true });
      Object.defineProperty(mockEvent, "target", { value: childElement });

      capturedEventHandler?.(mockEvent);

      expect(mockHandler).not.toHaveBeenCalled();
    });
  });
});
