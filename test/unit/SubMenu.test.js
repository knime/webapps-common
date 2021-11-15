import { shallowMount, RouterLinkStub } from '@vue/test-utils';

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
        const wrapper = shallowMount(SubMenu, {
            slots: {
                default: 'buttontext'
            },
            propsData: {
                items: [],
                orientation: 'right'
            }
        });
        expect(wrapper.find('ul[class="orient-right"]').exists()).toBe(true);

        const wrapper2 = shallowMount(SubMenu, {
            slots: {
                default: 'buttontext'
            },
            propsData: {
                items: [],
                orientation: 'left'
            }
        });
        expect(wrapper2.find('ul[class="orient-left"]').exists()).toBe(true);
    });

    it('renders the submenu items', () => {
        const items = [
            { href: 'https://www.google.com/slash', text: 'Google Slash' },
            { href: 'https://www.linkedin.com', text: 'Linked' },
            { to: '/relative/route', text: 'Everything is relative' }
        ];
        const wrapper = shallowMount(SubMenu, {
            propsData: {
                items
            },
            slots: {
                default: 'button me'
            },
            stubs: {
                NuxtLink: RouterLinkStub
            }
        });
        expect(wrapper.find(FunctionButton).text()).toContain('button me');
        expect(wrapper.findAll('li').length).toBe(items.length);

        // Test texts
        items.forEach((item, index) => {
            expect(wrapper.find(`li:nth-child(${index + 1})`).text()).toBe(items[index].text);
        });

        // Test links
        expect(wrapper.find(`li:nth-child(1) a`).attributes('href')).toBe(items[0].href);
        expect(wrapper.find(`li:nth-child(2) a`).attributes('href')).toBe(items[1].href);
        expect(wrapper.find(`li:nth-child(3) a`).props('to')).toBe(items[2].to);
    });

    it('can be disabled', async () => {
        const id = 'testfoobar543';
        const items = [
            { href: 'https://www.google.com/slash', text: 'Google Slash', randomProp: 'test' },
            { href: 'https://www.link.me.in', text: 'Linked Thing', anotherProp: 'foo' }
        ];
        const wrapper = shallowMount(SubMenu, {
            propsData: {
                items,
                id,
                disabled: true
            },
            slots: {
                default: 'button me'
            },
            stubs: {
                NuxtLink: RouterLinkStub
            }
        });
        let button = wrapper.find('.submenu-toggle');
        expect(button.attributes('disabled')).toBeTruthy();
        await wrapper.setProps({ disabled: false });
        expect(button.attributes('disabled')).toBeFalsy();
    });

    it('can display hotkeys', () => {
        const id = 'testfoobar543';
        const items = [
            { href: 'https://www.google.com/slash', text: 'Google Slash', hotkeyText: 'ctrl + 1' },
            { href: 'https://www.link.me.in', text: 'Linked Thing', hotkeyText: 'ctrl +' }
        ];
        const wrapper = shallowMount(SubMenu, {
            propsData: {
                items,
                id,
                showHotkeys: true
            }
        });
        const spans = wrapper.findAll('span');
        const span = spans.at(1);
        expect(span.classes('hotkey')).toBe(true);
    });

    it("doesn't display hotkeys by default", () => {
        const id = 'testfoobar543';
        const items = [
            { href: 'https://www.google.com/slash', text: 'Google Slash', hotkeyText: 'ctrl + 1' },
            { href: 'https://www.link.me.in', text: 'Linked Thing', hotkeyText: 'ctrl +' }
        ];
        const wrapper = shallowMount(SubMenu, {
            propsData: {
                items,
                id
            }
        });
        wrapper.findAll('span').wrappers.forEach(item => {
            expect(item.classes('hotkey').toBe(false));
        });
    });
});
