import { shallowMount } from "@vue/test-utils";
import { describe, expect, it, vi, afterEach, beforeEach } from "vitest";

import ToastStack from "../components/ToastStack.vue";
import { useToasts } from "../toastService";

describe("ToastStack.vue", () => {
  const MAX_TOAST_COUNT = 5;
  const OFFSET = 4;

  beforeEach(() => {
    vi.mock("../toastService");
    const mockToastService = {
      toasts: vi
        .fn()
        .mockReturnValue([
          { headline: "Toast 1" },
          { headline: "Toast 2" },
          { headline: "Toast 4" },
        ]),
      remove: vi.fn(),
      autoRemove: vi.fn(),
    };
    useToasts.mockReturnValue(mockToastService);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders", () => {
    const wrapper = shallowMount(ToastStack);
    expect(wrapper.exists()).toBe(true);
  });

  it("calls useToasts with default prop values", () => {
    shallowMount(ToastStack);
    expect(useToasts).toHaveBeenCalledWith({
      serviceSymbol: null,
      propertyName: null,
    });
  });

  it("calls useToasts with correct serviceSymbol prop", () => {
    const serviceSymbol = Symbol("test");
    shallowMount(ToastStack, {
      props: { serviceSymbol },
    });
    expect(useToasts).toHaveBeenCalledWith({
      serviceSymbol,
      propertyName: null,
    });
  });

  it("calls useToasts with correct globalPropertyName prop", () => {
    const propertyName = "test";
    shallowMount(ToastStack, {
      props: { propertyName },
    });
    expect(useToasts).toHaveBeenCalledWith({
      serviceSymbol: null,
      propertyName,
    });
  });

  it("returns correct styles for indices less than MAX_TOAST_COUNT", () => {
    const wrapper = shallowMount(ToastStack);
    const style = wrapper.vm.style;
    expect(style(0)).toEqual({
      zIndex: -0,
      bottom: `${0 * OFFSET}px`,
      right: `${0 * OFFSET}px`,
    });
    expect(style(1)).toEqual({
      zIndex: -1,
      bottom: `${-1 * OFFSET}px`,
      right: `${-1 * OFFSET}px`,
    });
  });

  it("returns correct styles for indices equal to or greater than MAX_TOAST_COUNT", () => {
    const wrapper = shallowMount(ToastStack);
    const style = wrapper.vm.style;
    expect(style(MAX_TOAST_COUNT)).toEqual({
      zIndex: -MAX_TOAST_COUNT,
      bottom: `${-MAX_TOAST_COUNT * MAX_TOAST_COUNT}px`,
      right: `${-MAX_TOAST_COUNT * MAX_TOAST_COUNT}px`,
      opacity: 0,
    });
  });

  it("returns true for isActive for the first index and false for other indices", () => {
    const wrapper = shallowMount(ToastStack);
    const isActive = wrapper.vm.isActive;
    expect(isActive(0)).toBe(true);
    expect(isActive(1)).toBe(false);
  });
});
