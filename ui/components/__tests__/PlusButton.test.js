import { describe, it, expect, vi } from 'vitest';
import { shallowMount, mount } from '@vue/test-utils';

import PlusButton from '../PlusButton.vue';
import Button from '../Button.vue';
import Tooltip from '../Tooltip.vue';
import PlusIcon from '../../assets/img/icons/plus-small.svg';

describe('PlusButton.vue', () => {
    it('renders plus button', () => {
        const wrapper = shallowMount(PlusButton);

        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.isVisible()).toBeTruthy();

        expect(wrapper.findComponent(Button).exists()).toBeTruthy();
        expect(wrapper.findComponent(Button).classes()).toEqual(['plus-button']);
        expect(wrapper.findComponent(PlusIcon).exists()).toBeTruthy();
    });

    it('forwards listeners', () => {
        let wrapper = shallowMount(PlusButton, {
            attrs: {
                onfakeevent: vi.fn()
            }
        });
        expect(wrapper.findComponent(Button).attributes('onfakeevent')).toBeDefined();
    });

    it('forwards props', () => {
        const wrapper = mount(PlusButton, {
            props: {
                primary: true,
                onDark: true
            }
        });
        expect(wrapper.findComponent(Button).props('primary')).toEqual(true);
        expect(wrapper.findComponent(Button).props('onDark')).toEqual(true);
    });

    it('renders disabled state', () => {
        let wrapper = shallowMount(PlusButton, {
            props: {
                disabled: true
            }
        });
        expect(wrapper.findComponent(Button).attributes('disabled')).toEqual('true');
    });

    it('renders tooltip', () => {
        const wrapper = shallowMount(PlusButton, {
            props: {
                title: 'plus button'
            }
        });
        expect(wrapper.props('title')).toEqual('plus button');
        expect(wrapper.findComponent(Tooltip).exists()).toBeTruthy();
    });

    it('does not render tooltip', () => {
        const wrapper = shallowMount(PlusButton);
        expect(wrapper.props('title')).toEqual(null);
        expect(wrapper.findComponent(Tooltip).exists()).toBeFalsy();
    });
});
