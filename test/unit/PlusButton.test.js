import { shallowMount, mount } from '@vue/test-utils';

import PlusButton from '~/ui/components/PlusButton.vue';
import Button from '~/ui/components/Button.vue';
import Tooltip from '~/ui/components/Tooltip.vue';
import PlusIcon from '~/ui/assets/img/icons/plus-small.svg';

describe('PlusButton.vue', () => {
    it('renders plus button', () => {
        const wrapper = shallowMount(PlusButton);

        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.isVisible()).toBeTruthy();

        expect(wrapper.find(Button).exists()).toBeTruthy();
        expect(wrapper.find(Button).classes()).toEqual(['plus-button']);
        expect(wrapper.find(PlusIcon).exists()).toBeTruthy();
    });

    it('forwards listeners', () => {
        let wrapper = shallowMount(PlusButton, {
            listeners: {
                fakeEvent: jest.fn()
            }
        });
        expect(wrapper.find(Button).vm.$listeners).toHaveProperty('fakeEvent');
    });

    it('forwards props', () => {
        const wrapper = mount(PlusButton, {
            propsData: {
                primary: true,
                onDark: true
            }
        });
        expect(wrapper.find(Button).props('primary')).toEqual(true);
        expect(wrapper.find(Button).props('onDark')).toEqual(true);
    });

    it('renders disabled state', () => {
        let wrapper = shallowMount(PlusButton, {
            propsData: {
                disabled: true
            }
        });
        expect(wrapper.find(Button).attributes('disabled')).toEqual('true');
    });

    it('renders tooltip', () => {
        const wrapper = shallowMount(PlusButton, {
            propsData: {
                title: 'plus button'
            }
        });
        expect(wrapper.props('title')).toEqual('plus button');
        expect(wrapper.find(Tooltip).exists()).toBeTruthy();
    });

    it('does not renders tooltip', () => {
        const wrapper = shallowMount(PlusButton);
        expect(wrapper.props('title')).toEqual(null);
        expect(wrapper.find(Tooltip).exists()).toBeFalsy();
    });
});
