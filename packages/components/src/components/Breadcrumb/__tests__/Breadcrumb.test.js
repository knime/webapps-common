import { describe, it, expect } from "vitest";
import { shallowMount, mount } from "@vue/test-utils";
import { markRaw } from "vue";

import Breadcrumb from "../Breadcrumb.vue";
import ArrowNext from "@knime/styles/img/icons/arrow-next.svg";

describe("Breadcrumb.vue", () => {
  it("renders nothing by default", () => {
    let wrapper = shallowMount(Breadcrumb);
    expect(wrapper.find("nav").exists()).toBeFalsy();
    expect(wrapper.find(".grey-style").exists()).toBe(false);
  });

  it("renders links, text, icons and arrows", () => {
    let wrapper = mount(Breadcrumb, {
      props: {
        items: [
          {
            text: "foo",
          },
          {
            text: "bar",
            href: "//h/ref",
          },
          {
            text: "baz",
            icon: markRaw(ArrowNext),
          },
          {
            text: "qux",
            href: "//another/href",
          },
        ],
      },
    });
    let renderedItems = wrapper.findAll("li > *");

    /* eslint-disable no-magic-numbers */
    expect(renderedItems[0].element.tagName).toBe("SPAN");
    expect(renderedItems[2].element.tagName).toBe("A");
    expect(renderedItems[4].element.tagName).toBe("SPAN");
    expect(renderedItems[6].element.tagName).toBe("A");

    expect(renderedItems[0].text()).toBe("foo");
    expect(renderedItems[2].text()).toBe("bar");
    expect(renderedItems[4].text()).toBe("baz");
    expect(renderedItems[6].text()).toBe("qux");

    expect(renderedItems[2].attributes("href")).toBe("//h/ref");
    expect(renderedItems[6].attributes("href")).toBe("//another/href");

    expect(wrapper.findAll("li > *")[4].find("svg").exists()).toBe(true);

    // check trailing arrows
    let arrows = 0;
    for (let i = 0; i < renderedItems.length; i++) {
      if (renderedItems[i].element.tagName === "svg") {
        arrows += 1;
      }
    }
    expect(arrows).toBe(3);
    /* eslint-enable no-magic-numbers */
  });

  it.each([
    ["greyStyle", "grey-style"],
    ["noWrap", "no-wrap"],
    ["compact", "compact"],
  ])("renders %s", (prop, cls) => {
    let wrapper = mount(Breadcrumb, {
      props: {
        items: [{ text: "foo" }],
        [prop]: true,
      },
    });

    expect(wrapper.find(`.${cls}`).exists()).toBe(true);
  });

  it("renders clickable breadcrumbs", () => {
    const wrapper = mount(Breadcrumb, {
      propsData: {
        items: [{ text: "foo", clickable: true }, { text: "bar" }],
      },
    });

    const breadcrumbs = wrapper.findAll("li > span");

    breadcrumbs.at(0).trigger("click");
    expect(wrapper.emitted("click-item")[0][0]).toEqual({
      text: "foo",
      clickable: true,
    });

    breadcrumbs.at(1).trigger("click");
    expect(wrapper.emitted("click-item")[1]).toBeUndefined();
  });

  it("adds a title attribute", () => {
    const wrapper = mount(Breadcrumb, {
      propsData: {
        items: [{ text: "foo", title: "this is the title" }, { text: "bar" }],
      },
    });

    const breadcrumbs = wrapper.findAll("li > span");

    expect(breadcrumbs.at(0).attributes("title")).toBe("this is the title");
    expect(breadcrumbs.at(1).attributes("title")).toBeUndefined();
  });
});
