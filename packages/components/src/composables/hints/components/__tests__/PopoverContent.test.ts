import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";

import { AutoPlayVideo } from "../../../../components";
import PopoverContent from "../PopoverContent.vue";

describe("PopoverContent", () => {
  const defaultProps = {
    title: "My title",
    description: "My description",
  };

  const doMount = ({ props = {} }) => {
    const wrapper = mount(PopoverContent, {
      // @ts-expect-error Type '{}' is not assignable to type ...
      props: {
        ...props,
      },
    });
    return { wrapper };
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
    expect(wrapper.find(".close-button").exists()).toBeTruthy();
  });

  it("hides buttons", () => {
    const { wrapper } = doMount({
      props: {
        title: "My title",
        description: "My description",
        hideButtons: true,
      },
    });

    expect(wrapper.find(".button-controls").exists()).toBe(false);
    expect(wrapper.find(".close-button").exists()).toBeTruthy();
  });

  it("renders video if given", () => {
    const { wrapper } = doMount({
      props: {
        title: "My title",
        description: "My description",
        video: [{ source: "some-vid.webm", type: "video/webm" }],
      },
    });

    expect(wrapper.find(".video").exists()).toBe(true);
    const sourceAttributes = wrapper
      .findComponent(AutoPlayVideo)
      .find("source")
      .attributes();

    expect(sourceAttributes.src).toBe("some-vid.webm");
    expect(sourceAttributes.type).toBe("video/webm");
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

  it("'Got it!' button emits close event", () => {
    const { wrapper } = doMount({
      props: defaultProps,
    });
    const button = wrapper.find(".button-controls").findAll("button").at(1);
    button!.trigger("click");
    expect(wrapper.emitted("close")).toStrictEqual([[]]);
  });

  it("'Skip hints' button emits skipAll", () => {
    const { wrapper } = doMount({
      props: defaultProps,
    });
    const button = wrapper.find(".button-controls").findAll("button").at(0);
    button!.trigger("click");
    expect(wrapper.emitted("skipAll")).toStrictEqual([[]]);
  });

  it("close button emits close event", () => {
    const { wrapper } = doMount({
      props: defaultProps,
    });
    const button = wrapper.find(".close-button");
    button.trigger("click");
    expect(wrapper.emitted("close")).toStrictEqual([[]]);
  });
});
