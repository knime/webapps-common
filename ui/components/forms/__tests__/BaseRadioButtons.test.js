import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';

import BaseRadioButtons from '../BaseRadioButtons.vue';

describe('BaseRadioButtons.vue', () => {
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
        }, {
            id: 'test4',
            text: 'Text 4'
        }, {
            id: 'test5',
            text: 'Text 5'
        }];
    });

    it('renders', () => {
        const wrapper = mount(BaseRadioButtons, {
            props: {
                possibleValues
            }
        });
        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.isVisible()).toBeTruthy();

        let labels = wrapper.findAll('label');
        expect(labels.length).toBe(possibleValues.length);
        possibleValues.forEach((value, i) => {
            expect(labels.at(i).text()).toContain(value.text);
        });
    });

    it('renders a name value', () => {
        let value = 'test3';
        let wrapper = mount(BaseRadioButtons, {
            props: {
                possibleValues,
                value
            }
        });

        // right now depends on the position of the test
        expect(wrapper.find('input').attributes('name')).toBe('wc-radio-2');

        wrapper = mount(BaseRadioButtons, {
            props: {
                possibleValues,
                value,
                name: 'custom-name'
            }
        });
        expect(wrapper.find('input').attributes('name')).toBe('custom-name');
    });

    it('renders when possibleValues is empty', () => {
        expect(mount(BaseRadioButtons).html()).toBeTruthy();
    });

    it('renders unique name attributes', () => {
        let wrapper1 = mount(BaseRadioButtons, {
            props: {
                possibleValues
            }
        });
        let wrapper2 = mount(BaseRadioButtons, {
            props: {
                possibleValues
            }
        });

        expect(wrapper1.vm.count).not.toBe(wrapper2.vm.count);
        expect(wrapper1.find('input').attributes().name).not.toBe(wrapper2.find('input').attributes().name);
    });

    it('renders selected value', () => {
        let modelValue = 'test3';
        const wrapper = mount(BaseRadioButtons, {
            props: {
                possibleValues,
                modelValue
            }
        });

        let radioInputs = wrapper.findAll('input[type=radio]');
        possibleValues.forEach((option, i) => {
            if (option.id === modelValue) {
                expect(radioInputs[i].element.checked).toBeTruthy();
            } else {
                expect(radioInputs[i].element.checked).not.toBeTruthy();
            }
        });
    });

    it('emits event for selected value', () => {
        const wrapper = mount(BaseRadioButtons, {
            props: {
                possibleValues
            }
        });
        let newValue = 'test2';
        let input = wrapper.find(`input[value=${newValue}]`);
        input.setChecked(true);
        expect(wrapper.emitted('update:modelValue')[0][0]).toEqual(newValue);
    });

    it('validates possibleValues', () => {
        const wrapper = mount(BaseRadioButtons, {
            props: {
                possibleValues
            }
        });
        const propPossibleValues = wrapper.vm.$options.props.possibleValues;
        expect(propPossibleValues.required).toBeFalsy();
        expect(propPossibleValues.type).toBe(Array);
        expect(propPossibleValues.validator && propPossibleValues.validator('str')).toBeFalsy();
        expect(propPossibleValues.validator && propPossibleValues.validator(possibleValues)).toBeTruthy();
    });
});
