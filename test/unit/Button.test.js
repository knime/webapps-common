import { shallowMount } from '@vue/test-utils';

import Button from '~/ui/components/Button';

describe('Button.vue', () => {
    it('renders a button', () => {
        const wrapper = shallowMount(Button);
        expect(wrapper.is('button')).toBeTruthy();
        expect(typeof wrapper.attributes().href === 'undefined').toBeTruthy();
        expect(wrapper.classes()).toEqual(['button']);
    });

    it('renders an anchor tag', () => {
        const wrapper = shallowMount(Button, {
            propsData: {
                href: 'testhref'
            }
        });
        expect(wrapper.is('a')).toBeTruthy();
        expect(wrapper.attributes('href')).toEqual('testhref');
    });

    it('renders classes according to props', () => {
        const wrapper = shallowMount(Button, {
            propsData: {
                primary: true,
                compact: true,
                withBorder: true,
                onDark: true
            }
        });
        expect(wrapper.classes().sort()).toEqual(['button', 'primary', 'compact', 'with-border', 'on-dark'].sort());
    });

    it('renders disabled state', () => {
        let wrapper = shallowMount(Button, {
            propsData: {
                disabled: true
            }
        });
        expect(wrapper.attributes('disabled')).toEqual('disabled');
        expect(wrapper.classes().sort()).toEqual(['button', 'disabled'].sort());
    });

    it('accepts any optional attribute', () => {
        const wrapper = shallowMount(Button, {
            propsData: {
                href: 'testhref',
                id: 'testId'
            }
        });
        expect(wrapper.attributes('id')).toEqual('testId');
    });

    it('has native and generic click handler events', () => {
        /* Depending on the `to` and `href` attributes, the component renders either a native button or a (nuxt-)link.
        * To make sure click handlers work with both, we need to set the `@click` or the `@click.native` handler
        * cf. https://stackoverflow.com/a/41476882/5134084 */

        // test for nuxt-link
        let wrapper = shallowMount(Button, {
            propsData: {
                to: 'route-test'
            }
        });
        expect(wrapper.vnode.data.on.click).toBeDefined();
        expect(wrapper.vnode.data.nativeOn.click).toBeDefined();

        // test for a element
        wrapper = shallowMount(Button, {
            propsData: {
                href: 'http://www.test.de'
            }
        });
        expect(wrapper.vnode.data.on.click).toBeDefined();
        expect(wrapper.vnode.data.nativeOn).not.toBeDefined();

        // test for button element
        wrapper = shallowMount(Button);
        expect(wrapper.vnode.data.on.click).toBeDefined();
        expect(wrapper.vnode.data.nativeOn).not.toBeDefined();
    });

    it('emits events', () => {
        let wrapper = shallowMount(Button);
        let button = wrapper.find('button');
        button.vm.$emit('click');
        expect(wrapper.emittedByOrder().map(e => e.name)).toEqual(['click']);
    });

    it('emits event on space key if button', () => {
        let wrapper = shallowMount(Button);
        let onClickSpy = jest.spyOn(wrapper.vm, 'onClick');
        wrapper.trigger('keydown.space', {
            code: 'Space'
        });
        expect(onClickSpy).toHaveBeenCalled();
        expect(wrapper.emitted('click')).toBeTruthy();
    });

    it('does not emit event on enter key if button', () => {
        let wrapper = shallowMount(Button);
        let onClickSpy = jest.spyOn(wrapper.vm, 'onClick');
        wrapper.trigger('keydown.enter', {
            code: 'Enter'
        });
        expect(onClickSpy).not.toHaveBeenCalled();
        expect(wrapper.emitted('click')).toBeFalsy();
    });

    it('emits event on enter key if link', () => {
        let wrapper = shallowMount(Button, {
            propsData: {
                href: 'testhref',
                id: 'testId'
            }
        });
        let onClickSpy = jest.spyOn(wrapper.vm, 'onClick');
        wrapper.trigger('keydown.enter', {
            code: 'Enter'
        });
        expect(onClickSpy).toHaveBeenCalled();
        expect(wrapper.emitted('click')).toBeTruthy();
    });

    it('does not emit event on space key if link', () => {
        let wrapper = shallowMount(Button, {
            propsData: {
                href: 'testhref',
                id: 'testId'
            }
        });
        let onClickSpy = jest.spyOn(wrapper.vm, 'onClick');
        wrapper.trigger('keydown.space', {
            code: 'Space'
        });
        expect(onClickSpy).toHaveBeenCalled();
        expect(wrapper.emitted('click')).toBeFalsy();
    });

    it('allows preventing default', () => {
        let wrapper = shallowMount(Button, {
            propsData: {
                preventDefault: true
            }
        });
        let spy = jest.fn();
        let button = wrapper.find('button');
        button.trigger('click', {
            preventDefault: spy
        });
        expect(spy).toHaveBeenCalled();
        expect(wrapper.emittedByOrder().map(e => e.name)).toEqual(['click']);
    });
});
