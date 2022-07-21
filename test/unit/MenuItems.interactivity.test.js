import { shallowMount, mount, RouterLinkStub } from '@vue/test-utils';

import MenuItems from '~/ui/components/MenuItems.vue';

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
                wrapper.vm.$refs.listItem[0].focus();
                expect(document.activeElement).toBe(wrapper.vm.$refs.listItem[0]);
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
                wrapper.vm.$refs.listItem[0].focus();
                expect(document.activeElement).toBe(wrapper.vm.$refs.listItem[0]);
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
                wrapper.vm.$refs.listItem[0].focus();
                expect(document.activeElement).toBe(wrapper.vm.$refs.listItem[0]);
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
                wrapper.vm.$refs.listItem[0].focus();
                expect(document.activeElement).toBe(wrapper.vm.$refs.listItem[0]);
                wrapper.findAll('.clickable-item').at(0).trigger('keydown.space', fakeEvent);
                expect(onItemClickMock).toHaveBeenCalled();
                expect(wrapper.emitted('item-click')).toBeFalsy();
                expect(fakeEvent.preventDefault).not.toHaveBeenCalled();
                expect(fakeEvent.stopPropagation).not.toHaveBeenCalled();
                expect(fakeEvent.stopImmediatePropagation).not.toHaveBeenCalled();
            });
        });
    });
});
