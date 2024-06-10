import { describe, it, expect } from "vitest";
import { shallowMount, mount, RouterLinkStub } from "@vue/test-utils";
import { markRaw } from "vue";

import Messages from "../Messages.vue";
import MessageLink from "../MessageLink.vue";
import Message from "../Message.vue";
import SuccessIcon from "@knime/styles/img/icons/circle-check.svg";

// TODO add test case for message.content prop

const messages = [
  {
    message: "Error 404",
    type: "error",
    id: 1,
    count: 2,
  },
  {
    message: "Info of something",
    type: "info",
    id: 2,
  },
  {
    message: "Info of something",
    type: "info",
    button: "Okay",
    icon: markRaw(SuccessIcon),
    id: 3,
    details: "test detail text",
  },
];

const linkedMessageHref = {
  message: "Info of something",
  type: "info",
  button: "Okay",
  icon: markRaw(SuccessIcon),
  id: 4,
  link: {
    text: "Linked text.",
    href: "some_link",
  },
};

const linkedMessageTo = {
  message: "Info of something",
  type: "info",
  button: "Okay",
  icon: markRaw(SuccessIcon),
  id: 4,
  link: {
    text: "Linked text.",
    to: "some_link",
  },
};

describe("Messages.vue", () => {
  let wrapper;

  it("renders notifications", () => {
    wrapper = mount(Messages, {
      props: { messages },
      global: {
        stubs: {
          NuxtLink: RouterLinkStub,
        },
      },
    });

    const messageComponents = wrapper.findAllComponents(Message);
    expect(messageComponents.length).toBe(messages.length);
    messages.forEach((message, i) => {
      const messageComponent = messageComponents[i];
      expect(messageComponent.props("type")).toEqual(message.type);
      if (message.button) {
        expect(messageComponent.props("button")).toEqual(message.button);
      }
      if (message.icon) {
        expect(messageComponent.findComponent(message.icon).exists()).toBe(
          true,
        );
      }
      if (message.details) {
        expect(messageComponent.props("details")).toEqual(message.details);
      }
      expect(messageComponent.text()).toContain(message.message);
    });

    expect(wrapper.find("a").exists()).toBe(false);
    expect(wrapper.findComponent(MessageLink).exists()).toBe(false);
    expect(wrapper.findComponent(RouterLinkStub).exists()).toBe(false);
  });

  it("renders no message when there is no notification", () => {
    wrapper = shallowMount(Messages);

    expect(wrapper.findAllComponents(Message).length).toBe(0);
  });

  it("emits dismiss event", () => {
    wrapper = shallowMount(Messages, {
      props: { messages },
      global: {
        stubs: {
          NuxtLink: RouterLinkStub,
        },
      },
    });

    wrapper.findAllComponents(Message)[1].vm.$emit("dismiss");
    expect(wrapper.emitted().dismiss[0]).toEqual([messages[1].id]);

    expect(wrapper.find("a").exists()).toBe(false);
    expect(wrapper.findComponent(MessageLink).exists()).toBe(false);
    expect(wrapper.findComponent(RouterLinkStub).exists()).toBe(false);
  });

  it("handles messages with and without counts", () => {
    wrapper = mount(Messages, {
      props: { messages },
      global: {
        stubs: {
          NuxtLink: RouterLinkStub,
        },
      },
    });

    const messageComponents = wrapper.findAllComponents(Message);
    expect(messageComponents[0].find(".message-count").isVisible()).toBe(true);
    expect(messageComponents[0].vm.count).toBe(2);
    expect(messageComponents[1].find(".message-count").isVisible()).toBe(false);
    expect(messageComponents[1].vm.count).toBe(1);
    expect(messageComponents[2].find(".message-count").isVisible()).toBe(false);
    expect(messageComponents[2].vm.count).toBe(1);

    expect(wrapper.find("a").exists()).toBe(false);
    expect(wrapper.findComponent(MessageLink).exists()).toBe(false);
    expect(wrapper.findComponent(RouterLinkStub).exists()).toBe(false);
  });

  it("renders external link if specified", () => {
    wrapper = mount(Messages, {
      props: { messages: messages.concat(linkedMessageHref) },
      global: {
        stubs: {
          NuxtLink: RouterLinkStub,
        },
      },
    });

    const messageComponents = wrapper.findAllComponents(Message);
    for (let i of [0, 1, 2]) {
      expect(messageComponents[i].find("a").exists()).toBe(false);
    }

    // eslint-disable-next-line no-magic-numbers
    let link = messageComponents[3].find("a");
    expect(link.exists()).toBe(true);
    expect(link.text()).toBe("Linked text.");
    expect(link.attributes("href")).toBe("some_link");

    expect(wrapper.findComponent(RouterLinkStub).exists()).toBe(false);
  });

  it("renders internal link if specified", () => {
    wrapper = mount(Messages, {
      props: { messages: messages.concat(linkedMessageTo) },
      global: {
        stubs: {
          NuxtLink: RouterLinkStub,
        },
      },
    });

    const messageComponents = wrapper.findAllComponents(Message);
    for (let i of [0, 1, 2]) {
      expect(messageComponents[i].find("a").exists()).toBe(false);
      expect(messageComponents[i].findComponent(RouterLinkStub).exists()).toBe(
        false,
      );
    }

    // eslint-disable-next-line no-magic-numbers
    let link = messageComponents[3].findComponent(RouterLinkStub);
    expect(link.exists()).toBe(true);
    expect(link.text()).toBe("Linked text.");
    expect(link.props("to")).toBe("some_link");
  });
});
