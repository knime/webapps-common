import { shallowMount, mount } from '@vue/test-utils';

import MenuToggle from '~/ui/components/MenuToggle';
import BaseButton from '~/ui/components/BaseButton';

describe('MenuToggle.vue', () => {
    it('renders a menuToggle', () => {
        const wrapper = shallowMount(MenuToggle, {
            slots: {
                default: ['<svg/>', '<span>text</span>']
            }
        });
        expect(wrapper.find(BaseButton).exists()).toBeTruthy();
        expect(wrapper.classes()).toEqual(['toggle']);

    });

    it('renders a class if props is set', () => {
        const wrapper = shallowMount(MenuToggle, {
            propsData: {
                active: true
            },
            slots: {
                default: ['<span>text</span>', '<svg/>']
            }
        });
        expect(wrapper.classes()).toEqual(['toggle', 'active']);
    });

    it('renders a class if it only has one slot child', () => {
        const wrapper = shallowMount(MenuToggle, {
            slots: {
                default: ['<svg/>']
            }
        });
        expect(wrapper.classes()).toEqual(['toggle', 'single']);
    });

    it('renders a classes if props is set and one child is present', () => {
        const wrapper = shallowMount(MenuToggle, {
            propsData: {
                active: true
            },
            slots: {
                default: ['<span>text</span>']
            }
        });
        expect(wrapper.classes()).toEqual(['toggle', 'single', 'active']);
    });

    it('triggers events', () => {
        const clicker = jest.fn();
        const wrapper = mount(MenuToggle, {
            propsData: {
                active: true
            },
            slots: {
                default: ['<span>text</span>']
            },
            listeners: {
                click: clicker
            }
        });
        wrapper.trigger('click');
        expect(clicker).toHaveBeenCalled();
    });

    it('gets focused when focus method is called', () => {
        const wrapper = mount(MenuToggle, {
            slots: {
                default: ['<span>text</span>']
            }
        });
        wrapper.vm.focus();
        expect(document.activeElement).toBe(wrapper.vm.$el);
    });

});
