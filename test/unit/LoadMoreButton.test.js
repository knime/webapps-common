import { shallowMount } from '@vue/test-utils';

import LoadMoreButton from '~/ui/components/LoadMoreButton';

describe('LoadMoreButton.vue', () => {

    it('doesn’t render when not needed', () => {
        let wrapper = shallowMount(LoadMoreButton, {
            propsData: {
                showMore: false,
                loading: false
            }
        });
        expect(wrapper.find('div').exists()).toEqual(false);
    });

    it('handles loading state correctly', () => {
        let wrapper = shallowMount(LoadMoreButton, {
            propsData: {
                showMore: true,
                loading: true
            }
        });
        expect(wrapper.text()).toContain('Loading');
        expect(wrapper.text()).not.toContain('More results');

        // Loading complete
        wrapper.setProps({ loading: false });
        expect(wrapper.text()).not.toContain('Loading');
        expect(wrapper.text()).toContain('More results');
    });

    it('accepts button text', () => {
        let wrapper = shallowMount(LoadMoreButton, {
            propsData: {
                text: 'test text'
            }
        });
        expect(wrapper.text()).toContain('test text');
    });

    it('emits events', () => {
        let wrapper = shallowMount(LoadMoreButton, {
            propsData: {
                loading: false,
                showMore: true
            }
        });
        wrapper.find('button').trigger('click');
        expect(wrapper.emittedByOrder().map(e => e.name)).toEqual(['click']);
    });

});
