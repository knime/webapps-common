import { mount } from '@vue/test-utils';

import Checkbox from '~/ui/components/forms/Checkbox';

describe('Checkbox.vue', () => {
    it('renders', () => {
        const wrapper = mount(Checkbox, {
            propsData: {
                value: false
            }
        });
        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.isVisible()).toBeTruthy();
        expect(wrapper.is('label')).toBeTruthy();
        expect(wrapper.find('input').element.checked).toBe(false);
    });

    it('renders checked state', () => {
        const wrapper = mount(Checkbox, {
            propsData: {
                value: true
            }
        });
        expect(wrapper.find('input').element.checked).toBe(true);
    });

    it('emits input events', () => {
        const wrapper = mount(Checkbox, {
            propsData: {
                value: true
            }
        });
        wrapper.vm.onChange({ target: false });
        expect(wrapper.emitted().input).toBeTruthy();
    });
});
