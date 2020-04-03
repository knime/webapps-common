import { shallowMount, mount, RouterLinkStub } from '@vue/test-utils';

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

    describe('clicking submenu items', () => {
        it('emits item-click', () => {
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

        describe('enter key behavior', () => {
            it('clicks links with enter key', () => {
                const items =  [
                    { href: 'https://www.google.com/slash', text: 'Google Slash', randomProp: 'test' },
                    { to: '/', text: 'Nuxt Link', anotherProp: 'foo' }
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
                let fakeEvent = {
                    code: 'Enter',
                    preventDefault: jest.fn(),
                    stopPropagation: jest.fn(),
                    stopImmediatePropagation: jest.fn()
                };
                let onItemClickMock = jest.spyOn(wrapper.vm, 'onItemClick');
                let closeMenuMock = jest.spyOn(wrapper.vm, 'closeMenu');
                wrapper.vm.listItems[0].focus();
                expect(document.activeElement).toBe(wrapper.vm.listItems[0]);
                wrapper.findAll('.clickable-item').at(0).trigger('keydown.enter', fakeEvent);
                expect(onItemClickMock).toHaveBeenCalled();
                expect(closeMenuMock).toHaveBeenCalled();
                expect(wrapper.emitted('item-click')).toBeTruthy();
                expect(fakeEvent.preventDefault).not.toHaveBeenCalled();
                expect(fakeEvent.stopPropagation).not.toHaveBeenCalled();
                expect(fakeEvent.stopImmediatePropagation).not.toHaveBeenCalled();
            });

            it('does not click buttons with enter key', () => {
                const items =  [
                    { text: 'Google Slash', randomProp: 'test' },
                    { text: 'Nuxt Link', anotherProp: 'foo' }
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
                let fakeEvent = {
                    code: 'Enter',
                    preventDefault: jest.fn(),
                    stopPropagation: jest.fn(),
                    stopImmediatePropagation: jest.fn()
                };
                let onItemClickMock = jest.spyOn(wrapper.vm, 'onItemClick');
                let closeMenuMock = jest.spyOn(wrapper.vm, 'closeMenu');
                wrapper.vm.listItems[0].focus();
                expect(document.activeElement).toBe(wrapper.vm.listItems[0]);
                wrapper.findAll('.clickable-item').at(0).trigger('keydown.enter', fakeEvent);
                expect(onItemClickMock).toHaveBeenCalled();
                expect(closeMenuMock).not.toHaveBeenCalled();
                expect(wrapper.emitted('item-click')).toBeFalsy();
                expect(fakeEvent.preventDefault).toHaveBeenCalled();
                expect(fakeEvent.stopPropagation).toHaveBeenCalled();
                expect(fakeEvent.stopImmediatePropagation).toHaveBeenCalled();
            });
        });

        describe('space key behavior', () => {
            it('clicks buttons with space key', () => {
                const items =  [
                    { text: 'Google Slash', randomProp: 'test' },
                    { text: 'Nuxt Link', anotherProp: 'foo' }
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
                let fakeEvent = {
                    code: 'Space',
                    preventDefault: jest.fn(),
                    stopPropagation: jest.fn(),
                    stopImmediatePropagation: jest.fn()
                };
                let onItemClickMock = jest.spyOn(wrapper.vm, 'onItemClick');
                let closeMenuMock = jest.spyOn(wrapper.vm, 'closeMenu');
                wrapper.vm.listItems[0].focus();
                expect(document.activeElement).toBe(wrapper.vm.listItems[0]);
                wrapper.findAll('.clickable-item').at(0).trigger('keydown.space', fakeEvent);
                expect(onItemClickMock).toHaveBeenCalled();
                expect(closeMenuMock).toHaveBeenCalled();
                expect(wrapper.emitted('item-click')).toBeTruthy();
                expect(fakeEvent.preventDefault).toHaveBeenCalled();
                expect(fakeEvent.stopPropagation).toHaveBeenCalled();
                expect(fakeEvent.stopImmediatePropagation).toHaveBeenCalled();
            });

            it('does not click links with space key', () => {
                const items =  [
                    { href: 'https://www.google.com/slash', text: 'Google Slash', randomProp: 'test' },
                    { to: '/', text: 'Nuxt Link', anotherProp: 'foo' }
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
                let fakeEvent = {
                    code: 'Space',
                    preventDefault: jest.fn(),
                    stopPropagation: jest.fn(),
                    stopImmediatePropagation: jest.fn()
                };
                let onItemClickMock = jest.spyOn(wrapper.vm, 'onItemClick');
                let closeMenuMock = jest.spyOn(wrapper.vm, 'closeMenu');
                wrapper.vm.listItems[0].focus();
                expect(document.activeElement).toBe(wrapper.vm.listItems[0]);
                wrapper.findAll('.clickable-item').at(0).trigger('keydown.space', fakeEvent);
                expect(onItemClickMock).toHaveBeenCalled();
                expect(closeMenuMock).not.toHaveBeenCalled();
                expect(wrapper.emitted('item-click')).toBeFalsy();
                expect(fakeEvent.preventDefault).not.toHaveBeenCalled();
                expect(fakeEvent.stopPropagation).not.toHaveBeenCalled();
                expect(fakeEvent.stopImmediatePropagation).not.toHaveBeenCalled();
            });
        });
    });

    describe('arrow key navigation', () => {
        let arrowKeyNavWrapper;

        beforeEach(() => {
            const id = 'testfoobar543';
            const items =  [
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
        });

        it('gets next item to focus', () => {
            const items =  [
                { href: 'https://www.google.com/slash', text: 'Google Slash', randomProp: 'test' },
                { href: 'https://www.link.me.in', text: 'Linked Thing', anotherProp: 'foo' },
                { text: 'I act like a button' }
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
            // up and down
            wrapper.vm.listItems[1].focus();
            expect(document.activeElement).toBe(wrapper.vm.listItems[1]);
            expect(wrapper.vm.getNextElement(-1)).toBe(wrapper.vm.listItems[0]);
            expect(wrapper.vm.getNextElement(1)).toBe(wrapper.vm.listItems[2]);
            // jumps to end of list
            wrapper.vm.listItems[0].focus();
            expect(document.activeElement).toBe(wrapper.vm.listItems[0]);
            expect(wrapper.vm.getNextElement(1)).toBe(wrapper.vm.listItems[1]);
            expect(wrapper.vm.getNextElement(-1)).toBe(wrapper.vm.listItems[2]);
            // jumps to start of list
            wrapper.vm.listItems[2].focus();
            expect(document.activeElement).toBe(wrapper.vm.listItems[2]);
            expect(wrapper.vm.getNextElement(-1)).toBe(wrapper.vm.listItems[1]);
            expect(wrapper.vm.getNextElement(1)).toBe(wrapper.vm.listItems[0]);
        });

        it('focuses next element on key down', () => {
            let onDownMock = jest.spyOn(arrowKeyNavWrapper.vm, 'onDown');
            expect(arrowKeyNavWrapper.vm.expanded).toBe(false);
            arrowKeyNavWrapper.setData({ expanded: true });
            expect(arrowKeyNavWrapper.vm.expanded).toBe(true);
            expect(arrowKeyNavWrapper.vm.listItems.length).toBe(2);
            arrowKeyNavWrapper.vm.listItems[0].focus();
            expect(document.activeElement).toBe(arrowKeyNavWrapper.vm.listItems[0]);

            arrowKeyNavWrapper.trigger('keydown.down');

            expect(document.activeElement).toBe(arrowKeyNavWrapper.vm.listItems[1]);
            expect(onDownMock).toHaveBeenCalled();
        });

        it('focuses previous element on key up', () => {
            let onUpMock = jest.spyOn(arrowKeyNavWrapper.vm, 'onUp');
            expect(arrowKeyNavWrapper.vm.expanded).toBe(false);
            arrowKeyNavWrapper.setData({ expanded: true });
            expect(arrowKeyNavWrapper.vm.expanded).toBe(true);
            expect(arrowKeyNavWrapper.vm.listItems.length).toBe(2);
            arrowKeyNavWrapper.vm.listItems[1].focus();
            expect(document.activeElement).toBe(arrowKeyNavWrapper.vm.listItems[1]);

            arrowKeyNavWrapper.trigger('keydown.up');

            expect(document.activeElement).toBe(arrowKeyNavWrapper.vm.listItems[0]);
            expect(onUpMock).toHaveBeenCalled();
        });

        it('focuses first element on key down at list end', () => {
            let onDownMock = jest.spyOn(arrowKeyNavWrapper.vm, 'onDown');
            expect(arrowKeyNavWrapper.vm.expanded).toBe(false);
            arrowKeyNavWrapper.setData({ expanded: true });
            expect(arrowKeyNavWrapper.vm.expanded).toBe(true);
            expect(arrowKeyNavWrapper.vm.listItems.length).toBe(2);
            arrowKeyNavWrapper.vm.listItems[1].focus();
            expect(document.activeElement).toBe(arrowKeyNavWrapper.vm.listItems[1]);

            arrowKeyNavWrapper.trigger('keydown.down');

            expect(document.activeElement).toBe(arrowKeyNavWrapper.vm.listItems[0]);
            expect(onDownMock).toHaveBeenCalled();
        });

        it('focuses last element on key up at list start', () => {
            let onUpMock = jest.spyOn(arrowKeyNavWrapper.vm, 'onUp');
            expect(arrowKeyNavWrapper.vm.expanded).toBe(false);
            arrowKeyNavWrapper.setData({ expanded: true });
            expect(arrowKeyNavWrapper.vm.expanded).toBe(true);
            expect(arrowKeyNavWrapper.vm.listItems.length).toBe(2);
            arrowKeyNavWrapper.vm.listItems[0].focus();
            expect(document.activeElement).toBe(arrowKeyNavWrapper.vm.listItems[0]);

            arrowKeyNavWrapper.trigger('keydown.up');

            expect(document.activeElement).toBe(arrowKeyNavWrapper.vm.listItems[1]);
            expect(onUpMock).toHaveBeenCalled();
        });

        it('focuses first element on key down after expand if orientation bottom', () => {
            let onDownMock = jest.spyOn(arrowKeyNavWrapper.vm, 'onDown');
            let getNextElementMock = jest.spyOn(arrowKeyNavWrapper.vm, 'getNextElement');
            expect(arrowKeyNavWrapper.vm.expanded).toBe(false);
            arrowKeyNavWrapper.setData({ expanded: true });
            expect(arrowKeyNavWrapper.vm.expanded).toBe(true);
            expect(arrowKeyNavWrapper.vm.listItems.length).toBe(2);

            expect(document.activeElement).not.toBe(arrowKeyNavWrapper.vm.listItems[0]);

            arrowKeyNavWrapper.trigger('keydown.down');

            expect(document.activeElement).toBe(arrowKeyNavWrapper.vm.listItems[0]);
            expect(onDownMock).toHaveBeenCalled();
            expect(getNextElementMock).toHaveBeenCalled();
        });

        it('does not focus first element on key up after expand if orientation bottom', () => {
            let onUpMock = jest.spyOn(arrowKeyNavWrapper.vm, 'onUp');
            let getNextElementMock = jest.spyOn(arrowKeyNavWrapper.vm, 'getNextElement');
            expect(arrowKeyNavWrapper.vm.expanded).toBe(false);
            arrowKeyNavWrapper.setData({ expanded: true });
            expect(arrowKeyNavWrapper.vm.expanded).toBe(true);
            expect(arrowKeyNavWrapper.vm.listItems.length).toBe(2);
            arrowKeyNavWrapper.vm.$refs['submenu-toggle'].focus();
            expect(document.activeElement).toBe(arrowKeyNavWrapper.vm.$refs['submenu-toggle']);
            
            arrowKeyNavWrapper.trigger('keydown.up');
            
            expect(document.activeElement).not.toBe(arrowKeyNavWrapper.vm.listItems[0]);
            expect(document.activeElement).toBe(arrowKeyNavWrapper.vm.$refs['submenu-toggle']);
            expect(onUpMock).toHaveBeenCalled();
            expect(getNextElementMock).not.toHaveBeenCalled();
        });

        it('focuses first element on key up after expand if orientation top', () => {
            const id = 'testfoobar543';
            const items =  [
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
            let getNextElementMock = jest.spyOn(wrapper.vm, 'getNextElement');
            expect(wrapper.vm.expanded).toBe(false);
            wrapper.setData({ expanded: true });
            expect(wrapper.vm.expanded).toBe(true);
            expect(wrapper.vm.listItems.length).toBe(2);

            expect(document.activeElement).not.toBe(wrapper.vm.listItems[1]);

            wrapper.trigger('keydown.up');

            expect(document.activeElement).toBe(wrapper.vm.listItems[1]);
            expect(onUpMock).toHaveBeenCalled();
            expect(getNextElementMock).toHaveBeenCalled();
        });

        it('does not focus first element on key down after expand if orientation top', () => {
            const id = 'testfoobar543';
            const items =  [
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
            let getNextElementMock = jest.spyOn(wrapper.vm, 'getNextElement');
            expect(wrapper.vm.expanded).toBe(false);
            wrapper.setData({ expanded: true });
            expect(wrapper.vm.expanded).toBe(true);
            expect(wrapper.vm.listItems.length).toBe(2);
            wrapper.vm.$refs['submenu-toggle'].focus();
            expect(document.activeElement).toBe(wrapper.vm.$refs['submenu-toggle']);
            
            wrapper.trigger('keydown.down');
            
            expect(document.activeElement).not.toBe(wrapper.vm.listItems[0]);
            expect(document.activeElement).toBe(wrapper.vm.$refs['submenu-toggle']);
            expect(onDownMock).toHaveBeenCalled();
            expect(getNextElementMock).not.toHaveBeenCalled();
        });
    });

    describe('closing menu', () => {
        let closingMenuWrapper;

        beforeEach(() => {
            const id = 'testfoobar543';
            const items =  [
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

        it('closes menu with space key', () => {
            let toggleMenuMock = jest.spyOn(closingMenuWrapper.vm, 'toggleMenu');
            expect(closingMenuWrapper.vm.expanded).toBe(false);
            closingMenuWrapper.setData({ expanded: true });
            expect(closingMenuWrapper.vm.expanded).toBe(true);
            closingMenuWrapper.find('.submenu-toggle').trigger('keydown.space');

            expect(toggleMenuMock).toHaveBeenCalled();
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
            expect(document.activeElement).toBe(closingMenuWrapper.vm.$refs['submenu-toggle']);
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

    it('can be disabled', () => {
        const id = 'testfoobar543';
        const items =  [
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
        wrapper.setProps({ disabled: false });
        expect(button.attributes('disabled')).toBeFalsy();
    });
});
