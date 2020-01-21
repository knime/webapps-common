import { mount } from '@vue/test-utils';

import TextArea from '~/ui/components/forms/TextArea';

describe('TextArea.vue', () => {
    it('renders', () => {
        const wrapper = mount(TextArea, {
            propsData: {
                value: 'Test value'
            }
        });
        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.isVisible()).toBeTruthy();
        let textArea = wrapper.find('textarea');
        expect(textArea.element.value).toBe('Test value');
    });

    it('renders invalid state', () => {
        const wrapper = mount(TextArea, {
            propsData: {
                value: 'Test value',
                isValid: false
            }
        });
        let marker = wrapper.find('span');
        expect(marker.classes()).toContain('invalid-marker');
    });

    it('emits input events', () => {
        const wrapper = mount(TextArea);
        const newValue = 'new value';
        let textArea = wrapper.find('textarea');
        textArea.setValue(newValue);
        expect(wrapper.emitted().input[0][0]).toEqual(newValue);
    });
});
