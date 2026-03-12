import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";

import ColorPreviewEmptyState from "../ColorPreviewEmptyState.vue";
import PalettePreview from "../PalettePreview.vue";

describe("PalettePreview", () => {
  it("uses one column per color up to the max", () => {
    const wrapper = mount(PalettePreview, {
      props: {
        palette: {
          colors: ["#111111", "#222222", "#333333"],
        },
      },
    });

    const style = wrapper.find(".palette-grid").attributes("style");
    expect(style).toContain("repeat(3, minmax(0, 1fr))");
    expect(wrapper.findAll(".color-cell")).toHaveLength(3);
  });

  it("caps columns at eight", () => {
    const wrapper = mount(PalettePreview, {
      props: {
        palette: {
          colors: Array.from(
            { length: 12 },
            (_, index) => `#${index}${index}${index}`,
          ),
        },
      },
    });

    const style = wrapper.find(".palette-grid").attributes("style");
    expect(style).toContain("repeat(8, minmax(0, 1fr))");
  });

  it("renders empty state when palette has no colors", () => {
    const wrapper = mount(PalettePreview, {
      props: {
        palette: {
          colors: [],
        },
      },
    });

    expect(wrapper.find(".palette-grid").exists()).toBe(false);
    expect(wrapper.findComponent(ColorPreviewEmptyState).exists()).toBe(true);
  });
});
