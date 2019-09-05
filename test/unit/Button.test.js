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
        wrapper.find('button').trigger('click');
        expect(wrapper.emittedByOrder().map(e => e.name)).toEqual(['click']);
    });
});
