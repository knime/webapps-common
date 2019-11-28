import { shallowMount, mount } from '@vue/test-utils';

import IdleReadyButton from '~/ui/components/IdleReadyButton';
import Button from '~/ui/components/Button';

describe('IdleReadyButton.vue', () => {

    it('doesn’t render when not needed', () => {
        let wrapper = shallowMount(IdleReadyButton, {
            propsData: {
                ready: false,
                idle: false
            }
        });
        expect(wrapper.find('div').exists()).toEqual(false);
    });

    it('handles idle state correctly', () => {
        let wrapper = shallowMount(IdleReadyButton, {
            propsData: {
                ready: true,
                idle: true
            }
        });
        expect(wrapper.text()).toContain('Loading...');
        expect(wrapper.text()).not.toContain('More results');

        // Idle complete
        wrapper.setProps({ idle: false });
        expect(wrapper.text()).not.toContain('Loading...');
        expect(wrapper.text()).toContain('More results');
    });

    it('accepts button text', () => {
        let wrapper = shallowMount(IdleReadyButton, {
            propsData: {
                readyText: 'test text',
                idleText: 'Idle',
                idle: true
            }
        });
        expect(wrapper.text()).toContain('Idle');

        // Idle complete
        wrapper.setProps({ idle: false });
        expect(wrapper.text()).not.toContain('Idle');
        expect(wrapper.text()).toContain('test text');
    });

    it('emits events', () => {
        let wrapper = mount(IdleReadyButton, {
            propsData: {
                idle: false,
                ready: true
            }
        });
        wrapper.find(Button).vm.$emit('click');
        expect(wrapper.emittedByOrder().map(e => e.name)).toEqual(['click']);
    });

});
