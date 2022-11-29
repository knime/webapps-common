import { describe, it, expect } from 'vitest';
import { shallowMount, mount, RouterLinkStub } from '@vue/test-utils';

import BaseButton from '../BaseButton.vue';

// TODO fix and improve test
describe.skip('BaseButton.vue', () => {
    it('renders a button', () => {
        const wrapper = shallowMount(BaseButton);
        expect(typeof wrapper.attributes().href === 'undefined').toBeTruthy();
    });

    it('renders an anchor tag', () => {
        const wrapper = shallowMount(BaseButton, {
            props: {
                href: 'testhref'
            },
            global: {
                stubs: {
                    NuxtLink: '<div></div>'
                }
            }
        });
        
        expect(wrapper.find('a').attributes('href')).toEqual('testhref');
    });

    it('has native and generic click handler events', () => {
        /* Depending on the `to` and `href` attributes, the component renders either a native button or a (nuxt-)link.
        * To make sure click handlers work with both, we need to set the `@click` handler
        * cf. https://stackoverflow.com/a/41476882/5134084 */

        // test for nuxt-link
        let wrapper = shallowMount(BaseButton, {
            props: {
                to: 'route-test'
            }
        });
        wrapper.$emit('click');
        expect(wrapper.emitted('click')).toBeDefined();

        // test for a element
        wrapper = shallowMount(BaseButton, {
            props: {
                href: 'http://www.test.de'
            }
        });
        expect(wrapper.vnode.data.on.click).toBeDefined();

        // test for button element
        wrapper = shallowMount(BaseButton);
        expect(wrapper.vnode.data.on.click).toBeDefined();
    });

    it('emits events', () => {
        let wrapper = shallowMount(BaseButton);
        let button = wrapper.find('button');
        button.vm.$emit('click');
        expect(wrapper.emittedByOrder().map(e => e.name)).toEqual(['click']);
    });

    it('allows preventing default', () => {
        let wrapper = shallowMount(BaseButton, {
            props: {
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
