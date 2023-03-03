import { describe, it, expect, vi } from 'vitest';
import { shallowMount, mount, RouterLinkStub } from '@vue/test-utils';

import MenuItems from '../MenuItems.vue';

describe('MenuItems.vue', () => {
    describe('clicking menu items', () => {
        it('emits item-click', async () => {
            const items = [
                { href: 'https://www.google.com/slash', text: 'Google Slash', randomProp: 'test' },
                { href: 'https://www.link.me.in', text: 'Linked Thing', anotherProp: 'foo' }
            ];
            const id = 'testfoobar543';

            const wrapper = shallowMount(MenuItems, {
                props: {
                    ariaLabel: id,
                    items,
                    id
                }
            });
            await wrapper.findAll('li')[0].trigger('click');
            expect(wrapper.emitted('item-click')[0][1]).toEqual(items[0]);
            expect(wrapper.emitted('item-click')[0][2]).toEqual(id);

            await wrapper.findAll('li')[1].trigger('click');
            expect(wrapper.emitted('item-click')[1][1]).toEqual(items[1]);
            expect(wrapper.emitted('item-click')[1][2]).toEqual(id);
        });

        it('does nothing if item is disabled', () => {
            const items = [
                { href: 'https://www.google.com/slash', text: 'Google Slash', randomProp: 'test', disabled: true },
                { href: 'https://www.link.me.in', text: 'Linked Thing', anotherProp: 'foo', disabled: true }
            ];
            const id = 'testfoobar543';

            const wrapper = shallowMount(MenuItems, {
                props: {
                    ariaLabel: id,
                    items,
                    id
                }
            });
            wrapper.findAll('li')[0].trigger('click');
            expect(wrapper.emitted('item-click')).toBeFalsy();

            wrapper.findAll('li')[1].trigger('click');
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
                    props: {
                        ariaLabel: id,
                        items,
                        id
                    },
                    attachTo: document.body
                });
                let fakeEvent = {
                    code: 'Enter',
                    preventDefault: vi.fn(),
                    stopPropagation: vi.fn(),
                    stopImmediatePropagation: vi.fn()
                };
                let onItemClickMock = vi.spyOn(wrapper.vm, 'onItemClick');
                wrapper.vm.$refs.listItem[0].focus();
                expect(document.activeElement).toBe(wrapper.vm.$refs.listItem[0]);
                wrapper.findAll('.clickable-item')[0].trigger('keydown.enter', fakeEvent);
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
                    props: {
                        ariaLabel: id,
                        items,
                        id
                    },
                    attachTo: document.body
                });
                let fakeEvent = {
                    code: 'Enter',
                    preventDefault: vi.fn(),
                    stopPropagation: vi.fn(),
                    stopImmediatePropagation: vi.fn()
                };
                let onItemClickMock = vi.spyOn(wrapper.vm, 'onItemClick');
                wrapper.vm.$refs.listItem[0].focus();
                expect(document.activeElement).toBe(wrapper.vm.$refs.listItem[0]);
                wrapper.findAll('.clickable-item')[0].trigger('keydown.enter', fakeEvent);
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
                    props: {
                        ariaLabel: id,
                        items,
                        id
                    },
                    attachTo: document.body
                });
                let fakeEvent = {
                    code: 'Space',
                    preventDefault: vi.fn(),
                    stopPropagation: vi.fn(),
                    stopImmediatePropagation: vi.fn()
                };
                let onItemClickMock = vi.spyOn(wrapper.vm, 'onItemClick');
                wrapper.vm.$refs.listItem[0].focus();
                expect(document.activeElement).toBe(wrapper.vm.$refs.listItem[0]);
                wrapper.findAll('.clickable-item')[0].trigger('keydown.space', fakeEvent);
                expect(onItemClickMock).toHaveBeenCalled();
                expect(wrapper.emitted('item-click')).toBeTruthy();
                expect(fakeEvent.preventDefault).toHaveBeenCalled();
                expect(fakeEvent.stopPropagation).toHaveBeenCalled();
                expect(fakeEvent.stopImmediatePropagation).toHaveBeenCalled();
            });

            // TODO fix test
            it.skip('does not click links with space key', () => {
                const items = [
                    { href: 'https://www.google.com/slash', text: 'Google Slash', randomProp: 'test' },
                    { to: '/', text: 'Nuxt Link', anotherProp: 'foo' }
                ];
                const id = 'testfoobar543';

                const wrapper = mount(MenuItems, {
                    props: {
                        ariaLabel: id,
                        items,
                        id
                    },
                    attachTo: document.body,
                    global: {
                        stubs: {
                            NuxtLink: RouterLinkStub
                        }
                    }
                });
                let fakeEvent = {
                    code: 'Space',
                    preventDefault: vi.fn(),
                    stopPropagation: vi.fn(),
                    stopImmediatePropagation: vi.fn()
                };
                let onItemClickMock = vi.spyOn(wrapper.vm, 'onItemClick');
                wrapper.vm.$refs.listItem[0].focus();
                expect(document.activeElement).toBe(wrapper.vm.$refs.listItem[0]);
                wrapper.findAll('.clickable-item')[0].trigger('keydown.space', fakeEvent);
                expect(onItemClickMock).toHaveBeenCalled();
                expect(wrapper.emitted('item-click')).toBeFalsy();
                expect(fakeEvent.preventDefault).not.toHaveBeenCalled();
                expect(fakeEvent.stopPropagation).not.toHaveBeenCalled();
                expect(fakeEvent.stopImmediatePropagation).not.toHaveBeenCalled();
            });
        });
    });
});