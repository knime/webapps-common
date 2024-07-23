import { describe, it, expect, beforeEach, vi } from "vitest";
import useToast, { type ToastService } from "../useToast";
import type { Toast } from "../types";

// Mock lodash-es functions
vi.mock("lodash-es", () => ({
  cloneDeep: (val: any) => JSON.parse(JSON.stringify(val)),
  uniqueId: (() => {
    let id = 0;
    return () => (++id).toString();
  })(),
}));

describe("useToast", () => {
  let toastService: ToastService;
  const sampleToast: Toast = { message: "Sample Toast" };

  beforeEach(() => {
    toastService = useToast();
  });

  it("should add a toast with a unique ID", () => {
    const id = toastService.show(sampleToast);
    expect(toastService.toasts.value.length).toBe(1);
    expect(toastService.toasts.value[0].id).toBe(id);
  });

  it("should remove a toast by ID", () => {
    const id = toastService.show(sampleToast);
    toastService.remove(id);
    expect(toastService.toasts.value.length).toBe(0);
  });

  it("should remove toasts by predicate", () => {
    toastService.show(sampleToast);
    toastService.show({ ...sampleToast, message: "Another Toast" });
    toastService.removeBy((toast) => toast.message === "Sample Toast");
    expect(toastService.toasts.value.length).toBe(1);
    expect(toastService.toasts.value[0].message).toBe("Another Toast");
  });

  it("should auto-remove toasts", () => {
    toastService.show(sampleToast);
    toastService.show({
      ...sampleToast,
      autoRemove: false,
      message: "Persistent Toast",
    });
    toastService.autoRemove();
    expect(toastService.toasts.value.length).toBe(1);
    expect(toastService.toasts.value[0].message).toBe("Persistent Toast");
  });

  it("should retain a toast with the same key and return its ID", () => {
    const toastWithKey: Toast = { ...sampleToast, key: "unique-key" };
    const firstId = toastService.show(toastWithKey);
    const secondId = toastService.show(toastWithKey);
    expect(firstId).toBe(secondId);
    expect(toastService.toasts.value.length).toBe(1);
  });

  it("should clone the toast object", () => {
    const toast: Toast = { message: "Cloned Toast", type: "info" };
    toastService.show(toast);
    expect(toastService.toasts.value[0]).not.toBe(toast);
    expect(toastService.toasts.value[0].type).toBe("info");
  });

  it("should generate a unique ID if ID is already provided", () => {
    const toast: Toast = { message: "Toast with ID", id: "custom-id" };
    const id = toastService.show(toast);
    expect(id).toMatch(/^custom-id-\d+$/);
  });
});
