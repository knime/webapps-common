import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import Pill from "../Pill.vue";

describe("Pill.vue", () => {
  type ComponentProps = InstanceType<typeof Pill>["$props"];

  const doMount = ({
    props,
    content,
  }: { props?: ComponentProps; content?: string } = {}) => {
    const wrapper = mount(Pill, {
      props,
      slots: { default: content ?? "" },
    });

    return { wrapper };
  };

  it("should render correctly", () => {
    const { wrapper } = doMount({ content: "Hello world" });

    expect(wrapper.text()).toMatch("Hello world");
  });
});
