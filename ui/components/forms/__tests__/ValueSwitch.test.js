import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';

import ValueSwitch from '../ValueSwitch.vue';
import BaseRadioButtons from '../BaseRadioButtons.vue';

describe('ValueSwitch.vue', () => {
    let possibleValues;

    beforeEach(() => {
        possibleValues = [{
            id: 'test1',
            text: 'Text 1'
        }, {
            id: 'test2',
            text: 'Text 2'
        }, {
            id: 'test3',
            text: 'Text 3'
        }];
    });
    
    it('renders and passes props to BaseRadioButtons', () => {
        let modelValue = 'test3';
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
});
