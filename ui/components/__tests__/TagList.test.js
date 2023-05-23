import { describe, it, expect } from "vitest";
import { shallowMount } from "@vue/test-utils";

import TagList from "../TagList.vue";
import Tag from "../Tag.vue";

const sevenTags = [
  "tag1",
  "tag2",
  "tagedyTag",
  "tagMaster",
  "bestTagEver",
  "moarTags",
  "blub",
];
const threeTags = ["tag1", "tag2", "tagedyTag"];
const defaultNumInitialTags = 5;

const checkTagTexts = (wrappers, expectedTags, numInitialTags) => {
  if (expectedTags.length > numInitialTags) {
    // initial plus expander tag
    expect(wrappers.length).toEqual(numInitialTags + 1);
    let i = 0;
    while (i < wrappers.length - 1) {
      expect(wrappers[i].text()).toEqual(expectedTags[i]);
      i++;
    }
    // last wrapper is expander tag
    expect(wrappers[i].text()).toBe(`+${expectedTags.length - numInitialTags}`);
  } else {
    expect(wrappers.length).toEqual(expectedTags.length);
    let i = 0;
    while (i < wrappers.length) {
      expect(wrappers[i].text()).toEqual(expectedTags[i]);
      i++;
    }
  }
};

describe("tagList.vue", () => {
  it("renders three tags", () => {
    const wrapper = shallowMount(TagList, {
      props: { tags: threeTags },
    });

    let tagWrappers = wrapper.findAllComponents(Tag);
    checkTagTexts(tagWrappers, threeTags, defaultNumInitialTags);
  });

  it("does not render more than max number of tags", () => {
    const wrapper = shallowMount(TagList, {
      props: { tags: sevenTags },
    });

    let tagWrappers = wrapper.findAllComponents(Tag);
    checkTagTexts(tagWrappers, sevenTags, defaultNumInitialTags);
  });

  it("max number of tags configurable", () => {
    const wrapper = shallowMount(TagList, {
      props: { tags: sevenTags, numberOfInitialTags: 2 },
    });

    let tagWrappers = wrapper.findAllComponents(Tag);
    checkTagTexts(tagWrappers, sevenTags, 2);
  });

  it("expands tags", async () => {
    const wrapper = shallowMount(TagList, {
      props: { tags: sevenTags },
    });

    let tagWrappers = wrapper.findAllComponents(Tag);
    checkTagTexts(tagWrappers, sevenTags, defaultNumInitialTags);

    // last tag is expander button
    await tagWrappers[defaultNumInitialTags].trigger("click");
    expect(wrapper.findAllComponents(Tag).length).toEqual(sevenTags.length);
  });

  it("enables click events via prop", async () => {
    const wrapper = shallowMount(TagList, {
      props: { tags: sevenTags },
    });

    // default disabled Tag events
    let tag = wrapper.findComponent(Tag);
    await tag.trigger("click");
    expect(tag.vm.clickable).toBe(false);
    expect(wrapper.emitted("click")).toBeFalsy();

    await wrapper.setProps({ clickable: true });

    // last tag is expander button
    await tag.trigger("click");
    expect(tag.vm.clickable).toBe(true);
    expect(wrapper.emitted("click")[0][0]).toBe("tag1");
  });
});
