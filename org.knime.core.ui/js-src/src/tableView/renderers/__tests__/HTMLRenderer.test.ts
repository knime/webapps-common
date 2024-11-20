import { beforeEach, describe, expect, it } from "vitest";
import { VueWrapper, mount } from "@vue/test-utils";

import HtmlRenderer, { type HTMLRendererProps } from "../HtmlRenderer.vue";

describe("HTMLRenderer.vue", () => {
  let props: HTMLRendererProps;

  beforeEach(() => {
    props = {
      content: "<span>TEST</span>",
      usedForAutoSizeCalculation: undefined,
    };
  });

  const getContainerAttributes = (wrapper: VueWrapper) =>
    wrapper.find(".knime-cell-content").attributes();

  it("renders without special styles on deactivated auto sizing", () => {
    const wrapper = mount(HtmlRenderer, { props });
    expect(getContainerAttributes(wrapper).class).toBe("knime-cell-content");
    expect(getContainerAttributes(wrapper).style).toBeFalsy();
  });

  it("renders with special styles on activated auto sizing", () => {
    props.usedForAutoSizeCalculation = true;
    const wrapper = mount(HtmlRenderer, { props });
    expect(getContainerAttributes(wrapper).class).toBe("knime-cell-content");
    expect(getContainerAttributes(wrapper).style).toContain("display: flex");
    expect(getContainerAttributes(wrapper).style).toContain(
      "max-width: fit-content",
    );
  });
});
