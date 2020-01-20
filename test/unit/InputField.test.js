import { mount } from '@vue/test-utils';

import InputField from '~/ui/components/forms/InputField';

describe('InputField.vue', () => {
    it('renders', () => {
        const wrapper = mount(InputField, {
            propsData: {
                value: 'Test value'
            }
        });
        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.isVisible()).toBeTruthy();
        expect(wrapper.is('div')).toBeTruthy();
        let input = wrapper.find('input');
        expect(input.attributes('type')).toBe('text'); // default
        expect(input.element.value).toBe('Test value');
    });

    it('renders invalid state', () => {
        const wrapper = mount(InputField, {
            propsData: {
                value: 'Test value',
                isValid: false
            }
        });
        let input = wrapper.find('input');
        expect(input.classes()).toContain('invalid');
    });

    it('renders with icon slot', () => {
        const wrapper = mount(InputField, {
            slots: {
                icon: '<svg />'
            }
        });
        expect(wrapper.find('input').classes()).toContain('with-icon');
        expect(wrapper.find('svg').exists()).toBeTruthy();
    });

    it('renders custom type', () => {
        const wrapper = mount(InputField, {
            propsData: {
                type: 'password'
            }
        });
        let input = wrapper.find('input');
        expect(input.attributes('type')).toBe('password');
    });

    it('validates without pattern', () => {
        const wrapper = mount(InputField, {
            propsData: {
                value: 'b'
            }
        });
        expect(wrapper.vm.validate()).toBe(true);
    });

    it('invalidates non-matching pattern', () => {
        const wrapper = mount(InputField, {
            propsData: {
                value: 'b',
                pattern: '^a'
            }
        });
        expect(wrapper.vm.validate()).toBe(false);
    });

    it('emits input events', () => {
        const wrapper = mount(InputField);
        const newValue = 'new value';
        let input = wrapper.find('input');
        input.setValue(newValue);
        expect(wrapper.emitted().input[0][0]).toEqual(newValue);
    });
});
