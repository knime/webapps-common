import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";

import CircleCheckIcon from "@knime/styles/img/icons/circle-check.svg";
import CircleCloseIcon from "@knime/styles/img/icons/circle-close.svg";
import CircleInfoIcon from "@knime/styles/img/icons/circle-info.svg";
import RocketIcon from "@knime/styles/img/icons/rocket.svg";
import SignWarningIcon from "@knime/styles/img/icons/sign-warning.svg";

import InlineMessage from "../InlineMessage.vue";

describe("Message.vue", () => {
  let wrapper;

  it.each([
    [
      "info" as const,
      "Info",
      "Here is a message that informs the user",
      CircleInfoIcon,
    ],
    [
      "warning" as const,
      "Warning",
      "Here is a message that warns the user",
      SignWarningIcon,
    ],
    [
      "error" as const,
      "Error",
      "Here is a message that tells user about error and what to do",
      CircleCloseIcon,
    ],
    [
      "success" as const,
      "Success",
      "Here is a message that informs the user about success",
      CircleCheckIcon,
    ],
    [
      "promotion" as const,
      "Promotion",
      "Here is a message that informs the user about KNIME news",
      RocketIcon,
    ],
  ])("renders a(n) %s inline message", (type, title, description, icon) => {
    wrapper = mount(InlineMessage, {
      props: {
        type,
        title,
        description,
      },
    });

    expect(wrapper.findComponent(icon).exists()).toBeTruthy();
    expect(wrapper.find(".inline-message").classes()).toContain(type);
    expect(wrapper.find(".title").text()).toBe(title);
    expect(wrapper.find(".description").text()).toBe(description);
  });
});
