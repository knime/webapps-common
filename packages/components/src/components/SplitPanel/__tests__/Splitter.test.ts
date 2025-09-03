import { beforeEach, describe, expect, it, test, vi } from "vitest";
import { mount } from "@vue/test-utils";

import Splitter from "../Splitter.vue";

import { MockPointerEvent } from "./mockPointerEvent";

beforeEach(() => {
  window.PointerEvent = MockPointerEvent as any;
  HTMLElement.prototype.setPointerCapture = vi.fn();
  HTMLElement.prototype.releasePointerCapture = vi.fn();
});

test("isHorizontal false style", () => {
  const comp = mount(Splitter);
  const elDragger = comp.get(".base-splitter");
  const splitters = comp.findAll(".splitter-pane");
  const leftPane = splitters[0];
  const rightPane = splitters[1];
  expect(leftPane.classes("left-pane")).toBe(true);
  expect(rightPane.classes("right-pane")).toBe(true);
  expect(elDragger.classes("vertical")).toBe(true);
  expect(elDragger.classes("horizontal")).toBe(false);
  const style = elDragger.attributes("style");
  expect(style!.includes("user-select: auto")).toBe(true);
  expect(style!.includes("grid-template: none / 50% auto 1fr")).toBe(true);
});

test("isHorizontal true style", () => {
  const comp = mount(Splitter, { props: { isHorizontal: true } });
  const elDragger = comp.get(".base-splitter");
  const splitters = comp.findAll(".splitter-pane");
  const leftPane = splitters[0];
  const rightPane = splitters[1];
  expect(leftPane.classes("top-pane")).toBe(true);
  expect(rightPane.classes("bottom-pane")).toBe(true);
  expect(elDragger.classes("vertical")).toBe(false);
  expect(elDragger.classes("horizontal")).toBe(true);
  const style = elDragger.attributes("style");
  expect(style!.includes("user-select: auto")).toBe(true);
  expect(style!.includes("grid-template: 50% auto 1fr / none")).toBe(true);
});

test("splitter-click event on click", async () => {
  const comp = mount(Splitter, { props: { isHorizontal: false } });
  const elDragger = comp.get(".splitter");
  await elDragger.trigger("pointerdown");
  window.dispatchEvent(new PointerEvent("pointerup"));
  expect(comp.emitted("splitterClick")).length(1);
});

test("moving the splitter should set the class to active", async () => {
  const comp = mount(Splitter);
  const elDragger = comp.get(".splitter");
  expect(elDragger.classes("active")).toBe(false);
  await elDragger.trigger("pointerdown");
  expect(elDragger.classes("active")).toBe(true);
});

describe("hiddenPane", () => {
  it("hides splitter element when any pane is hidden", () => {
    const comp = mount(Splitter, { props: { hiddenPane: "left" } });

    // Splitter element should not exist
    expect(comp.find(".splitter").exists()).toBe(false);

    // But both pane containers should still exist
    const panes = comp.findAll(".splitter-pane");
    expect(panes).toHaveLength(2);
  });

  it.each([
    { hiddenPane: "left", isHorizontal: false, expectedGrid: "none / 0 1fr" },
    { hiddenPane: "right", isHorizontal: false, expectedGrid: "none / 1fr 0" },
    { hiddenPane: "top", isHorizontal: true, expectedGrid: "0 1fr / none" },
    { hiddenPane: "bottom", isHorizontal: true, expectedGrid: "1fr 0 / none" },
  ] as const)(
    "sets grid size to hide $hiddenPane pane",
    ({ hiddenPane, isHorizontal, expectedGrid }) => {
      const comp = mount(Splitter, {
        props: {
          hiddenPane,
          isHorizontal,
        },
      });

      const elDragger = comp.get(".base-splitter");
      const style = elDragger.attributes("style");

      expect(style!.includes(`grid-template: ${expectedGrid}`)).toBe(true);
    },
  );
});
