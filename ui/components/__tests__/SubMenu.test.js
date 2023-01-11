import { describe, it, expect, vi } from 'vitest';
import { mount, shallowMount } from '@vue/test-utils';

import { createPopper as createPopperMock } from '@popperjs/core/dist/esm';

import SubMenu from '../SubMenu.vue';
import MenuItems from '../MenuItems.vue';
import FunctionButton from '../FunctionButton.vue';

vi.mock('@popperjs/core/dist/esm');

describe('SubMenu.vue', () => {
    const setOptionsMock = vi.fn();
    createPopperMock.mockImplementation(() => ({ setOptions: setOptionsMock }));

    it('renders the menu toggle', () => {
        const wrapper = shallowMount(SubMenu, {
            slots: {
                default: '<svg />click me please <strong>right there</strong>'
            },
            props: {
                items: [],
                buttonTitle: 'test button title'
            }
        });
        expect(wrapper.findComponent(FunctionButton).find('svg').exists()).toBeTruthy();
        expect(wrapper.findComponent(FunctionButton).text()).toContain('click me please right there');
        expect(wrapper.findComponent(FunctionButton).attributes('title')).toBe('test button title');
        expect(createPopperMock).toHaveBeenCalled();
    });

    it('orients the submenu to the button', async () => {
        const wrapper = mount(SubMenu, {
            slots: {
                default: 'buttontext'
            },
            props: {
                items: [],
                orientation: 'right'
            }
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.findComponent(MenuItems).find('.menu-items.orient-right').exists()).toBe(true);
        await wrapper.setProps({ orientation: 'left' });

        expect(wrapper.findComponent(MenuItems).find('.menu-items.orient-left').exists()).toBe(true);
        expect(setOptionsMock).toHaveBeenCalled();
    });
});
