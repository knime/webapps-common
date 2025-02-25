import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";

import HintPopover from "../BasePopover.vue";

describe("BasePopover", () => {
  const div = document.createElement("div");
  div.setAttribute("id", "showHintForThisDiv");
  document.body.appendChild(div);

  const doMount = ({ props = {} }) => {
    const wrapper = mount(HintPopover, {
      props: {
        reference: div,
        placement: "bottom-end",
        ...props,
      },
    });
    return { wrapper };
  };

  it("renders component", () => {
    const { wrapper } = doMount({});
    expect(wrapper.find(".arrow").exists()).toBe(true);
    expect(wrapper.find(".arrow").classes()).toContain("top");
    expect(wrapper.find(".hint-popover").attributes("style")).toBe(
      "position: absolute; left: 0px; top: 0px;",
    );
  });

  it("positions arrow on the bottom", () => {
    const { wrapper } = doMount({
      props: {
        placement: "top-start",
      },
    });
    expect(wrapper.find(".arrow").classes()).toContain("bottom");
  });

  it("positions arrow on the right", () => {
    const { wrapper } = doMount({
      props: {
        placement: "left",
      },
    });
    expect(wrapper.find(".arrow").classes()).toContain("right");
  });

  it("positions arrow on the left", () => {
    const { wrapper } = doMount({
      props: {
        placement: "right",
      },
    });
    expect(wrapper.find(".arrow").classes()).toContain("left");
  });
});
