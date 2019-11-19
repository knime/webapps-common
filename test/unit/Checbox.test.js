import { mount } from '@vue/test-utils';

import Checkbox from '~/ui/components/forms/Checkbox';

describe('Checkbox.vue', () => {
    it('renders properly', () => {
        const wrapper = mount(Checkbox, {
            propsData: {
                value: true
            }
        });
        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.isVisible()).toBeTruthy();
        expect(wrapper.is('label')).toBeTruthy();
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
