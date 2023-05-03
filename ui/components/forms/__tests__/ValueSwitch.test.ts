import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';

import ValueSwitch from '../ValueSwitch.vue';
import BaseRadioButtons from '../BaseRadioButtons.vue';

describe('ValueSwitch.vue', () => {
    const possibleValues = new Array(3)
        .fill(0)
        .map((_, index) => ({
            id: `test${index + 1}`,
            text: `Text ${index + 1}`,
            disabled: false
        }));

    it('renders and passes props to BaseRadioButtons', () => {
        const modelValue = 'test3';
        const wrapper = mount(ValueSwitch, {
            props: {
                possibleValues,
                modelValue
            }
        });

        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.isVisible()).toBeTruthy();
        const baseComponent = wrapper.findComponent(BaseRadioButtons);
        expect(baseComponent.props('possibleValues')).toStrictEqual(possibleValues);
        expect(baseComponent.props('modelValue')).toBe(modelValue);
    });

    it('applies variant class', async () => {
        const wrapper = mount(ValueSwitch, {
            props: {
                possibleValues,
                variant: 'normal'
            }
        });

        expect(wrapper.classes()).toContain('normal');

        await wrapper.setProps({ variant: 'compact' });

        expect(wrapper.classes()).toContain('compact');
    });
});
