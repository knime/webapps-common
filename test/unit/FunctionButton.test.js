import { shallowMount, mount } from '@vue/test-utils';

import FunctionButton from '../FunctionButton.vue';
import BaseButton from '../BaseButton.vue';

describe('FunctionButton.vue', () => {
    it('renders a FunctionButton', () => {
        const wrapper = shallowMount(FunctionButton, {
            slots: {
                default: ['<svg/>', '<span>text</span>']
            }
        });
        expect(wrapper.findComponent(BaseButton).exists()).toBeTruthy();
        expect(wrapper.classes()).toEqual(['function-button']);
    });

    it('forwards props', () => {
        const wrapper = shallowMount(FunctionButton, {
            props: {
                to: 'test-to',
                href: 'test-to'
            },
            slots: {
                default: ['<svg/>', '<span>text</span>']
            }
        });
        expect(wrapper.findComponent(BaseButton).exists()).toBeTruthy();
        expect(wrapper.findComponent(BaseButton).props('to')).toEqual('test-to');
        expect(wrapper.findComponent(BaseButton).props('href')).toEqual('test-to');
    });

    it('renders a class if props is set', () => {
        const wrapper = shallowMount(FunctionButton, {
            props: {
                active: true
            },
            slots: {
                default: ['<span>text</span>', '<svg/>']
            }
        });
        expect(wrapper.classes()).toContain('active');
    });

    it('renders a class if it only has one slot child', () => {
        const wrapper = shallowMount(FunctionButton, {
            slots: {
                default: ['<svg/>']
            }
        });
        expect(wrapper.classes()).toContain('single');
    });

    it('renders a classes if props is set and one child is present', () => {
        const wrapper = shallowMount(FunctionButton, {
            props: {
                active: true
            },
            slots: {
                default: ['<span>text</span>']
            }
        });
        expect(wrapper.classes()).toContain('single');
        expect(wrapper.classes()).toContain('active');
    });

    it('triggers events', () => {
        const clicker = vi.fn();
        const wrapper = mount(FunctionButton, {
            props: {
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
        const wrapper = mount(FunctionButton, {
            slots: {
                default: ['<span>text</span>']
            }
        });
        wrapper.vm.focus();
        expect(document.activeElement).toBe(wrapper.vm.$el);
    });

    it('renders disabled button', () => {
        const wrapper = mount(FunctionButton, {
            props: {
                disabled: true
            },
            slots: {
                default: ['<span>text</span>']
            }
        });
        expect(wrapper.classes()).toContain('disabled');
    });
});
