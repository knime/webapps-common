import { shallowMount, mount, RouterLinkStub } from '@vue/test-utils';

import MenuItems from '~/ui/components/MenuItems';

describe('MenuItems.vue', () => {
    describe('clicking menu items', () => {
        it('emits item-click', () => {
            const items = [
                { href: 'https://www.google.com/slash', text: 'Google Slash', randomProp: 'test' },
                { href: 'https://www.link.me.in', text: 'Linked Thing', anotherProp: 'foo' }
            ];
            const id = 'testfoobar543';

            const wrapper = shallowMount(MenuItems, {
                propsData: {
                    ariaLabel: id,
                    items,
                    id
                },
                stubs: {
                    NuxtLink: RouterLinkStub
                }
            });
            wrapper.findAll('li').at(0).trigger('click');
            expect(typeof wrapper.emittedByOrder()[0].args[0]).toBe('object'); // event objectd
            expect(wrapper.emittedByOrder()[0].args[1]).toEqual(items[0]);
            expect(wrapper.emittedByOrder()[0].args[2]).toEqual(id);

            wrapper.findAll('li').at(1).trigger('click');
            expect(typeof wrapper.emittedByOrder()[1].args[0]).toBe('object'); // event object
            expect(wrapper.emittedByOrder()[1].args[1]).toEqual(items[1]);
            expect(wrapper.emittedByOrder()[1].args[2]).toEqual(id);
        });

        it('does nothing if item is disabled', () => {
            const items = [
                { href: 'https://www.google.com/slash', text: 'Google Slash', randomProp: 'test', disabled: true },
                { href: 'https://www.link.me.in', text: 'Linked Thing', anotherProp: 'foo', disabled: true }
            ];
            const id = 'testfoobar543';

            const wrapper = shallowMount(MenuItems, {
                propsData: {
                    ariaLabel: id,
                    items,
                    id
                },
                stubs: {
                    NuxtLink: RouterLinkStub
                }
            });
            wrapper.findAll('li').at(0).trigger('click');
            expect(wrapper.emitted('item-click')).toBeFalsy();

            wrapper.findAll('li').at(1).trigger('click');
            expect(wrapper.emitted('item-click')).toBeFalsy();
        });

        describe('enter key behavior', () => {
            it('clicks links with enter key', () => {
                const items = [
                    { href: 'https://www.google.com/slash', text: 'Google Slash', randomProp: 'test' },
                    { to: '/', text: 'Nuxt Link', anotherProp: 'foo' }
                ];
                const id = 'testfoobar543';

                const wrapper = mount(MenuItems, {
                    propsData: {
                        ariaLabel: id,
                        items,
                        id
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
                wrapper.vm.listItems[0].focus();
                expect(document.activeElement).toBe(wrapper.vm.listItems[0]);
                wrapper.findAll('.clickable-item').at(0).trigger('keydown.enter', fakeEvent);
                expect(onItemClickMock).toHaveBeenCalled();
                expect(wrapper.emitted('item-click')).toBeTruthy();
                expect(fakeEvent.preventDefault).not.toHaveBeenCalled();
                expect(fakeEvent.stopPropagation).not.toHaveBeenCalled();
                expect(fakeEvent.stopImmediatePropagation).not.toHaveBeenCalled();
            });

            it('does click buttons with enter key', () => {
                const items = [
                    { text: 'Google Slash', randomProp: 'test' },
                    { text: 'Nuxt Link', anotherProp: 'foo' }
                ];
                const id = 'testfoobar543';

                const wrapper = mount(MenuItems, {
                    propsData: {
                        ariaLabel: id,
                        items,
                        id
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
                wrapper.vm.listItems[0].focus();
                expect(document.activeElement).toBe(wrapper.vm.listItems[0]);
                wrapper.findAll('.clickable-item').at(0).trigger('keydown.enter', fakeEvent);
                expect(onItemClickMock).toHaveBeenCalled();
                expect(wrapper.emitted('item-click')).toBeTruthy();
                expect(fakeEvent.preventDefault).toHaveBeenCalled();
                expect(fakeEvent.stopPropagation).toHaveBeenCalled();
                expect(fakeEvent.stopImmediatePropagation).toHaveBeenCalled();
            });
        });

        describe('space key behavior', () => {
            it('clicks buttons with space key', () => {
                const items = [
                    { text: 'Google Slash', randomProp: 'test' },
                    { text: 'Nuxt Link', anotherProp: 'foo' }
                ];
                const id = 'testfoobar543';

                const wrapper = mount(MenuItems, {
                    propsData: {
                        ariaLabel: id,
                        items,
                        id
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
                wrapper.vm.listItems[0].focus();
                expect(document.activeElement).toBe(wrapper.vm.listItems[0]);
                wrapper.findAll('.clickable-item').at(0).trigger('keydown.space', fakeEvent);
                expect(onItemClickMock).toHaveBeenCalled();
                expect(wrapper.emitted('item-click')).toBeTruthy();
                expect(fakeEvent.preventDefault).toHaveBeenCalled();
                expect(fakeEvent.stopPropagation).toHaveBeenCalled();
                expect(fakeEvent.stopImmediatePropagation).toHaveBeenCalled();
            });

            it('does not click links with space key', () => {
                const items = [
                    { href: 'https://www.google.com/slash', text: 'Google Slash', randomProp: 'test' },
                    { to: '/', text: 'Nuxt Link', anotherProp: 'foo' }
                ];
                const id = 'testfoobar543';

                const wrapper = mount(MenuItems, {
                    propsData: {
                        ariaLabel: id,
                        items,
                        id
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
                wrapper.vm.listItems[0].focus();
                expect(document.activeElement).toBe(wrapper.vm.listItems[0]);
                wrapper.findAll('.clickable-item').at(0).trigger('keydown.space', fakeEvent);
                expect(onItemClickMock).toHaveBeenCalled();
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
            const items = [
                { href: 'https://www.google.com/slash', text: 'Google Slash', randomProp: 'test' },
                { href: 'https://www.link.me.in', text: 'Linked Thing', anotherProp: 'foo' }
            ];
            arrowKeyNavWrapper = mount(MenuItems, {
                propsData: {
                    ariaLabel: id,
                    items,
                    id
                },
                stubs: {
                    NuxtLink: RouterLinkStub
                }
            });
        });

        it('gets next item to focus', () => {
            const items = [
                { href: 'https://www.google.com/slash', text: 'Google Slash', randomProp: 'test' },
                { href: 'https://www.link.me.in', text: 'Linked Thing', anotherProp: 'foo' },
                { text: 'I act like a button' }
            ];
            const id = 'testfoobar543';

            const wrapper = shallowMount(MenuItems, {
                propsData: {
                    ariaLabel: id,
                    items,
                    id
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
            let onDownMock = jest.spyOn(arrowKeyNavWrapper.vm, 'onArrowDownKey');

            expect(arrowKeyNavWrapper.vm.listItems.length).toBe(2);
            arrowKeyNavWrapper.vm.listItems[0].focus();
            expect(document.activeElement).toBe(arrowKeyNavWrapper.vm.listItems[0]);

            arrowKeyNavWrapper.trigger('keydown.down');

            expect(document.activeElement).toBe(arrowKeyNavWrapper.vm.listItems[1]);
            expect(onDownMock).toHaveBeenCalled();
        });

        it('focuses previous element on key up', () => {
            let onUpMock = jest.spyOn(arrowKeyNavWrapper.vm, 'onArrowUpKey');

            expect(arrowKeyNavWrapper.vm.listItems.length).toBe(2);
            arrowKeyNavWrapper.vm.listItems[1].focus();
            expect(document.activeElement).toBe(arrowKeyNavWrapper.vm.listItems[1]);

            arrowKeyNavWrapper.trigger('keydown.up');

            expect(document.activeElement).toBe(arrowKeyNavWrapper.vm.listItems[0]);
            expect(onUpMock).toHaveBeenCalled();
        });

        it('focuses first element on key down at list end', () => {
            let onDownMock = jest.spyOn(arrowKeyNavWrapper.vm, 'onArrowDownKey');

            expect(arrowKeyNavWrapper.vm.listItems.length).toBe(2);
            arrowKeyNavWrapper.vm.listItems[1].focus();
            expect(document.activeElement).toBe(arrowKeyNavWrapper.vm.listItems[1]);

            arrowKeyNavWrapper.trigger('keydown.down');

            expect(document.activeElement).toBe(arrowKeyNavWrapper.vm.listItems[0]);
            expect(onDownMock).toHaveBeenCalled();
        });

        it('focuses last element on key up at list start', () => {
            let onUpMock = jest.spyOn(arrowKeyNavWrapper.vm, 'onArrowUpKey');

            expect(arrowKeyNavWrapper.vm.listItems.length).toBe(2);
            arrowKeyNavWrapper.vm.listItems[0].focus();
            expect(document.activeElement).toBe(arrowKeyNavWrapper.vm.listItems[0]);

            arrowKeyNavWrapper.trigger('keydown.up');

            expect(document.activeElement).toBe(arrowKeyNavWrapper.vm.listItems[1]);
            expect(onUpMock).toHaveBeenCalled();
        });
    });
});
