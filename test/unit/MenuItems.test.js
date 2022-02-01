import { shallowMount, RouterLinkStub } from '@vue/test-utils';

import MenuItems from '~/ui/components/MenuItems';

describe('MenuItems.vue', () => {
    it('renders the items', () => {
        const items = [
            { href: 'https://www.google.com/slash', text: 'Google Slash' },
            { href: 'https://www.linkedin.com', text: 'Linked' },
            { to: '/relative/route', text: 'Everything is relative' }
        ];
        const wrapper = shallowMount(MenuItems, {
            propsData: {
                ariaLabel: 'label',
                items
            },
            stubs: {
                NuxtLink: RouterLinkStub
            }
        });
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

    it('renders with disabled items', () => {
        const items = [{
            text: 'Apples',
            disabled: false,
            hotkeyText: 'CTRL + A'
        }, {
            text: 'Oranges',
            userData: {
                storeAction: 'oranges/execute'
            },
            disabled: true
        }, {
            text: 'Ananas',
            hotkeyText: 'F9'
        }];
        const wrapper = shallowMount(MenuItems, {
            propsData: {
                ariaLabel: 'label',
                items
            },
            stubs: {
                NuxtLink: RouterLinkStub
            }
        });
        expect(wrapper.html()).toBeTruthy();
        const menuEntries = wrapper.findAll('.clickable-item');
        const menuEntry1 = menuEntries.at(1);
        expect(menuEntry1.classes()).toContain('disabled');
        expect(menuEntry1.attributes('tabindex')).toBeFalsy();
        expect(menuEntries.at(0).attributes('tabindex')).toBe('0');
    });

    it('can display hotkeys', () => {
        const id = 'testfoobar543';
        const items = [
            { href: 'https://www.google.com/slash', text: 'Google Slash', hotkeyText: 'ctrl + 1' },
            { href: 'https://www.link.me.in', text: 'Linked Thing', hotkeyText: 'ctrl +' }
        ];
        const wrapper = shallowMount(MenuItems, {
            propsData: {
                ariaLabel: 'label',
                items,
                id
            }
        });
        const spans = wrapper.findAll('span');
        const span = spans.at(1);
        expect(span.classes('hotkey')).toBe(true);
    });

    it('doesn\'t display hotkeys by default', () => {
        const id = 'testfoobar543';
        const items = [
            { href: 'https://www.google.com/slash', text: 'Google Slash' },
            { href: 'https://www.link.me.in', text: 'Linked Thing' }
        ];
        const wrapper = shallowMount(MenuItems, {
            propsData: {
                ariaLabel: 'label',
                items,
                id
            }
        });
        wrapper.findAll('span').wrappers.forEach(item => {
            expect(item.classes('hotkey')).toBe(false);
        });
    });
});
