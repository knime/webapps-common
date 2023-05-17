import { describe, it, expect, test } from 'vitest';
import { shallowMount } from '@vue/test-utils';

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

    it('doesnt show active tags by default', () => {
      const wrapper = shallowMount(TagList, {
        props: { tags: sevenTags }
      });
      const tags = wrapper.findAllComponents(Tag);
      tags.forEach((tag) => {
        expect(tag.props('active')).toBe(false);
      });
    });

    it('shows active tags', () => {
      const wrapper = shallowMount(TagList, {
        props: { tags: sevenTags, activeTags: ['tagMaster', 'moarTags'] }
      });
      const tags = wrapper.findAllComponents(Tag);

      test.each([
        { tag: tags.at(0), expected: false },
        { tag: tags.at(1), expected: false },
        { tag: tags.at(2), expected: false },
        { tag: tags.at(3), expected: true },
        { tag: tags.at(4), expected: false },
        { tag: tags.at(5), expected: true },
        { tag: tags.at(6), expected: false },
      ])('tag is active or not', ({ tag, expected }) => {
        expect(tag.props('active')).toBe(expected);
      });
 
    })
  })
});
