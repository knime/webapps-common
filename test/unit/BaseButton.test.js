import { shallowMount, mount, RouterLinkStub } from '@vue/test-utils';
import BaseButton from '~/ui/components/BaseButton';


describe('BaseButton.vue', () => {
    it('renders a button', () => {
        const wrapper = shallowMount(BaseButton);
        expect(typeof wrapper.attributes().href === 'undefined').toBeTruthy();
    });

    it('renders an anchor tag', () => {
        const wrapper = shallowMount(BaseButton, {
            propsData: {
                href: 'testhref'
            }
        });
        expect(wrapper.is('a')).toBeTruthy();
        expect(wrapper.attributes('href')).toEqual('testhref');
    });

    it('has native and generic click handler events', () => {
        /* Depending on the `to` and `href` attributes, the component renders either a native button or a (nuxt-)link.
        * To make sure click handlers work with both, we need to set the `@click` or the `@click.native` handler
        * cf. https://stackoverflow.com/a/41476882/5134084 */

        // test for nuxt-link
        let wrapper = shallowMount(BaseButton, {
            propsData: {
                to: 'route-test'
            }
        });
        expect(wrapper.vnode.data.on.click).toBeDefined();
        expect(wrapper.vnode.data.nativeOn.click).toBeDefined();

        // test for a element
        wrapper = shallowMount(BaseButton, {
            propsData: {
                href: 'http://www.test.de'
            }
        });
        expect(wrapper.vnode.data.on.click).toBeDefined();
        expect(wrapper.vnode.data.nativeOn).not.toBeDefined();

        // test for button element
        wrapper = shallowMount(BaseButton);
        expect(wrapper.vnode.data.on.click).toBeDefined();
        expect(wrapper.vnode.data.nativeOn).not.toBeDefined();
    });

    it('emits events', () => {
        let wrapper = shallowMount(BaseButton);
        let button = wrapper.find('button');
        button.vm.$emit('click');
        expect(wrapper.emittedByOrder().map(e => e.name)).toEqual(['click']);
    });

    it('emits event on space key if button', () => {
        let wrapper = shallowMount(BaseButton);
        let onClickSpy = jest.spyOn(wrapper.vm, 'onClick');
        wrapper.trigger('keydown.space', {
            code: 'Space'
        });
        expect(onClickSpy).toHaveBeenCalled();
        expect(wrapper.emitted('click')).toBeTruthy();
    });

    it('does not emit event on enter key if button', () => {
        let wrapper = shallowMount(BaseButton);
        let onClickSpy = jest.spyOn(wrapper.vm, 'onClick');
        wrapper.trigger('keydown.enter', {
            code: 'Enter'
        });
        expect(onClickSpy).not.toHaveBeenCalled();
        expect(wrapper.emitted('click')).toBeFalsy();
    });

    it('emits event on enter key if link', () => {
        let wrapper = shallowMount(BaseButton, {
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
        let wrapper = shallowMount(BaseButton, {
            propsData: {
                href: 'testhref'
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
        let wrapper = shallowMount(BaseButton, {
            propsData: {
                to: '/test',
                preventDefault: true
            }
        });
        let button = wrapper.find(RouterLinkStub);
        expect(button.props('event')).toStrictEqual([]);
    });

    it('gets focused when focus method is called', () => {
        const wrapper = mount(BaseButton);
        wrapper.vm.focus();
        expect(document.activeElement).toBe(wrapper.vm.$el);
    });
});
