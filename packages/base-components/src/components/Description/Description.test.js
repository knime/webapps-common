import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";

import Description from "./Description.vue";

describe("Description.vue", () => {
  it("renders plain text", () => {
    const text = "<p>testtext</p>";
    const wrapper = mount(Description, {
      props: {
        text,
      },
    });
    expect(wrapper.classes()).toContain("plain");
    expect(wrapper.text()).toEqual(text);
  });

  it("renders html", () => {
    const html = "<p>testtext</p>";
    const wrapper = mount(Description, {
      props: {
        text: html,
        renderAsHtml: true,
      },
    });
    expect(wrapper.classes()).not.toContain("plain");
    expect(wrapper.html()).toContain(html);
  });

  it("renders html via slot", () => {
    const html = "<p>testtext</p>";
    const wrapper = mount(Description, {
      slots: {
        default: [html],
      },
    });
    expect(wrapper.classes()).not.toContain("plain");
    expect(wrapper.html()).toContain(html);
  });
});
