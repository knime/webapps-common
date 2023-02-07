/* eslint-disable max-nested-callbacks */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { shallowMount, RouterLinkStub } from '@vue/test-utils';

import MenuItems from '../MenuItems.vue';

describe('MenuItems.vue', () => {
    it('renders the items', () => {
        const items = [
            { href: 'https://www.google.com/slash', text: 'Google Slash' },
            { href: 'https://www.linkedin.com', text: 'Linked' },
            { to: '/relative/route', text: 'Everything is relative' }
        ];
        const wrapper = shallowMount(MenuItems, {
            props: {
                ariaLabel: 'label',
                items
            },
            global: {
                stubs: {
                    NuxtLink: RouterLinkStub
                }
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
        expect(wrapper.findComponent(`li:nth-child(3) a`).props('to')).toBe(items[2].to);
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
            props: {
                ariaLabel: 'label',
                items
            }
        });
        expect(wrapper.html()).toBeTruthy();
        const menuEntries = wrapper.findAll('.clickable-item');
        const menuEntry1 = menuEntries[1];
        expect(menuEntry1.classes()).toContain('disabled');
        expect(menuEntry1.attributes('tabindex')).toBeFalsy();
        expect(menuEntries[0].attributes('tabindex')).toBe('0');
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
            props: {
                ariaLabel: 'label',
                items
            }
        });
        expect(wrapper.html()).toBeTruthy();
        const menuLineItems = wrapper.findAll('li');
        expect(menuLineItems[0].classes()).toContain('separator');
        expect(menuLineItems[1].classes()).not.toContain('separator');
        expect(menuLineItems[2].classes()).toContain('separator');
    });

    it('renders with sectionHeadlines', () => {
        const items = [{
            text: 'Apples',
            disabled: false,
            separator: true,
            sectionHeadline: true
        }, {
            text: 'Oranges',
            disabled: true,
            sectionHeadline: true,
            separator: true
        }, {
            text: 'Ananas',
            hotkeyText: 'F9'
        }];
        const wrapper = shallowMount(MenuItems, {
            props: {
                ariaLabel: 'label',
                items
            }
        });
        expect(wrapper.html()).toBeTruthy();
        const listItems = wrapper.findAll('.list-item');
        expect(listItems[0].classes()).toContain('section-headline');
        expect(listItems[1].classes()).toContain('section-headline');
        expect(listItems[2].classes()).not.toContain('section-headline');
    });

    it('renders with selected items', () => {
        const items = [{
            text: 'Apples',
            disabled: false,
            selected: true
        }, {
            text: 'Oranges',
            disabled: true
        }, {
            text: 'Ananas',
            hotkeyText: 'F9'
        }];
        const wrapper = shallowMount(MenuItems, {
            props: {
                ariaLabel: 'label',
                items
            }
        });
        expect(wrapper.html()).toBeTruthy();
        const clickableItems = wrapper.findAll('.clickable-item');
        expect(clickableItems[0].classes()).toContain('selected');
        expect(clickableItems[1].classes()).not.toContain('selected');
        expect(clickableItems[2].classes()).not.toContain('selected');
    });

    it('has a function returning the next markable element and its index', () => {
        const items = [{
            text: 'Apples',
            disabled: false,
            selected: true
        }, {
            text: 'Oranges',
            disabled: true
        }, {
            text: 'Ananas',
            hotkeyText: 'F9'
        }];
        const wrapper = shallowMount(MenuItems, {
            props: {
                ariaLabel: 'label',
                items
            }
        });
        const firstResult = {
            element: wrapper.find('li > *').element,
            index: 0
        };
        const secondResult = {
            element: wrapper.findAll('li')[2].find('*').element,
            index: 2
        };
        expect(wrapper.vm.getNextElementWithIndex(-1, 1)).toStrictEqual(firstResult);
        expect(wrapper.vm.getNextElementWithIndex(0, 1)).toStrictEqual(secondResult);
        expect(wrapper.vm.getNextElementWithIndex(2, 1)).toStrictEqual(firstResult);
        expect(wrapper.vm.getNextElementWithIndex(-1, -1)).toStrictEqual(secondResult);
        expect(wrapper.vm.getNextElementWithIndex(2, -1)).toStrictEqual(firstResult);
        expect(wrapper.vm.getNextElementWithIndex(0, -1)).toStrictEqual(secondResult);
    });

    it('can display hotkeys', () => {
        const id = 'testfoobar543';
        const items = [
            { href: 'https://www.google.com/slash', text: 'Google Slash', hotkeyText: 'ctrl + 1' },
            { href: 'https://www.link.me.in', text: 'Linked Thing', hotkeyText: 'ctrl +' }
        ];
        const wrapper = shallowMount(MenuItems, {
            props: {
                ariaLabel: 'label',
                items,
                id
            }
        });
        const spans = wrapper.findAll('span');
        const span = spans[1];
        expect(span.classes('hotkey')).toBe(true);
    });

    it(`doesn't display hotkeys by default`, () => {
        const id = 'testfoobar543';
        const items = [
            { href: 'https://www.google.com/slash', text: 'Google Slash' },
            { href: 'https://www.link.me.in', text: 'Linked Thing' }
        ];
        const wrapper = shallowMount(MenuItems, {
            props: {
                ariaLabel: 'label',
                items,
                id
            }
        });
        wrapper.findAll('span').forEach(item => {
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
            props: {
                ariaLabel: 'label',
                items,
                id
            }
        });
        expect(wrapper.findAll('li')[0].attributes('title')).toMatch('This is an example title');
        expect(wrapper.findAll('li')[1].attributes('title')).toBeUndefined();
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
                props: {
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
            it('focus first', () => {
                expect(document.activeElement.textContent).not.toBe('First');
                wrapper.vm.focusFirst();

                expect(document.activeElement.textContent).toBe('First');
            });

            it('focus last', () => {
                expect(document.activeElement.textContent).not.toBe('Third');
                wrapper.vm.focusLast();

                expect(document.activeElement.textContent).toBe('Third');
            });

            it('arrow up', () => {
                wrapper.vm.focusFirst();
                wrapper.trigger('keydown.down');

                expect(document.activeElement.textContent).toBe('Third');
            });

            it('arrow down', () => {
                wrapper.vm.focusLast();
                wrapper.trigger('keydown.up');

                expect(document.activeElement.textContent).toBe('First');
            });

            it('arrow up wrap-around', () => {
                wrapper.vm.focusFirst();
                wrapper.trigger('keydown.up');

                expect(document.activeElement.textContent).toBe('Third');
            });

            it('arrow down wrap-around', () => {
                wrapper.vm.focusLast();
                wrapper.trigger('keydown.down');

                expect(document.activeElement.textContent).toBe('First');
            });

            it.skip('arrow up with prevented wrap-around', () => {
                wrapper.vm.focusFirst();

                wrapper.vm.$on('top-reached', (e) => {
                    e.preventDefault();
                });
                wrapper.trigger('keydown.up');

                expect(document.activeElement.textContent).toBe('First');
            });

            it.skip('arrow down with prevented wrap-around', () => {
                wrapper.vm.focusLast();
                
                wrapper.vm.$on('bottom-reached', (e) => {
                    e.preventDefault();
                });
                wrapper.trigger('keydown.down');

                expect(document.activeElement.textContent).toContain('Third');
            });
        });

        describe('events', () => {
            it('@item-active on list items', () => {
                let listElements = wrapper.findAll('li');

                // enabled element
                listElements[0].trigger('focusin');
                expect(wrapper.emitted('item-active')[0]).toStrictEqual([items[0], 'menu']);

                listElements[0].trigger('pointerenter');
                expect(wrapper.emitted('item-active')[1]).toStrictEqual([items[0], 'menu']);

                // disabled element
                listElements[1].trigger('focusin');
                expect(wrapper.emitted('item-active')[2]).toStrictEqual([null, 'menu']);

                listElements[1].trigger('pointerenter');
                expect(wrapper.emitted('item-active')[2]).toStrictEqual([null, 'menu']);
            });

            it('@item-active on the menu', () => {
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
