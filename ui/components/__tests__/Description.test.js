import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";

import Description from "../Description.vue";

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
    expect(wrapper.find(".plain").exists()).toBeFalsy();
    expect(wrapper.find(".description").exists()).toBeTruthy();
    expect(wrapper.find(".html-description").exists()).toBeFalsy();
    expect(wrapper.html()).toContain(html);
  });

  it("uses RTE styling if specified", () => {
    const html = "<p>testtext</p>";
    const wrapper = mount(Description, {
      props: {
        text: html,
        renderAsHtml: true,
        useRichTextEditorStyles: true,
      },
    });
    expect(wrapper.find(".plain").exists()).toBeFalsy();
    expect(wrapper.find(".description").exists()).toBeFalsy();
    expect(wrapper.find(".html-description").exists()).toBeTruthy();
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
