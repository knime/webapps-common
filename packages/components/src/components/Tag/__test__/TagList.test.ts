import { describe, it, expect } from "vitest";
import { shallowMount, VueWrapper } from "@vue/test-utils";

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

describe("TagList.vue", () => {
  const checkTagTexts = (
    wrappers: VueWrapper[],
    expectedTags: string[],
    numInitialTags: number,
  ) => {
    if (expectedTags.length > numInitialTags) {
      // initial plus expander tag
      expect(wrappers.length).toEqual(numInitialTags + 1);
      let i = 0;
      while (i < wrappers.length - 1) {
        expect(wrappers[i].text()).toEqual(expectedTags[i]);
        i++;
      }
      // last wrapper is expander tag
      expect(wrappers[i].text()).toBe(
        `+${expectedTags.length - numInitialTags}`,
      );
    } else {
      expect(wrappers.length).toEqual(expectedTags.length);
      let i = 0;
      while (i < wrappers.length) {
        expect(wrappers[i].text()).toEqual(expectedTags[i]);
        i++;
      }
    }
  };

  it("renders three tags", () => {
    const wrapper = shallowMount(TagList, {
      props: { tags: threeTags },
    });

    const tagWrappers = wrapper.findAllComponents(Tag);
    checkTagTexts(tagWrappers, threeTags, defaultNumInitialTags);
  });

  it("does not render more than max number of tags", () => {
    const wrapper = shallowMount(TagList, {
      props: { tags: sevenTags },
    });

    const tagWrappers = wrapper.findAllComponents(Tag);
    checkTagTexts(tagWrappers, sevenTags, defaultNumInitialTags);
  });

  it("max number of tags configurable", () => {
    const wrapper = shallowMount(TagList, {
      props: { tags: sevenTags, numberOfInitialTags: 2 },
    });

    const tagWrappers = wrapper.findAllComponents(Tag);
    checkTagTexts(tagWrappers, sevenTags, 2);
  });

  it("expands tags", async () => {
    const wrapper = shallowMount(TagList, {
      props: { tags: sevenTags },
    });

    const tagWrappers = wrapper.findAllComponents(Tag);
    checkTagTexts(tagWrappers, sevenTags, defaultNumInitialTags);

    // last tag is expander button
    expect(tagWrappers[defaultNumInitialTags].props("clickable")).toBe(true);
    await tagWrappers[defaultNumInitialTags].trigger("click");

    expect(wrapper.emitted("update:showAll")?.[0][0]).toBe(true);
    expect(wrapper.findAllComponents(Tag).length).toEqual(sevenTags.length);
  });

  it("doesn't show active tags by default", () => {
    const wrapper = shallowMount(TagList, {
      props: { tags: sevenTags },
    });
    const tags = wrapper.findAllComponents(Tag);
    tags.forEach((tag) => {
      expect(tag.props("active")).toBe(false);
    });
  });

  it("shows active tags", async () => {
    const wrapper = shallowMount(TagList, {
      props: { tags: sevenTags, activeTags: ["tagMaster", "moarTags"] },
    });
    await wrapper.find(".more-tags").trigger("click");
    const tags = wrapper.findAllComponents(Tag);

    const expected = [false, false, false, true, false, true, false];
    tags.forEach((tag, index) => {
      expect(tag.props("active")).toBe(expected.at(index));
    });
  });

  it("shows active tags at the beginning of the list if prop is given", async () => {
    const wrapper = shallowMount(TagList, {
      props: {
        tags: sevenTags,
        sortByActive: true,
        activeTags: ["tagMaster", "moarTags"],
      },
    });
    await wrapper.find(".more-tags").trigger("click");
    const tags = wrapper.findAllComponents(Tag);

    const expected = [true, true, false, false, false, false, false];
    tags.forEach((tag, index) => {
      expect(tag.props("active")).toBe(expected.at(index));
    });
  });
});
