import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";

import Avatar from "../Avatar.vue";
import AvatarImagePlaceholder from "../AvatarImagePlaceholder.vue";

const testUrl = "//mockimageurl.test";

describe("Avatar.vue", () => {
  it("renders a given image", () => {
    const wrapper = mount(Avatar, {
      props: {
        image: { url: testUrl },
      },
    });
    const image = wrapper.get("img.avatar-image");
    expect(image.attributes("src")).toBe(testUrl);
  });

  it("renders name", () => {
    const wrapper = mount(Avatar, {
      props: {
        name: "John Doe",
        showText: "name",
      },
    });
    const name = wrapper.get("div.display-name");
    expect(name.text()).toBe("John Doe");
  });

  it("renders link", () => {
    const wrapper = mount(Avatar, {
      props: {
        linkUrl: testUrl,
      },
    });
    expect(wrapper.element.tagName).toBe("A");
    expect(wrapper.attributes("href")).toBe(testUrl);
  });

  it("fallback to initials placeholder", () => {
    const wrapper = mount(Avatar, {
      props: {
        name: "John Doe",
      },
    });
    wrapper.getComponent(AvatarImagePlaceholder);
    expect(wrapper.findComponent(AvatarImagePlaceholder).exists()).toBe(true);
  });
});
