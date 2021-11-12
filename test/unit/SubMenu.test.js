import { mount, shallowMount } from '@vue/test-utils';

import SubMenu from '~/ui/components/SubMenu';
import FunctionButton from '~/ui/components/FunctionButton';

describe('SubMenu.vue', () => {
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
    });

    it('orients the submenu to the button', () => {
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

        const wrapper2 = mount(SubMenu, {
            slots: {
                default: 'buttontext'
            },
            propsData: {
                items: [],
                orientation: 'left'
            }
        });
        expect(wrapper2.find('.menu-items.orient-left').exists()).toBe(true);
    });
});
