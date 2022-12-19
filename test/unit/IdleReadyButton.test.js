import { shallowMount, mount } from '@vue/test-utils';

import IdleReadyButton from '../IdleReadyButton.vue';
import Button from '../Button.vue';
import DownIcon from '../../assets/img/icons/circle-arrow-down.svg';

describe('IdleReadyButton.vue', () => {
    it('doesn’t render when not needed', () => {
        let wrapper = shallowMount(IdleReadyButton, {
            props: {
                ready: false,
                idle: false
            }
        });
        expect(wrapper.find('div').exists()).toEqual(false);
    });

    it('handles idle state correctly', () => {
        let wrapper = shallowMount(IdleReadyButton, {
            props: {
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
            props: {
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

    it('renders an icon', () => {
        let wrapper = shallowMount(IdleReadyButton, {
            props: {
                withDownIcon: false
            }
        });
        expect(wrapper.findComponent(DownIcon).exists()).toBeFalsy();

        wrapper = shallowMount(IdleReadyButton, {
            props: {
                withDownIcon: true
            }
        });
        expect(wrapper.findComponent(DownIcon).exists()).toBeTruthy();
    });

    it('renders border', () => {
        let wrapper = shallowMount(IdleReadyButton);
        expect(wrapper.findComponent(Button).attributes('withborder')).toBeDefined();

        wrapper.setProps({
            withBorder: false
        });
        expect(wrapper.findComponent(Button).attributes('withborder')).not.toBeDefined();
    });

    it('emits events', () => {
        let wrapper = mount(IdleReadyButton, {
            props: {
                idle: false,
                ready: true
            }
        });
        wrapper.findComponent(Button).vm.$emit('click');
        expect(wrapper.emittedByOrder().map(e => e.name)).toEqual(['click']);
    });
});
