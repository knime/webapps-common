import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";

import ProgressItem, {
  FIXED_HEIGHT_ITEM,
} from "../../ProgressItem/ProgressItem.vue";
import ProgressList from "../ProgressList.vue";

type ComponentProps = InstanceType<typeof ProgressList>["$props"];

describe("ProgressList.vue", () => {
  const defaultProps: ComponentProps = {
    maxDisplayedItems: 4,
    list: [
      {
        id: "1",
        fileName: "testfile1.txt",
        percentage: 50,
        fileSize: 200,
        status: "info",
      },
      {
        id: "2",
        fileName: "testfile2.txt",
        percentage: 50,
        fileSize: 200,
        status: "info",
      },
    ],
  };

  it("calculates the height correctly", () => {
    const wrapper = mount(ProgressList, {
      props: defaultProps,
    });

    const progressWrapper = wrapper.find(".progress-wrapper")
      .element as HTMLElement;
    const expectedHeight = `${(defaultProps.maxDisplayedItems as number) * FIXED_HEIGHT_ITEM}px`;

    expect(progressWrapper.style.height).toBe(expectedHeight);
  });

  it("emits 'remove' when the remove event is triggered", () => {
    const wrapper = mount(ProgressList, {
      props: defaultProps,
    });

    const progressItems = wrapper.findAllComponents(ProgressItem);
    progressItems[0].vm.$emit("remove", defaultProps.list[0].fileName);

    expect(wrapper.emitted().remove).toBeTruthy();
    expect(wrapper.emitted().remove[0]).toEqual([
      defaultProps.list[0].fileName,
    ]);
  });

  it("emits 'cancel' when the cancel event is triggered", () => {
    const wrapper = mount(ProgressList, {
      props: defaultProps,
    });

    const progressItems = wrapper.findAllComponents(ProgressItem);
    progressItems[1].vm.$emit("cancel", defaultProps.list[1].fileName);

    expect(wrapper.emitted().cancel).toBeTruthy();
    expect(wrapper.emitted().cancel[0]).toEqual([
      defaultProps.list[1].fileName,
    ]);
  });
});
