import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";

import GradientPreview from "../GradientPreview.vue";

describe("GradientPreview", () => {
  it("renders gradient without explicit stops", () => {
    const wrapper = mount(GradientPreview, {
      props: {
        gradient: {
          colors: ["#AA0000", "#00AA00"],
          stops: null,
        },
      },
    });

    expect((wrapper.vm as any).computedGradient).toBe("#AA0000, #00AA00");
    expect((wrapper.vm as any).gradientBackground).toBe(
      "linear-gradient(to right in lab, #AA0000, #00AA00)",
    );
  });

  it("renders gradient with explicit stops", () => {
    const wrapper = mount(GradientPreview, {
      props: {
        gradient: {
          colors: ["#AA0000", "#00AA00"],
          stops: [0, 100],
        },
      },
    });

    expect((wrapper.vm as any).computedGradient).toContain("#AA0000 0%");
    expect((wrapper.vm as any).computedGradient).toContain("#00AA00 100%");
    expect((wrapper.vm as any).gradientBackground).toBe(
      "linear-gradient(to right in lab, #AA0000 0%, #00AA00 100%)",
    );
  });
});
