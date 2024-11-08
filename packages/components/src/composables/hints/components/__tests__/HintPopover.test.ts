import { beforeAll, describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import { mount } from "@vue/test-utils";

import BasePopover from "../BasePopover.vue";
import HintPopover from "../HintPopover.vue";
import PopoverContent from "../PopoverContent.vue";

describe("HintPopover", () => {
  const defaultProps = {
    content: {
      title: "My title",
      description: "My description",
    },
    placement: "bottom-end",
  };

  beforeAll(() => {
    const div = document.createElement("div");
    div.setAttribute("id", "showHintForThisDiv");
    document.body.appendChild(div);
  });

  const doMount = ({ props = {} }) => {
    const isVisible = ref(false);
    const completeHintMock = vi.fn();
    const skipAllHintsMock = vi.fn();
    const wrapper = mount(HintPopover, {
      // @ts-ignore
      props: {
        ...defaultProps,
        completeHint: completeHintMock,
        skipAllHints: skipAllHintsMock,
        isVisible,
        ...props,
      },
    });
    return { wrapper, isVisible, completeHintMock, skipAllHintsMock };
  };

  it("renders component", async () => {
    const { wrapper, isVisible } = doMount({
      props: {
        reference: "#showHintForThisDiv",
      },
    });
    expect(wrapper.findComponent(PopoverContent).exists()).toBe(false);

    isVisible.value = true;

    await new Promise((r) => setTimeout(r, 0));

    expect(wrapper.findComponent(PopoverContent).exists()).toBe(true);
  });

  it("binds events to callback functions", async () => {
    const { wrapper, isVisible, completeHintMock, skipAllHintsMock } = doMount({
      props: {
        reference: "#showHintForThisDiv",
      },
    });
    isVisible.value = true;

    await new Promise((r) => setTimeout(r, 0));

    wrapper.findComponent(PopoverContent).vm.$emit("close");
    expect(completeHintMock).toBeCalled();

    wrapper.findComponent(PopoverContent).vm.$emit("skipAll");
    expect(skipAllHintsMock).toBeCalled();
  });

  it("queries DOM for element and passes it to HintPopover", async () => {
    const { wrapper, isVisible } = doMount({
      props: {
        reference: "#showHintForThisDiv",
      },
    });

    isVisible.value = true;

    await new Promise((r) => setTimeout(r, 0));

    expect(wrapper.findComponent(BasePopover).props("reference")).toBe(
      document.getElementById("showHintForThisDiv"),
    );
  });
});
