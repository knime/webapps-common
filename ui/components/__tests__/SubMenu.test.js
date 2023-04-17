import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, shallowMount } from '@vue/test-utils';

import MenuItems from '../MenuItems.vue';
import SubMenu from '../SubMenu.vue';
import FunctionButton from '../FunctionButton.vue';
import { ref, unref } from 'vue';
import usePopper from '../../composables/usePopper';
import useClickOutside from '../../composables/useClickOutside';

const dropdownNavigation = { currentIndex: ref(1), resetNavigation: vi.fn(), onKeydown: vi.fn() };
vi.mock('../../composables/useDropdownNavigation', () => ({ default: vi.fn(() => dropdownNavigation) }));

const popper = { updatePopper: vi.fn(), popperInstance: { setOptions: vi.fn() } };
vi.mock('../../composables/usePopper', () => ({ default: vi.fn(() => popper) }));
vi.mock('../../composables/useClickOutside', () => ({ default: vi.fn() }));

describe('SubMenu.vue', () => {
    let props;

    beforeEach(() => {
        props = {
            id: 'testfoobar543',
            items: [
                { href: 'https://www.google.com/slash', text: 'Google Slash', randomProp: 'test' },
                { href: 'https://www.link.me.in', text: 'Linked Thing', anotherProp: 'foo' }
            ]
        };
    });


    it('renders the menu toggle', () => {
        const wrapper = shallowMount(SubMenu, {
            slots: {
                default: '<svg />click me please <strong>right there</strong>'
            },
            props: {
                items: [],
                buttonTitle: 'test button title'
            }
        });
        expect(wrapper.findComponent(FunctionButton).find('svg').exists()).toBeTruthy();
        expect(wrapper.findComponent(FunctionButton).text()).toContain('click me please right there');
        expect(wrapper.findComponent(FunctionButton).attributes('title')).toBe('test button title');
    });

    it('exposes expanded prop in slot', () => {
        const wrapper = shallowMount(SubMenu, {
            slots: {
                default: '<template #default="{ expanded }"><div>{{ expanded }}</div></template>'
            },
            props
        });
        expect(wrapper.findComponent(FunctionButton).text()).toContain('false');
    });

    it('opens and closes menu on click', async () => {
        const wrapper = mount(SubMenu, { props });
        expect(wrapper.findComponent(MenuItems).isVisible()).toBeFalsy();
        await wrapper.find('.submenu-toggle').trigger('click');
        expect(wrapper.findComponent(MenuItems).isVisible()).toBeTruthy();
        await wrapper.find('.submenu-toggle').trigger('click');
        expect(wrapper.findComponent(MenuItems).isVisible()).toBeFalsy();
    });

    it('closes menu on close event', async () => {
        const wrapper = mount(SubMenu, { props });
        expect(wrapper.findComponent(MenuItems).isVisible()).toBeFalsy();
        await wrapper.find('.submenu-toggle').trigger('click');
        expect(wrapper.findComponent(MenuItems).isVisible()).toBeTruthy();
        await wrapper.findComponent(MenuItems).vm.$emit('close');
        expect(wrapper.findComponent(MenuItems).isVisible()).toBeFalsy();
    });

    it('does not toggle the menu if disabled', async () => {
        props.disabled = true;
        const wrapper = mount(SubMenu, { props });
        await wrapper.find('.submenu-toggle').trigger('click');
        expect(wrapper.findComponent(MenuItems).isVisible()).toBeFalsy();
    });

    it('emits item-click', async () => {
        const wrapper = mount(SubMenu, { props });
        // assumes MenuItems use <li>
        await wrapper.findComponent(MenuItems).findAll('li')[0].trigger('click');
        let event = wrapper.emitted('item-click')[0];
        expect(typeof event[0]).toBe('object'); // event object
        expect(event[1]).toEqual(props.items[0]);
        expect(event[2]).toEqual(props.id);

        await wrapper.findComponent(MenuItems).findAll('li')[1].trigger('click');
        event = wrapper.emitted('item-click')[1];
        expect(typeof event[0]).toBe('object'); // event object
        expect(event[1]).toEqual(props.items[1]);
        expect(event[2]).toEqual(props.id);
    });

    it('uses click outside', async () => {
        useClickOutside.reset();
        const wrapper = mount(SubMenu, { props });
        const [{ targets, callback }, active] = useClickOutside.mock.calls[0];

        expect(unref(targets[0])).toStrictEqual(wrapper.find('.submenu').element);
        expect(unref(targets[1]).$el).toStrictEqual(wrapper.findComponent(MenuItems).element);

        await wrapper.find('.submenu-toggle').trigger('click');
        expect(wrapper.findComponent(MenuItems).isVisible()).toBeTruthy();
        callback();
        await wrapper.vm.$nextTick();
        expect(wrapper.findComponent(MenuItems).isVisible()).toBeFalsy();

        expect(unref(active)).toBe(false);
    });

    it('calls keydown callback', () => {
        const wrapper = mount(SubMenu, { props });

        wrapper.find('.submenu').trigger('keydown');

        expect(dropdownNavigation.onKeydown).toHaveBeenCalled();
    });

    it('sets and removes aria-owns and aria-activedescendant on @item-focused', async () => {
        const testId = 'testId';
        const wrapper = mount(SubMenu, { props });
        await wrapper.findComponent(MenuItems).vm.$emit('item-focused', testId);
        expect(wrapper.find('.submenu').attributes('aria-owns')).toBe(testId);
        expect(wrapper.find('.submenu').attributes('aria-activedescendant')).toBe(testId);
        await wrapper.findComponent(MenuItems).vm.$emit('item-focused', null);
        expect(wrapper.find('.submenu').attributes('aria-owns')).toBeUndefined();
        expect(wrapper.find('.submenu').attributes('aria-activedescendant')).toBeUndefined();
    });

    describe('popover', () => {
        it('uses popper navigation', () => {
            usePopper.reset();
            props.teleportToBody = false; // necessary in order to find the popperTarget in the dom more easily
            const wrapper = mount(SubMenu, { props });
            const [{ popperTarget, referenceEl }, options] = usePopper.mock.calls[0];

            expect(unref(referenceEl)).toStrictEqual(wrapper.find('.submenu').element);
            expect(unref(popperTarget)).toStrictEqual(wrapper.find('.menu-wrapper').element);

            expect(unref(options)).toStrictEqual({
                modifiers: [
                    {
                        name: 'preventOverflow',
                        options: {
                            mainAxis: false
                        }
                    }
                ],
                placement: 'bottom-end',
                strategy: 'fixed'
            });
        });

        it('updates popper placement on orientation change', async () => {
            const wrapper = mount(SubMenu, { props });
            popper.popperInstance.setOptions.reset();
            await wrapper.setProps({ orientation: 'left' });
            expect(popper.popperInstance.setOptions).toHaveBeenCalledWith({
                placement: 'bottom-start'
            });
            popper.popperInstance.setOptions.reset();
            await wrapper.setProps({ orientation: 'top' });
            expect(popper.popperInstance.setOptions).toHaveBeenCalledWith({
                placement: 'top-end'
            });
            popper.popperInstance.setOptions.reset();
            await wrapper.setProps({ orientation: 'right' });
            expect(popper.popperInstance.setOptions).toHaveBeenCalledWith({
                placement: 'bottom-end'
            });
        });

        it('updates popper on toggle', async () => {
            const wrapper = shallowMount(SubMenu, { props,
                global: {
                    stubs: {
                        MenuItems: {
                            template: '<div/>',
                            methods: {
                                resetNavigation: vi.fn()
                            }
                        }
                    }
                } });
            popper.updatePopper.reset();
            await wrapper.find('.submenu-toggle').trigger('click');
            expect(popper.updatePopper).toHaveBeenCalled();
        });
    });

    describe('teleporting to body', () => {
        it('teleports the popover to the body if wanted', async () => {
            const items = [
                { href: 'https://www.google.com/slash', text: 'Google Slash', randomProp: 'test' },
                { href: 'https://www.link.me.in', text: 'Linked Thing', anotherProp: 'foo' }
            ];
            const id = 'testfoobar543';

            const wrapper = mount(SubMenu, {
                props: { items, id }
            });
            // assumes MenuItems use <li>
            // teleport is enabled by default, so the li cannot be found as it is telported
            expect(wrapper.find('li').exists()).toBeFalsy();
            expect(wrapper.findComponent(MenuItems).find('li').exists()).toBeTruthy();
            await wrapper.setProps({ teleportToBody: false });
            expect(wrapper.find('li').exists()).toBeTruthy();
        });

        it('emits toggle event with calback to collapse the menu on click', async () => {
            const items = [
                { href: 'https://www.google.com/slash', text: 'Google Slash', randomProp: 'test' },
                { href: 'https://www.link.me.in', text: 'Linked Thing', anotherProp: 'foo' }
            ];
            const id = 'testfoobar543';

            const wrapper = mount(SubMenu, {
                props: { items, id }
            });
            // assumes MenuItems use <li>
            await wrapper.find('.submenu-toggle').trigger('click');

            const [event, callback] = wrapper.emitted('toggle')[0];
            expect(event).toBeTruthy();
            expect(typeof callback).toBe('function'); // event object
            expect(wrapper.findComponent(MenuItems).isVisible()).toBeTruthy();
            callback();
            await wrapper.vm.$nextTick();
            expect(wrapper.findComponent(MenuItems).isVisible()).toBeFalsy();
        });
    });
});
