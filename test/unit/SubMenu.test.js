import { shallowMount, RouterLinkStub } from '@vue/test-utils';

import SubMenu from '~/ui/components/SubMenu';

describe('Submenu.vue', () => {

    it('renders the button', () => {
        const wrapper = shallowMount(SubMenu, {
            slots: {
                default: '<svg />click me please <strong>right there</strong>'
            },
            propsData: {
                items: [],
                buttonTitle: 'test button title'
            }
        });
        expect(wrapper.find('button svg').exists()).toBeTruthy();
        expect(wrapper.find('button').text()).toContain('click me please right there');
        expect(wrapper.find('button').attributes('title')).toBe('test button title');
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
        const items =  [
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

    });

    it('emits on click', () => {
        const items =  [
            { href: 'https://www.google.com/slash', text: 'Google Slash', randomProp: 'test' },
            { href: 'https://www.link.me.in', text: 'Linked Thing', anotherProp: 'foo' }
        ];
        const id = 'testfoobar543';

        const wrapper = shallowMount(SubMenu, {
            propsData: {
                items,
                id
            },
            slots: {
                default: 'button me'
            },
            stubs: {
                NuxtLink: RouterLinkStub
            }
        });
        wrapper.findAll('li').at(0).trigger('click');
        expect(typeof wrapper.emittedByOrder()[0].args[0]).toBe('object'); // event object
        expect(wrapper.emittedByOrder()[0].args[1]).toEqual(items[0]);
        expect(wrapper.emittedByOrder()[0].args[2]).toEqual(id);

        wrapper.findAll('li').at(1).trigger('click');
        expect(typeof wrapper.emittedByOrder()[1].args[0]).toBe('object'); // event object
        expect(wrapper.emittedByOrder()[1].args[1]).toEqual(items[1]);
        expect(wrapper.emittedByOrder()[1].args[2]).toEqual(id);

    });

    it('emits on blur', () => {
        const id = 'testfoobar543';
        const items =  [
            { href: 'https://www.google.com/slash', text: 'Google Slash', randomProp: 'test' },
            { href: 'https://www.link.me.in', text: 'Linked Thing', anotherProp: 'foo' }
        ];
        const wrapper = shallowMount(SubMenu, {
            propsData: {
                items,
                id
            },
            slots: {
                default: 'button me'
            },
            stubs: {
                NuxtLink: RouterLinkStub
            }
        });
        let button = wrapper.find('.submenu-toggle');
        button.trigger('click');
        button.trigger('blur');
        expect(wrapper.find('.clickable-item').exists()).toBe(true);
        expect(document.activeElement).toBe(button.element);
    });
});
