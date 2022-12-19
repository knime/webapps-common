import { describe, it, expect, beforeEach, vi } from 'vitest';
import { shallowMount, mount, RouterLinkStub } from '@vue/test-utils';

import SubMenu from '../SubMenu.vue';

describe.skip('SubMenu.vue', () => {
    describe('clicking submenu items', () => {
        it('emits item-click', async () => {
            const items = [
                { href: 'https://www.google.com/slash', text: 'Google Slash', randomProp: 'test' },
                { href: 'https://www.link.me.in', text: 'Linked Thing', anotherProp: 'foo' }
            ];
            const id = 'testfoobar543';

            const wrapper = mount(SubMenu, {
                props: {
                    items,
                    id
                },
                slots: {
                    default: 'button me'
                },
                global: {
                    stubs: {
                        NuxtLink: RouterLinkStub
                    }
                }
            });
            // assumes MenuItems use <li>
            await wrapper.findAll('li')[0].trigger('click');
            let event = wrapper.emitted('item-click')[0];
            expect(typeof event[0]).toBe('object'); // event object
            expect(event[1]).toEqual(items[0]);
            expect(event[2]).toEqual(id);

            await wrapper.findAll('li')[1].trigger('click');
            event = wrapper.emitted('item-click')[1];
            expect(typeof event[0]).toBe('object'); // event object
            expect(event[1]).toEqual(items[1]);
            expect(event[2]).toEqual(id);
        });

        describe('enter key behavior', () => {
            it('does click links with enter key', async () => {
                const items = [
                    { href: 'https://www.google.com/slash', text: 'Google Slash', randomProp: 'test' },
                    { to: '/', text: 'Nuxt Link', anotherProp: 'foo' }
                ];
                const id = 'testfoobar543';

                const wrapper = shallowMount(SubMenu, {
                    props: {
                        items,
                        id
                    },
                    slots: {
                        default: 'button me'
                    },
                    global: {
                        stubs: {
                            NuxtLink: RouterLinkStub
                        }
                    }
                });
                let fakeEvent = {
                    code: 'Enter',
                    preventDefault: vi.fn(),
                    stopPropagation: vi.fn(),
                    stopImmediatePropagation: vi.fn()
                };
                await wrapper.vm.onItemClick(fakeEvent, items[0]);
                expect(wrapper.emitted('item-click')).toBeTruthy();
            });

            it('does click buttons with enter key', async () => {
                const items = [
                    { text: 'Google Slash', randomProp: 'test' },
                    { text: 'Nuxt Link', anotherProp: 'foo' }
                ];
                const id = 'testfoobar543';

                const wrapper = shallowMount(SubMenu, {
                    props: {
                        items,
                        id
                    },
                    slots: {
                        default: 'button me'
                    },
                    global: {
                        stubs: {
                            NuxtLink: RouterLinkStub
                        }
                    }
                });
                let fakeEvent = {
                    code: 'Enter',
                    preventDefault: vi.fn(),
                    stopPropagation: vi.fn(),
                    stopImmediatePropagation: vi.fn()
                };
                await wrapper.vm.onItemClick(fakeEvent, items[0]);
                expect(wrapper.emitted('item-click')).toBeTruthy();
            });
        });
    });

    describe('arrow key navigation', () => {
        let arrowKeyNavWrapper, listItems;

        beforeEach(() => {
            const id = 'testfoobar543';
            const items = [
                { href: 'https://www.google.com/slash', text: 'Google Slash', randomProp: 'test' },
                { href: 'https://www.link.me.in', text: 'Linked Thing', anotherProp: 'foo' }
            ];
            arrowKeyNavWrapper = mount(SubMenu, {
                props: {
                    items,
                    id
                },
                slots: {
                    default: 'button me'
                },
                global: {
                    stubs: {
                        NuxtLink: RouterLinkStub
                    }
                },
                attachTo: document.body
            });
            listItems = arrowKeyNavWrapper.vm.$refs.menuItems.$refs.listItem;
        });

        it('focuses first element on key down after expand if orientation bottom', async () => {
            let onDownMock = vi.spyOn(arrowKeyNavWrapper.vm, 'onDown');
            expect(arrowKeyNavWrapper.vm.expanded).toBe(false);
            await arrowKeyNavWrapper.setData({ expanded: true });
            expect(arrowKeyNavWrapper.vm.expanded).toBe(true);
            expect(listItems.length).toBe(2);

            expect(document.activeElement).not.toBe(listItems[0]);

            await arrowKeyNavWrapper.trigger('keydown.down');

            expect(onDownMock).toHaveBeenCalled();
            expect(document.activeElement).toBe(listItems[0]);
        });

        it('does not focus first element on key up after expand if orientation bottom', async () => {
            let onUpMock = vi.spyOn(arrowKeyNavWrapper.vm, 'onUp');
            expect(arrowKeyNavWrapper.vm.expanded).toBe(false);
            await arrowKeyNavWrapper.setData({ expanded: true });
            expect(arrowKeyNavWrapper.vm.expanded).toBe(true);
            expect(listItems.length).toBe(2);
            arrowKeyNavWrapper.vm.$refs['submenu-toggle'].focus();
            expect(document.activeElement).toBe(arrowKeyNavWrapper.vm.$refs['submenu-toggle']);

            await arrowKeyNavWrapper.trigger('keydown.up');

            expect(document.activeElement).not.toBe(listItems[0]);
            expect(document.activeElement).toBe(arrowKeyNavWrapper.vm.$refs['submenu-toggle'].$el);
            expect(onUpMock).toHaveBeenCalled();
        });

        it('focuses first element on key up after expand if orientation top', async () => {
            const id = 'testfoobar543';
            const items = [
                { href: 'https://www.google.com/slash', text: 'Google Slash', randomProp: 'test' },
                { href: 'https://www.link.me.in', text: 'Linked Thing', anotherProp: 'foo' }
            ];
            const wrapper = mount(SubMenu, {
                props: {
                    items,
                    id,
                    orientation: 'top'
                },
                slots: {
                    default: 'button me'
                },
                global: {
                    stubs: {
                        NuxtLink: RouterLinkStub
                    }
                }
            });
            let onUpMock = vi.spyOn(wrapper.vm, 'onUp');
            expect(wrapper.vm.expanded).toBe(false);
            await wrapper.setData({ expanded: true });
            expect(wrapper.vm.expanded).toBe(true);
            expect(listItems.length).toBe(2);

            expect(document.activeElement).not.toBe(listItems[1]);

            await wrapper.trigger('keydown.up');

            expect(document.activeElement).toStrictEqual(listItems[1]);
            expect(onUpMock).toHaveBeenCalled();
        });

        it('does not focus first element on key down after expand if orientation top', async () => {
            const id = 'testfoobar543';
            const items = [
                { href: 'https://www.google.com/slash', text: 'Google Slash', randomProp: 'test' },
                { href: 'https://www.link.me.in', text: 'Linked Thing', anotherProp: 'foo' }
            ];
            const wrapper = mount(SubMenu, {
                props: {
                    items,
                    id,
                    orientation: 'top'
                },
                slots: {
                    default: 'button me'
                },
                global: {
                    stubs: {
                        NuxtLink: RouterLinkStub
                    }
                },
                attachTo: document.body
            });
            let onDownMock = vi.spyOn(wrapper.vm, 'onDown');
            expect(wrapper.vm.expanded).toBe(false);
            await wrapper.setData({ expanded: true });
            expect(wrapper.vm.expanded).toBe(true);
            expect(listItems.length).toBe(2);
            await wrapper.vm.$refs['submenu-toggle'].$el.focus();
            expect(document.activeElement).toBe(wrapper.vm.$refs['submenu-toggle'].$el);

            await wrapper.trigger('keydown.down');

            expect(document.activeElement).not.toBe(listItems[0]);
            expect(document.activeElement).toBe(wrapper.vm.$refs['submenu-toggle'].$el);
            expect(onDownMock).toHaveBeenCalled();
        });
    });

    describe('closing menu', () => {
        let closingMenuWrapper;

        beforeEach(() => {
            const id = 'testfoobar543';
            const items = [
                { href: 'https://www.google.com/slash', text: 'Google Slash', randomProp: 'test' },
                { href: 'https://www.link.me.in', text: 'Linked Thing', anotherProp: 'foo' }
            ];
            closingMenuWrapper = mount(SubMenu, {
                props: {
                    items,
                    id
                },
                slots: {
                    default: 'button me'
                },
                global: {
                    stubs: {
                        NuxtLink: RouterLinkStub
                    }
                },
                attachTo: document.body
            });
        });

        it('closes menu on click', async () => {
            let toggleMenuMock = vi.spyOn(closingMenuWrapper.vm, 'toggleMenu');
            expect(closingMenuWrapper.vm.expanded).toBe(false);
            await closingMenuWrapper.setData({ expanded: true });
            expect(closingMenuWrapper.vm.expanded).toBe(true);

            await closingMenuWrapper.find('.submenu-toggle').trigger('click');

            expect(toggleMenuMock).toHaveBeenCalled();
            expect(closingMenuWrapper.vm.expanded).toBe(false);
        });

        it('closes menu on item click', async () => {
            vi.useFakeTimers();
            let closeMenuMock = vi.spyOn(closingMenuWrapper.vm, 'closeMenu');

            closingMenuWrapper.setData({ expanded: true });
            await closingMenuWrapper.find('ul a').trigger('click');

            vi.runAllTimers();
            expect(closeMenuMock).toHaveBeenCalled();
            expect(closingMenuWrapper.vm.expanded).toBe(false);
        });

        it('does not close menu with enter key', async () => {
            let toggleMenuMock = vi.spyOn(closingMenuWrapper.vm, 'toggleMenu');
            expect(closingMenuWrapper.vm.expanded).toBe(false);
            await closingMenuWrapper.setData({ expanded: true });
            expect(closingMenuWrapper.vm.expanded).toBe(true);
            await closingMenuWrapper.find('.submenu-toggle').trigger('keydown.enter');

            expect(toggleMenuMock).not.toHaveBeenCalled();
            expect(closingMenuWrapper.vm.expanded).toBe(true);
        });

        it('closes menu on escape', async () => {
            vi.useFakeTimers();

            let closeMenuMock = vi.spyOn(closingMenuWrapper.vm, 'closeMenu');
            expect(closingMenuWrapper.vm.expanded).toBe(false);
            await closingMenuWrapper.setData({ expanded: true });
            expect(closingMenuWrapper.vm.expanded).toBe(true);
            await closingMenuWrapper.trigger('keydown.esc');

            vi.runAllTimers();

            expect(closeMenuMock).toHaveBeenCalled();
            expect(closingMenuWrapper.vm.expanded).toBe(false);
            expect(document.activeElement).toBe(closingMenuWrapper.vm.$refs['submenu-toggle'].$el);
        });

        it('closes menu when focus leaves the component', async () => {
            vi.useFakeTimers();

            let refocusMock = vi.spyOn(closingMenuWrapper.vm.$refs['submenu-toggle'], 'focus');
            let onFocusOutMock = vi.spyOn(closingMenuWrapper.vm, 'onFocusOut');
            let closeMenuMock = vi.spyOn(closingMenuWrapper.vm, 'closeMenu');
            expect(closingMenuWrapper.vm.expanded).toBe(false);
            await closingMenuWrapper.setData({ expanded: true });
            expect(closingMenuWrapper.vm.expanded).toBe(true);

            await closingMenuWrapper.trigger('focusout');

            vi.runAllTimers();

            expect(onFocusOutMock).toHaveBeenCalled();
            expect(closeMenuMock).toHaveBeenCalledWith(false);
            expect(refocusMock).not.toHaveBeenCalled();
            expect(closingMenuWrapper.vm.expanded).toBe(false);
        });
    });
});
