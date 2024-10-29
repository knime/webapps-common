import { beforeEach, describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";

import CircleCheck from "@knime/styles/img/icons/circle-check.svg";

import LoadingIcon from "../../../LoadingIcon/LoadingIcon.vue";
import ProgressBar from "../../ProgressBar/ProgressBar.vue";
import ProgressItem from "../ProgressItem.vue";

type ComponentProps = InstanceType<typeof ProgressItem>["$props"];

describe("ProgressItem.vue", () => {
  let defaultProps: ComponentProps;

  beforeEach(() => {
    defaultProps = {
      id: "test",
      title: "testfile.txt",
      progress: 50,
      fileSize: 200,
      status: "info",
    };
  });

  it("renders correctly with default props", () => {
    const wrapper = mount(ProgressItem, {
      props: defaultProps,
    });
    expect(wrapper.html()).toBeTruthy();
    expect(wrapper.isVisible()).toBeTruthy();
    expect(wrapper.find(".file-name").text()).toBe("testfile.txt");
    expect(wrapper.find(".file-size").text()).toContain("100 B of 200 B");
  });

  it("shows correct status icon and text", () => {
    const wrapper = mount(ProgressItem, {
      props: { ...defaultProps, status: "success" },
    });
    const pillComponent = wrapper.findComponent({ name: "Pill" });
    expect(pillComponent.exists()).toBe(true);
    expect(pillComponent.text()).toContain("Uploaded");
    expect(wrapper.findComponent(LoadingIcon).exists()).toBe(false);
    expect(wrapper.findComponent(CircleCheck).exists()).toBe(true);
  });

  it("handles remove action", async () => {
    const newProps = { ...defaultProps, percentage: 100 };
    const wrapper = mount(ProgressItem, {
      props: newProps,
    });
    const removeButton = wrapper.find("button");
    await removeButton.trigger("click");
    expect(wrapper.emitted()).toHaveProperty("remove", [["test"]]);
  });

  it("handles cancel action", async () => {
    const wrapper = mount(ProgressItem, {
      props: defaultProps,
    });
    const cancelButton = wrapper.find("button");
    await cancelButton.trigger("click");
    expect(wrapper.emitted()).toHaveProperty("cancel", [["test"]]);
  });

  it("renders progress bar when percentage is less than 100 and status is not error", () => {
    const wrapper = mount(ProgressItem, {
      props: defaultProps,
    });
    expect(wrapper.findComponent(ProgressBar).exists()).toBe(true);
    expect(wrapper.findComponent(ProgressBar).props("percentage")).toBe(50);
  });

  it("does not render progress bar when upload is complete", () => {
    const wrapper = mount(ProgressItem, {
      props: { ...defaultProps, percentage: 100 },
    });
    expect(wrapper.findComponent(ProgressBar).exists()).toBe(false);
  });

  it("displays correct file size formats", () => {
    const wrapper = mount(ProgressItem, {
      props: defaultProps,
    });

    expect(wrapper.find(".file-size").element.innerHTML).toBe("100 B of 200 B");
  });
});
