import { describe, expect, it } from "vitest";
import { mount, shallowMount } from "@vue/test-utils";

import Collapser from "../../Collapser/Collapser.vue";
import DialogOptions from "../DialogOptions.vue";

describe("DialogOptions.vue", () => {
  it("renders", () => {
    const wrapper = shallowMount(DialogOptions, {
      props: {
        options: [
          {
            fields: [
              {
                name: "foo",
                description: "bar",
              },
            ],
          },
        ],
      },
    });
    expect(wrapper.html()).toBeTruthy();
  });

  it("renders nothing when no data is given", () => {
    const wrapper = shallowMount(DialogOptions);
    expect(wrapper.find("*").exists()).toBe(false);
  });

  it("shows optional options as optional", () => {
    const wrapper = shallowMount(DialogOptions, {
      props: {
        options: [
          {
            fields: [
              {
                name: "foo",
                optional: true,
                description: "bar",
              },
            ],
          },
        ],
      },
    });
    expect(wrapper.find(".option-field-name").text()).toMatch(
      /^foo\s+\(optional\)$/,
    );
  });

  it("renders no collapser if sectionName is not set", () => {
    const wrapper = shallowMount(DialogOptions, {
      props: {
        options: [
          {
            fields: [
              {
                name: "foo",
                description: "bar",
              },
            ],
          },
        ],
      },
    });
    expect(wrapper.findAllComponents(Collapser).length).toBeFalsy();
    expect(wrapper.find(".option-field-name").text()).toBe("foo");
    expect(wrapper.find(".option-description").attributes("text")).toBe("bar");
  });

  it("renders collapsers if sectionName is set", () => {
    const wrapper = shallowMount(DialogOptions, {
      props: {
        options: [
          {
            sectionName: "hello",
            fields: [
              {
                name: "foo",
                description: "bar",
              },
              {
                name: "baz",
                description: "qux",
              },
            ],
          },
          {
            sectionName: "world",
            fields: [
              {
                name: "bla",
                description: "quux",
              },
            ],
          },
        ],
      },
    });
    expect(wrapper.findAllComponents(Collapser).length).toBe(2);
    expect(wrapper.findAll(".option-field-name")[0].text()).toBe("foo");
    expect(wrapper.findAll(".option-field-name")[1].text()).toBe("baz");
    expect(wrapper.findAll(".option-field-name")[2].text()).toBe("bla");
    expect(wrapper.findAll(".option-description")[0].attributes("text")).toBe(
      "bar",
    );
    expect(wrapper.findAll(".option-description")[1].attributes("text")).toBe(
      "qux",
    );
    expect(wrapper.findAll(".option-description")[2].attributes("text")).toBe(
      "quux",
    );
  });

  it("renders section description if only section description is set", () => {
    const wrapper = shallowMount(DialogOptions, {
      props: {
        options: [
          {
            sectionDescription: "bar",
          },
        ],
      },
    });
    expect(wrapper.find(".section-description").attributes("text")).toBe("bar");
  });

  it("renders section description if section description and fields are set", () => {
    const wrapper = shallowMount(DialogOptions, {
      props: {
        options: [
          {
            sectionDescription: "bar",
            fields: [
              {
                name: "foo",
                description: "banana",
              },
            ],
          },
        ],
      },
    });
    expect(wrapper.find(".section-description").attributes("text")).toBe("bar");
  });

  it("does not render Collapser if section description and fields are missing", () => {
    const wrapper = shallowMount(DialogOptions, {
      props: {
        options: [
          {
            fields: [],
          },
        ],
      },
    });
    expect(wrapper.find(".options").exists()).toBeFalsy();
  });

  it("should sanitize content", () => {
    const dangerousContent = "</li><span>HELLO WORLD!</span>";
    const expectedContent = "&lt;/li&gt;&lt;span&gt;HELLO WORLD!&lt;/span&gt;";
    const wrapper = mount(DialogOptions, {
      props: {
        sanitizeContent: true,
        options: [
          {
            sectionDescription: dangerousContent,
            fields: [
              {
                name: "",
                description: dangerousContent,
              },
            ],
          },
        ],
      },
    });

    const sectionDescription = wrapper.find(".section-description");
    const optionDescription = wrapper.find(".option-description");

    expect(sectionDescription.element.innerHTML).toMatch(expectedContent);
    expect(optionDescription.element.innerHTML).toMatch(expectedContent);
  });
});
