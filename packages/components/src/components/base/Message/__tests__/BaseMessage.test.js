import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";

import BaseMessage from "../BaseMessage.vue";

describe("BaseMessage", () => {
  let wrapper;

  it("renders default", () => {
    wrapper = mount(BaseMessage, {
      slots: {
        default: "I am a button, am I?",
      },
    });

    expect(wrapper.classes()).toEqual(["info"]);
    expect(wrapper.html()).toContain("I am a button, am I?");
  });

  it("renders success", () => {
    wrapper = mount(BaseMessage, {
      props: {
        type: "success",
      },
    });

    expect(wrapper.classes()).toEqual(["success"]);
  });

  it("renders error", () => {
    wrapper = mount(BaseMessage, {
      props: {
        type: "error",
      },
    });

    expect(wrapper.classes()).toEqual(["error"]);
  });
});
