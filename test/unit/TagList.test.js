import { shallowMount } from '@vue/test-utils';
import TagList from '~/ui/components/TagList';
import Tag from '~/ui/components/Tag';

const sevenTags = ['tag1', 'tag2', 'tagedyTag', 'tagMaster', 'bestTagEver', 'moarTags', 'blub'];
const threeTags = ['tag1', 'tag2', 'tagedyTag'];
const defaultNumInitialTags = 5;

const checkTagTexts = (wrappers, expectedTags, numInitialTags) => {
    if (expectedTags.length > numInitialTags) {
        // initial plus expander tag
        expect(wrappers.length).toEqual(numInitialTags + 1);
        let i = 0;
        while (i < wrappers.length - 1) {
            expect(wrappers.at(i).text()).toEqual(expectedTags[i]);
            i++;
        }
        // last wrapper is expander tag
        expect(wrappers.at(i).text()).toEqual(`+${expectedTags.length - numInitialTags}`);
    } else {
        expect(wrappers.length).toEqual(expectedTags.length);
        let i = 0;
        while (i < wrappers.length) {
            expect(wrappers.at(i).text()).toEqual(expectedTags[i]);
            i++;
        }
    }
};

describe('TagList.vue', () => {
    it('renders three tags', () => {
        const wrapper = shallowMount(TagList, {
            propsData: { tags: threeTags }
        });

        let tagWrappers = wrapper.findAll(Tag);
        checkTagTexts(tagWrappers, threeTags, defaultNumInitialTags);
    });

    it('does not render more than max number of tags', () => {
        const wrapper = shallowMount(TagList, {
            propsData: { tags: sevenTags }
        });

        let tagWrappers = wrapper.findAll(Tag);
        checkTagTexts(tagWrappers, sevenTags, defaultNumInitialTags);
    });

    it('max number of tags configurable', () => {
        const wrapper = shallowMount(TagList, {
            propsData: { tags: sevenTags, numberOfInitialTags: 2 }
        });

        let tagWrappers = wrapper.findAll(Tag);
        checkTagTexts(tagWrappers, sevenTags, 2);
    });

    it('expands tags', () => {
        const wrapper = shallowMount(TagList, {
            propsData: { tags: sevenTags }
        });

        let tagWrappers = wrapper.findAll(Tag);
        checkTagTexts(tagWrappers, sevenTags, defaultNumInitialTags);

        // last tag is expander button
        tagWrappers.at(defaultNumInitialTags).trigger('click');
        expect(wrapper.findAll(Tag).length).toEqual(sevenTags.length);
    });

    it('enables click events via prop', () => {
        const wrapper = shallowMount(TagList, {
            propsData: { tags: sevenTags }
        });

        // default disabled Tag events
        let tag = wrapper.find(Tag);
        tag.trigger('click');
        expect(tag.vm.clickable).toBe(false);
        expect(wrapper.emitted('click')).toBeFalsy();
        
        wrapper.setProps({ clickable: true });
        
        // last tag is expander button
        tag.trigger('click');
        expect(tag.vm.clickable).toBe(true);
        expect(wrapper.emitted('click')[0][0]).toStrictEqual('tag1');
    });
});
