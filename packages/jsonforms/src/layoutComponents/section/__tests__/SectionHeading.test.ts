import { expect, test } from "vitest";
import { mount } from "@vue/test-utils";

import SectionHeading from "../SectionHeading.vue";

const doMount = (titleText: string = "my title") => {
  return mount(SectionHeading, {
    props: {
      titleText,
    },
  });
};

test("renders", () => {
  const wrapper = doMount();
  expect(wrapper.exists()).toBe(true);
});

test("uses title prop", () => {
  const wrapper = doMount();
  expect(wrapper.find("h3").text()).toBe("my title");
});
