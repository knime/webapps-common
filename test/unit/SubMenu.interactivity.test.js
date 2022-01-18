import { shallowMount, mount, RouterLinkStub } from '@vue/test-utils';

import SubMenu from '~/ui/components/SubMenu';

describe('SubMenu.vue', () => {
    describe('clicking submenu items', () => {
        it('emits item-click', () => {
            const items = [
                { href: 'https://www.google.com/slash', text: 'Google Slash', randomProp: 'test' },
                { href: 'https://www.link.me.in', text: 'Linked Thing', anotherProp: 'foo' }
            ];
            const id = 'testfoobar543';

            const wrapper = mount(SubMenu, {
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
            // assumes MenuItems use <li>
            wrapper.findAll('li').at(0).trigger('click');
            expect(typeof wrapper.emittedByOrder()[0].args[0]).toBe('object'); // event object
            expect(wrapper.emittedByOrder()[0].args[1]).toEqual(items[0]);
            expect(wrapper.emittedByOrder()[0].args[2]).toEqual(id);

            wrapper.findAll('li').at(1).trigger('click');
            expect(typeof wrapper.emittedByOrder()[1].args[0]).toBe('object'); // event object
            expect(wrapper.emittedByOrder()[1].args[1]).toEqual(items[1]);
            expect(wrapper.emittedByOrder()[1].args[2]).toEqual(id);
        });

        describe('enter key behavior', () => {
            it('does click links with enter key', () => {
                const items = [
                    { href: 'https://www.google.com/slash', text: 'Google Slash', randomProp: 'test' },
                    { to: '/', text: 'Nuxt Link', anotherProp: 'foo' }
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
                let fakeEvent = {
                    code: 'Enter',
                    preventDefault: jest.fn(),
                    stopPropagation: jest.fn(),
                    stopImmediatePropagation: jest.fn()
                };
                wrapper.vm.onItemClick(fakeEvent, items[0]);
                expect(wrapper.emitted('item-click')).toBeTruthy();
            });

            it('does click buttons with enter key', () => {
                const items = [
                    { text: 'Google Slash', randomProp: 'test' },
                    { text: 'Nuxt Link', anotherProp: 'foo' }
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
                let fakeEvent = {
                    code: 'Enter',
                    preventDefault: jest.fn(),
                    stopPropagation: jest.fn(),
                    stopImmediatePropagation: jest.fn()
                };
                wrapper.vm.onItemClick(fakeEvent, items[0]);
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
            listItems = arrowKeyNavWrapper.vm.$refs.menuItems.listItems;
        });

        it('focuses first element on key down after expand if orientation bottom', () => {
            let onDownMock = jest.spyOn(arrowKeyNavWrapper.vm, 'onDown');
            expect(arrowKeyNavWrapper.vm.expanded).toBe(false);
            arrowKeyNavWrapper.setData({ expanded: true });
            expect(arrowKeyNavWrapper.vm.expanded).toBe(true);
            expect(listItems.length).toBe(2);

            expect(document.activeElement).not.toBe(listItems[0]);

            arrowKeyNavWrapper.trigger('keydown.down');

            expect(onDownMock).toHaveBeenCalled();
            expect(document.activeElement).toBe(listItems[0]);
        });

        it('does not focus first element on key up after expand if orientation bottom', () => {
            let onUpMock = jest.spyOn(arrowKeyNavWrapper.vm, 'onUp');
            expect(arrowKeyNavWrapper.vm.expanded).toBe(false);
            arrowKeyNavWrapper.setData({ expanded: true });
            expect(arrowKeyNavWrapper.vm.expanded).toBe(true);
            expect(listItems.length).toBe(2);
            arrowKeyNavWrapper.vm.$refs['submenu-toggle'].$el.focus();
            expect(document.activeElement).toBe(arrowKeyNavWrapper.vm.$refs['submenu-toggle'].$el);

            arrowKeyNavWrapper.trigger('keydown.up');

            expect(document.activeElement).not.toBe(listItems[0]);
            expect(document.activeElement).toBe(arrowKeyNavWrapper.vm.$refs['submenu-toggle'].$el);
            expect(onUpMock).toHaveBeenCalled();
        });

        it('focuses first element on key up after expand if orientation top', () => {
            const id = 'testfoobar543';
            const items = [
                { href: 'https://www.google.com/slash', text: 'Google Slash', randomProp: 'test' },
                { href: 'https://www.link.me.in', text: 'Linked Thing', anotherProp: 'foo' }
            ];
            const wrapper = mount(SubMenu, {
                propsData: {
                    items,
                    id,
                    orientation: 'top'
                },
                slots: {
                    default: 'button me'
                },
                stubs: {
                    NuxtLink: RouterLinkStub
                }
            });
            let onUpMock = jest.spyOn(wrapper.vm, 'onUp');
            expect(wrapper.vm.expanded).toBe(false);
            wrapper.setData({ expanded: true });
            expect(wrapper.vm.expanded).toBe(true);
            expect(listItems.length).toBe(2);

            expect(document.activeElement).not.toBe(listItems[1]);

            wrapper.trigger('keydown.up');

            expect(document.activeElement).toStrictEqual(listItems[1]);
            expect(onUpMock).toHaveBeenCalled();
        });

        it('does not focus first element on key down after expand if orientation top', () => {
            const id = 'testfoobar543';
            const items = [
                { href: 'https://www.google.com/slash', text: 'Google Slash', randomProp: 'test' },
                { href: 'https://www.link.me.in', text: 'Linked Thing', anotherProp: 'foo' }
            ];
            const wrapper = mount(SubMenu, {
                propsData: {
                    items,
                    id,
                    orientation: 'top'
                },
                slots: {
                    default: 'button me'
                },
                stubs: {
                    NuxtLink: RouterLinkStub
                }
            });
            let onDownMock = jest.spyOn(wrapper.vm, 'onDown');
            expect(wrapper.vm.expanded).toBe(false);
            wrapper.setData({ expanded: true });
            expect(wrapper.vm.expanded).toBe(true);
            expect(listItems.length).toBe(2);
            wrapper.vm.$refs['submenu-toggle'].$el.focus();
            expect(document.activeElement).toBe(wrapper.vm.$refs['submenu-toggle'].$el);

            wrapper.trigger('keydown.down');

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
        });

        it('closes menu on click', () => {
            let toggleMenuMock = jest.spyOn(closingMenuWrapper.vm, 'toggleMenu');
            expect(closingMenuWrapper.vm.expanded).toBe(false);
            closingMenuWrapper.setData({ expanded: true });
            expect(closingMenuWrapper.vm.expanded).toBe(true);

            closingMenuWrapper.find('.submenu-toggle').trigger('click');

            expect(toggleMenuMock).toHaveBeenCalled();
            expect(closingMenuWrapper.vm.expanded).toBe(false);
        });

        it('closes menu on item click', () => {
            jest.useFakeTimers();
            let closeMenuMock = jest.spyOn(closingMenuWrapper.vm, 'closeMenu');

            closingMenuWrapper.setData({ expanded: true });
            closingMenuWrapper.find('ul a').trigger('click');

            jest.runAllTimers();
            expect(closeMenuMock).toHaveBeenCalled();
            expect(closingMenuWrapper.vm.expanded).toBe(false);
        });

        it('does not close menu with enter key', () => {
            let toggleMenuMock = jest.spyOn(closingMenuWrapper.vm, 'toggleMenu');
            expect(closingMenuWrapper.vm.expanded).toBe(false);
            closingMenuWrapper.setData({ expanded: true });
            expect(closingMenuWrapper.vm.expanded).toBe(true);
            closingMenuWrapper.find('.submenu-toggle').trigger('keydown.enter');

            expect(toggleMenuMock).not.toHaveBeenCalled();
            expect(closingMenuWrapper.vm.expanded).toBe(true);
        });

        it('closes menu on escape', () => {
            jest.useFakeTimers();

            let closeMenuMock = jest.spyOn(closingMenuWrapper.vm, 'closeMenu');
            expect(closingMenuWrapper.vm.expanded).toBe(false);
            closingMenuWrapper.setData({ expanded: true });
            expect(closingMenuWrapper.vm.expanded).toBe(true);
            closingMenuWrapper.trigger('keydown.esc');

            jest.runAllTimers();

            expect(closeMenuMock).toHaveBeenCalled();
            expect(closingMenuWrapper.vm.expanded).toBe(false);
            expect(document.activeElement).toBe(closingMenuWrapper.vm.$refs['submenu-toggle'].$el);
        });

        it('closes menu when focus leaves the component', () => {
            jest.useFakeTimers();

            let refocusMock = jest.spyOn(closingMenuWrapper.vm.$refs['submenu-toggle'], 'focus');
            let onFocusOutMock = jest.spyOn(closingMenuWrapper.vm, 'onFocusOut');
            let closeMenuMock = jest.spyOn(closingMenuWrapper.vm, 'closeMenu');
            expect(closingMenuWrapper.vm.expanded).toBe(false);
            closingMenuWrapper.setData({ expanded: true });
            expect(closingMenuWrapper.vm.expanded).toBe(true);

            closingMenuWrapper.trigger('focusout');

            jest.runAllTimers();

            expect(onFocusOutMock).toHaveBeenCalled();
            expect(closeMenuMock).toHaveBeenCalledWith(false);
            expect(refocusMock).not.toHaveBeenCalled();
            expect(closingMenuWrapper.vm.expanded).toBe(false);
        });
    });
});
