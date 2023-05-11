import { describe, it, expect, vi } from "vitest";
import { shallowMount, mount } from "@vue/test-utils";

import Message from "../Message.vue";
import Button from "../Button.vue";
import WarnIcon from "../../assets/img/icons/sign-warning.svg";

import { copyText } from "../../../util/copyText";
vi.mock("../../../util/copyText", () => ({
  copyText: vi.fn(),
}));

// TODO split tests up into MessageTitle.test.js

describe("Message.vue", () => {
  let wrapper;

  it("renders default", () => {
    wrapper = mount(Message);
    expect(wrapper.classes()).toEqual(["info"]);
    expect(wrapper.find(".message-count").classes()).toContain("info");
    expect(wrapper.find(".close").classes()).toContain("info");
    expect(wrapper.find("span.close").exists()).toBe(true);
    expect(wrapper.find(".collapser").exists()).toBe(false);
    expect(wrapper.find(".banner").exists()).toBe(true);
  });

  it("renders success", () => {
    wrapper = mount(Message, {
      props: {
        type: "success",
      },
    });

    expect(wrapper.classes()).toEqual(["success"]);
    expect(wrapper.find(".message-count").classes()).toContain("success");
    expect(wrapper.find(".close").classes()).toContain("success");
  });

  it("renders error", () => {
    wrapper = mount(Message, {
      props: {
        type: "error",
      },
    });

    expect(wrapper.classes()).toEqual(["error"]);
    expect(wrapper.find(".message-count").classes()).toContain("error");
    expect(wrapper.find(".close").classes()).toContain("error");
  });

  it("renders button", () => {
    let buttonText = "Okay";
    wrapper = mount(Message, {
      props: {
        button: buttonText,
      },
    });

    expect(wrapper.findComponent(Button).text()).toContain(buttonText);
  });

  it("renders icon", () => {
    wrapper = mount(Message, {
      slots: {
        icon: WarnIcon,
      },
    });

    expect(wrapper.findComponent(WarnIcon).exists()).toBe(true);
  });

  it("hides count if message is unique", () => {
    wrapper = mount(Message, {
      props: {
        type: "error",
      },
    });

    expect(wrapper.find(".message-count").exists()).toBe(true);
    expect(wrapper.find(".message-count").isVisible()).toBe(false);
  });

  it("shows count if message is repeated", () => {
    wrapper = mount(Message, {
      props: {
        type: "error",
        count: 2,
      },
    });

    expect(wrapper.find(".message-count").exists()).toBe(true);
    expect(wrapper.find(".message-count").isVisible()).toBe(true);
  });

  it("renders collapser", () => {
    wrapper = shallowMount(Message, {
      props: {
        type: "error",
        details: "test message",
      },
    });
    expect(wrapper.find(".copy-button").exists()).toBe(true);
    expect(wrapper.find(".collapser").exists()).toBe(true);
    expect(wrapper.find(".detail-text").text()).toBe("test message");
  });

  it("renders details in banner if showCollapser is false", () => {
    wrapper = shallowMount(Message, {
      props: {
        type: "error",
        details: "test message",
        showCollapser: false,
      },
    });
    expect(wrapper.find(".copy-button").exists()).toBe(false);
    expect(wrapper.find(".collapser").exists()).toBe(false);
    expect(wrapper.find(".detail-text").text()).toBe("test message");
    expect(wrapper.find(".banner").text()).toContain("test message");
  });

  it("renders detail link", () => {
    let link = {
      text: "go somewhere",
      href: "localhost:3000",
    };
    wrapper = mount(Message, {
      props: {
        type: "error",
        details: {
          text: "test message",
          link,
        },
      },
    });
    expect(wrapper.vm.detailsLink).toStrictEqual(link);
    expect(wrapper.find(".detail-text").text()).toContain("test message");
    expect(wrapper.find(".collapser .details a").text()).toBe("go somewhere");
  });

  it("renders detail link in banner if showCollapser is false", () => {
    let link = {
      text: "go somewhere",
      href: "localhost:3000",
    };
    wrapper = mount(Message, {
      props: {
        type: "error",
        details: {
          text: "test message",
          link,
        },
        showCollapser: false,
      },
    });
    expect(wrapper.vm.detailsLink).toStrictEqual(link);
    expect(wrapper.find(".detail-text").text()).toContain("test message");
    expect(wrapper.find(".banner .details a").text()).toBe("go somewhere");
  });

  it("renders without close button when not dismissible", () => {
    wrapper = shallowMount(Message, {
      props: {
        type: "error",
        showCloseButton: false,
      },
    });
    expect(wrapper.vm.active).toBe(true);
    expect(wrapper.find(".close").exists()).toBe(false);
  });

  it("copies text by enter key", () => {
    wrapper = mount(Message, {
      props: {
        type: "error",
        details: "test message",
      },
    });
    wrapper.find(".copy-button").trigger("keyup.space");
    expect(vi.mocked(copyText)).toHaveBeenCalledWith("test message");
  });

  it("closes", () => {
    wrapper = mount(Message, {
      props: {
        type: "error",
        count: 2,
      },
    });
    expect(wrapper.vm.active).toBe(true);
    wrapper.find(".close").trigger("click");
    expect(wrapper.vm.active).toBe(false);
    expect(wrapper.emitted("dismiss")).toBeTruthy();
  });

  it("closes on space key", () => {
    wrapper = mount(Message, {
      props: {
        type: "error",
        count: 2,
      },
    });
    expect(wrapper.vm.active).toBe(true);
    wrapper.find(".close").trigger("keydown.space");
    expect(wrapper.vm.active).toBe(false);
    expect(wrapper.emitted("dismiss")).toBeTruthy();
  });
});
