import { mount } from '@vue/test-utils';

import ToggleSwitch from '~/ui/components/forms/ToggleSwitch.vue';

describe('ToggleSwitch.vue', () => {
    it('renders', () => {
        const wrapper = mount(ToggleSwitch, {
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
        const wrapper = mount(ToggleSwitch, {
            propsData: {
                value: true
            }
        });
        expect(wrapper.find('input').element.checked).toBe(true);
        expect(wrapper.vm.isChecked()).toBe(true);
    });

    it('emits input events', () => {
        const wrapper = mount(ToggleSwitch, {
            propsData: {
                value: true
            }
        });
        wrapper.vm.onInput({ target: false });
        expect(wrapper.emitted().input).toBeTruthy();
    });
});
