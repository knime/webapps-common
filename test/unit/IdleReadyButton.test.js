import { shallowMount, mount } from '@vue/test-utils';

import IdleReadyButton from '~/ui/components/IdleReadyButton';
import Button from '~/ui/components/Button';

describe('IdleReadyButton.vue', () => {

    it('doesn’t render when not needed', () => {
        let wrapper = shallowMount(IdleReadyButton, {
            propsData: {
                showMore: false,
                loading: false
            }
        });
        expect(wrapper.find('div').exists()).toEqual(false);
    });

    it('handles loading state correctly', () => {
        let wrapper = shallowMount(IdleReadyButton, {
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
        let wrapper = shallowMount(IdleReadyButton, {
            propsData: {
                text: 'test text'
            }
        });
        expect(wrapper.text()).toContain('test text');
    });

    it('emits events', () => {
        let wrapper = mount(IdleReadyButton, {
            propsData: {
                loading: false,
                showMore: true
            }
        });
        wrapper.find(Button).trigger('click');
        expect(wrapper.emittedByOrder().map(e => e.name)).toEqual(['click']);
    });

});
