import { describe, expect, it } from "vitest";
import { nextTick } from "vue";
import { mount } from "@vue/test-utils";

import HintProvider from "../../components/HintProvider.vue";
import { useHintProvider } from "../useHintProvider";

describe("useHintProvider", () => {
  const doMount = () => {
    const wrapper = mount(HintProvider, {
      global: {
        stubs: {
          HintPopover: { template: '<div class="hint-popover" />' },
        },
      },
    });

    const div = document.createElement("div");
    div.setAttribute("class", "something");
    document.body.appendChild(div);

    return { wrapper };
  };

  it("should render hint", async () => {
    const { createHintData, hintData } = useHintProvider();

    const { showHint, closeHint } = createHintData({
      element: ".something",
      title: "Test",
      description: "test",
      onCompleteHint(): void {
        throw new Error("Function not implemented.");
      },
      onSkipAllHints(): void {
        throw new Error("Function not implemented.");
      },
    });

    showHint();

    const { wrapper } = doMount();

    await nextTick();

    expect(hintData.value[0].isVisible).toBe(true);

    const popovers = wrapper.findAll(".hint-popover");

    expect(popovers.length).toBe(1);

    closeHint();
    await nextTick();

    expect(wrapper.findAll(".hint-popover").length).toBe(0);
  });
});
