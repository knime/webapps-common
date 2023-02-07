import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount, shallowMount } from '@vue/test-utils';

import MenuItems from '../MenuItems.vue';
import SubMenu from '../SubMenu.vue';
import FunctionButton from '../FunctionButton.vue';
import { ref, unref } from 'vue';
import useDropdownNavigation from '../../util/useDropdownNavigation';
import usePopper from '../../util/usePopper';
import useClickOutside from '../../util/useClickOutside';

const dropdownNavigation = { currentMarkedIndex: ref(1), resetNavigation: vi.fn() };
vi.mock('../../util/useDropdownNavigation', () => ({ default: vi.fn(() => dropdownNavigation) }));


const popper = { updatePopper: vi.fn(), popperInstance: { setOptions: vi.fn() } };
vi.mock('../../util/usePopper', () => ({ default: vi.fn(() => popper) }));
vi.mock('../../util/useClickOutside', () => ({ default: vi.fn() }));

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

    it('opens and closes menu on click', async () => {
        const wrapper = mount(SubMenu, { props });
        expect(wrapper.findComponent(MenuItems).isVisible()).toBeFalsy();
        await wrapper.find('.submenu-toggle').trigger('click');
        expect(wrapper.findComponent(MenuItems).isVisible()).toBeTruthy();
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

    describe('keyboard navigation', () => {
        it('uses dropdown navigation', async () => {
            useDropdownNavigation.reset();
            const wrapper = mount(SubMenu, { props });
            const { baseElement, close, getNextElement } = useDropdownNavigation.mock.calls[0][0];
            
            expect(unref(baseElement)).toStrictEqual(wrapper.find('.submenu').element);
    
            await wrapper.find('.submenu-toggle').trigger('click');
            expect(wrapper.findComponent(MenuItems).isVisible()).toBeTruthy();
            close();
            await wrapper.vm.$nextTick();
            expect(wrapper.findComponent(MenuItems).isVisible()).toBeFalsy();
    
            const { index, element } = getNextElement(-1, 1);
            expect(index).toBe(0);
            expect(element).toBe(wrapper.findComponent(MenuItems).find('li').find('a').element);
        });

        it('marks active element', () => {
            const wrapper = mount(SubMenu, { props });
            const currentMarkedIndex = dropdownNavigation.currentMarkedIndex.value;
            const currentMarkedElement = wrapper.findComponent(MenuItems).findAll('li')[currentMarkedIndex].find('a');
            expect(currentMarkedElement.classes().includes('marked')).toBeTruthy();
        });

        it('resets navigation on toggle', async () => {
            const wrapper = shallowMount(SubMenu, { props });
            await wrapper.find('.submenu-toggle').trigger('click');
            dropdownNavigation.resetNavigation.reset();
            await wrapper.find('.submenu-toggle').trigger('click');
            expect(dropdownNavigation.resetNavigation).toHaveBeenCalled();
        });
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
            const wrapper = shallowMount(SubMenu, { props });
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
            let callback = wrapper.emitted('toggle')[0][0];
            expect(typeof callback).toBe('function'); // event object
            expect(wrapper.findComponent(MenuItems).isVisible()).toBeTruthy();
            callback();
            await wrapper.vm.$nextTick();
            expect(wrapper.findComponent(MenuItems).isVisible()).toBeFalsy();
        });
    });
});
