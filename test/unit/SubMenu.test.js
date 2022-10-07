import { mount, shallowMount } from '@vue/test-utils';
import { createPopper as createPopperMock } from '@popperjs/core';

import SubMenu from '~/ui/components/SubMenu.vue';
import FunctionButton from '~/ui/components/FunctionButton.vue';

jest.mock('@popperjs/core');

describe('SubMenu.vue', () => {
    const setOptionsMock = jest.fn();
    createPopperMock.mockImplementation(() => ({ setOptions: setOptionsMock }));

    it('renders the menu toggle', () => {
        const wrapper = shallowMount(SubMenu, {
            slots: {
                default: '<svg />click me please <strong>right there</strong>'
            },
            propsData: {
                items: [],
                buttonTitle: 'test button title'
            }
        });
        expect(wrapper.find(FunctionButton).find('svg').exists()).toBeTruthy();
        expect(wrapper.find(FunctionButton).text()).toContain('click me please right there');
        expect(wrapper.find(FunctionButton).attributes('title')).toBe('test button title');
        expect(createPopperMock).toHaveBeenCalled();
    });

    it('orients the submenu to the button', async () => {
        const wrapper = mount(SubMenu, {
            slots: {
                default: 'buttontext'
            },
            propsData: {
                items: [],
                orientation: 'right'
            }
        });
        expect(wrapper.find('.menu-items.orient-right').exists()).toBe(true);
        await wrapper.setProps({ orientation: 'left' });

        expect(wrapper.find('.menu-items.orient-left').exists()).toBe(true);
        expect(setOptionsMock).toHaveBeenCalled();
    });
});
