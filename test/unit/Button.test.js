import { shallowMount, mount } from '@vue/test-utils';

import Button from '~/ui/components/Button';
import BaseButton from '~/ui/components/BaseButton';

describe('Button.vue', () => {
    it('renders a button', () => {
        const wrapper = shallowMount(Button);
        expect(wrapper.find(BaseButton).exists()).toBeTruthy();
        expect(wrapper.classes()).toEqual(['button']);
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
        expect(wrapper.props('disabled')).toEqual(true);
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

});
