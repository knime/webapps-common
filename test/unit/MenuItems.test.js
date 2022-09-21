/* eslint-disable max-nested-callbacks */
import { shallowMount, RouterLinkStub } from '@vue/test-utils';
import MenuItems from '~/ui/components/MenuItems.vue';

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

    it('renders with separators', () => {
        const items = [{
            text: 'Apples',
            disabled: false,
            separator: true
        }, {
            text: 'Oranges',
            disabled: true
        }, {
            text: 'Ananas',
            hotkeyText: 'F9',
            separator: true
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
        const menuLineItems = wrapper.findAll('li');
        expect(menuLineItems.at(0).classes()).toContain('separator');
        expect(menuLineItems.at(1).classes()).not.toContain('separator');
        expect(menuLineItems.at(2).classes()).toContain('separator');
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

    it('displays a title for items', () => {
        const id = 'testfoobar543';
        const items = [
            { href: 'https://www.google.com/slash', text: 'Google Slash', title: 'This is an example title' },
            { href: 'https://www.link.me.in', text: 'Linked Thing' }
        ];
        const wrapper = shallowMount(MenuItems, {
            propsData: {
                ariaLabel: 'label',
                items,
                id
            }
        });
        expect(wrapper.findAll('li').at(0).attributes('title')).toMatch('This is an example title');
        expect(wrapper.findAll('li').at(1).attributes('title')).toBeUndefined();
    });

    describe('interactions', () => {
        let items, wrapper;

        beforeEach(() => {
            items = [
                { text: 'First' },
                { text: 'Second', disabled: true },
                { text: 'Third' }
            ];

            wrapper = shallowMount(MenuItems, {
                propsData: {
                    ariaLabel: 'label',
                    items,
                    id: 'menu'
                },
                attachTo: document.body
            });
        });

        afterEach(() => {
            document.body.focus();
        });

        describe('focus and keyboard navigation', () => {
            test('focus first', () => {
                expect(document.activeElement.textContent).not.toContain('First');
                wrapper.vm.focusFirst();

                expect(document.activeElement.textContent).toContain('First');
            });

            test('focus last', () => {
                expect(document.activeElement.textContent).not.toContain('Third');
                wrapper.vm.focusLast();

                expect(document.activeElement.textContent).toContain('Third');
            });

            test('arrow up', () => {
                wrapper.vm.focusFirst();
                wrapper.trigger('keydown.down');

                expect(document.activeElement.textContent).toContain('Third');
            });

            test('arrow down', () => {
                wrapper.vm.focusLast();
                wrapper.trigger('keydown.up');

                expect(document.activeElement.textContent).toContain('First');
            });

            test('arrow up wrap-around', () => {
                wrapper.vm.focusFirst();
                wrapper.trigger('keydown.up');

                expect(document.activeElement.textContent).toContain('Third');
            });

            test('arrow down wrap-around', () => {
                wrapper.vm.focusLast();
                wrapper.trigger('keydown.down');

                expect(document.activeElement.textContent).toContain('First');
            });

            test('arrow up with prevented wrap-around', () => {
                wrapper.vm.focusFirst();
                
                wrapper.vm.$on('top-reached', (e) => {
                    e.preventDefault();
                });
                wrapper.trigger('keydown.up');

                expect(document.activeElement.textContent).toContain('First');
            });

            test('arrow down with prevented wrap-around', () => {
                wrapper.vm.focusLast();
                
                wrapper.vm.$on('bottom-reached', (e) => {
                    e.preventDefault();
                });
                wrapper.trigger('keydown.down');

                expect(document.activeElement.textContent).toContain('Third');
            });
        });

        describe('events', () => {
            test('@item-active on list items', () => {
                let listElements = wrapper.findAll('li');

                // enabled element
                listElements.at(0).trigger('focusin');
                expect(wrapper.emitted('item-active')[0]).toStrictEqual([items[0], 'menu']);

                listElements.at(0).trigger('pointerenter');
                expect(wrapper.emitted('item-active')[1]).toStrictEqual([items[0], 'menu']);

                // disabled element
                listElements.at(1).trigger('focusin');
                expect(wrapper.emitted('item-active')[2]).toStrictEqual([null, 'menu']);

                listElements.at(1).trigger('pointerenter');
                expect(wrapper.emitted('item-active')[2]).toStrictEqual([null, 'menu']);
            });

            test('@item-active on the menu', () => {
                let menu = wrapper.find('ul');

                // enabled element
                menu.trigger('focusout');
                expect(wrapper.emitted('item-active')[0]).toStrictEqual([null, 'menu']);

                menu.trigger('pointerleave');
                expect(wrapper.emitted('item-active')[1]).toStrictEqual([null, 'menu']);
            });
        });
    });
});
