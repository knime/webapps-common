import { shallowMount } from '@vue/test-utils';

import Button from '~/ui/components/Button';

describe('Button.vue', () => {
    it('renders a button', () => {
        const wrapper = shallowMount(Button);
        expect(wrapper.is('button')).toBeTruthy();
        expect(typeof wrapper.attributes().href === 'undefined').toBeTruthy();
        expect(wrapper.classes()).toEqual(['button-primary']);
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
                compact: true,
                withBorder: true,
                onDark: true
            }
        });
        expect(wrapper.classes().sort()).toEqual(['button-primary', 'compact', 'with-border', 'on-dark'].sort());
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

    it('emits events', () => {
        let wrapper = shallowMount(Button);
        let button = wrapper.find('button');
        // workaround to make .native listener work with vue-test-utils
        button.element.addEventListener('click', wrapper.vnode.data.nativeOn.click);
        button.trigger('click');
        expect(wrapper.emittedByOrder().map(e => e.name)).toEqual(['click']);
    });

    it('allows preventing default', () => {
        let wrapper = shallowMount(Button, {
            propsData: {
                preventDefault: true
            }
        });
        let spy = jest.fn();
        let button = wrapper.find('button');
        // workaround to make .native listener work with vue-test-utils
        button.element.addEventListener('click', wrapper.vnode.data.nativeOn.click);
        button.trigger('click', {
            preventDefault: spy
        });
        expect(spy).toHaveBeenCalled();
        expect(wrapper.emittedByOrder().map(e => e.name)).toEqual(['click']);
    });
});
