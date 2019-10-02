import { shallowMount, RouterLinkStub } from '@vue/test-utils';

import Submenu from '~/ui/components/Submenu';

describe('Submenu.vue', () => {

    it('renders the button', () => {
        const wrapper = shallowMount(Submenu, {
            slots: {
                default: '<svg />click me please <strong>right there</strong>'
            },
            propsData: {
                items: []
            }
        });
        expect(wrapper.find('button svg').exists()).toBeTruthy();
        expect(wrapper.find('button').text()).toContain('click me please right there');
    });

    it('renders the submenu items', () => {
        const items =  [
            { href: 'https://www.google.com/slash', text: 'Google Slash' },
            { href: 'https://www.linkedin.com', text: 'Linked' },
            { to: '/relative/route', text: 'Everything is relative' }
        ];
        const wrapper = shallowMount(Submenu, {
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
        expect(wrapper.find('button').text()).toContain('button me');
        expect(wrapper.findAll('li').length).toBe(items.length);

        // Test texts
        items.forEach((item, index) => {
            expect(wrapper.find(`li:nth-child(${index + 1})`).text()).toBe(items[index].text);
        });

        // Test links
        expect(wrapper.find(`li:nth-child(1) a`).attributes('href')).toBe(items[0].href);
        expect(wrapper.find(`li:nth-child(2) a`).attributes('href')).toBe(items[1].href);
        expect(wrapper.find(`li:nth-child(3) a`).props('to')).toBe(items[2].to);
        expect(wrapper.find(`li:nth-child(3) a`).attributes('href')).toBe('');

    });


});
