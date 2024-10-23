import { describe, expect, it, vi } from "vitest";
import { mount } from "@vue/test-utils";

import HintPopover from "../PopoverContent.vue";

describe("HintPopover", () => {
  const defaultProps = {
    title: "My title",
    description: "My description",
  };

  const doMount = ({ props = {} }) => {
    const completeHintMock = vi.fn();
    const skipAllHintsMock = vi.fn();
    const wrapper = mount(HintPopover, {
      // @ts-ignore
      props: {
        ...props,
        completeHint: completeHintMock,
        skipAllHints: skipAllHintsMock,
      },
    });
    return { wrapper, completeHintMock, skipAllHintsMock };
  };

  it("renders component", () => {
    const { wrapper } = doMount({
      props: {
        title: "My title",
        description: "My description",
      },
    });
    expect(wrapper.find(".title").text()).toContain("My title");
    expect(wrapper.find(".description").text()).toContain("My description");
    const buttons = wrapper.find(".button-controls").findAll("button");
    expect(buttons.length).toBe(2);
    expect(buttons.at(0)!.text()).toBe("Skip hints");
    expect(buttons.at(1)!.text()).toBe("Got it!");
    expect(wrapper.find(".close-button").find("button").exists()).toBeTruthy();
  });

  it("renders link if specified", () => {
    const props = {
      title: "My title",
      description: "My description",
      linkText: "Check out this link it's so sick",
      linkHref: "https://this-is-an-epic-link.com",
    };
    const { wrapper } = doMount({
      props,
    });
    const link = wrapper.find("a");
    expect(link.exists()).toBeTruthy();
    expect(link.attributes().href).toStrictEqual(props.linkHref);
    expect(link.text()).toStrictEqual(props.linkText);
  });

  it("does not render link if not specified", () => {
    const { wrapper } = doMount({
      props: defaultProps,
    });
    expect(wrapper.find("a").exists()).toBeFalsy();
  });

  it("'Got it!' button calls completeHint callback", () => {
    const { wrapper, completeHintMock } = doMount({
      props: defaultProps,
    });
    const button = wrapper.find(".button-controls").findAll("button").at(1);
    button!.trigger("click");
    expect(completeHintMock).toHaveBeenCalled();
  });

  it("'Skip hints' button calls skipAllHints callback", () => {
    const { wrapper, skipAllHintsMock } = doMount({
      props: defaultProps,
    });
    const button = wrapper.find(".button-controls").findAll("button").at(0);
    button!.trigger("click");
    expect(skipAllHintsMock).toHaveBeenCalled();
  });

  it("close button calls completeHint callback", () => {
    const { wrapper, completeHintMock } = doMount({
      props: defaultProps,
    });
    const button = wrapper.find(".close-button").find("button");
    button.trigger("click");
    expect(completeHintMock).toHaveBeenCalled();
  });
});
