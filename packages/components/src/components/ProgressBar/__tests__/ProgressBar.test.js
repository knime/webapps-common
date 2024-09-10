import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ProgressBar from "../ProgressBar.vue";

describe("ProgressBar.vue", () => {
  it("renders", () => {
    let props = {
      compact: false,
      indeterminate: false,
      percentage: 0,
    };
    const wrapper = mount(ProgressBar, { props });
    expect(wrapper.html()).toBeTruthy();
    expect(wrapper.isVisible()).toBeTruthy();
  });

  it("should show 1% when percentage is less than 1", () => {
    let props = {
      compact: false,
      indeterminate: false,
      percentage: 0,
    };
    const wrapper = mount(ProgressBar, { props });

    const progress = wrapper.find("progress");
    const progressElement = progress.element;

    expect(progressElement.value).toBe(1);
  });

  it("should show 100% when percentage is more than 100", () => {
    let props = {
      compact: false,
      indeterminate: false,
      percentage: 101,
    };
    const wrapper = mount(ProgressBar, { props });

    const progress = wrapper.find("progress");
    const progressElement = progress.element;

    expect(progressElement.value).toBe(100);
  });

  it("should show 1% when percentage is NAN", () => {
    let props = {
      compact: false,
      indeterminate: false,
      percentage: null,
    };
    const wrapper = mount(ProgressBar, { props });

    const progress = wrapper.find("progress");
    const progressElement = progress.element;

    expect(progressElement.value).toBe(1);
  });

  it("should render percentage correctly", () => {
    let props = {
      compact: false,
      indeterminate: false,
      percentage: 50,
    };
    const wrapper = mount(ProgressBar, { props });

    const progress = wrapper.find("progress");
    const progressElement = progress.element;

    expect(progressElement.value).toBe(50);
  });

  it("should in indeterminate mode ignore the percentage", () => {
    let props = {
      compact: false,
      indeterminate: true,
      percentage: 50,
    };
    const wrapper = mount(ProgressBar, { props });
    const progress = wrapper.find("progress");
    const progressElement = progress.element;

    expect(progressElement.value).toBe(0);
  });

  it("should apply compact progressBar", () => {
    let props = {
      compact: true,
      indeterminate: true,
      percentage: 50,
    };
    const wrapper = mount(ProgressBar, { props });

    const progress = wrapper.find(".progress-bar-wrapper");

    expect(progress.classes()).contains("compact");
  });

  it("accepts custom tooltip", () => {
    let props = {
      compact: true,
      indeterminate: true,
      percentage: 50,
      tooltip: "progress",
    };
    const wrapper = mount(ProgressBar, { props });

    const progress = wrapper.find(".progress-bar-wrapper");

    expect(progress.attributes("tooltip")).toBe("progress");
  });
});
