/* eslint-disable no-magic-numbers */
import { describe, it, expect, vi } from 'vitest';
import { shallowMount } from '@vue/test-utils';

import NumberInput from '../NumberInput.vue';

describe('NumberInput.vue', () => {
    let props, wrapper;

    beforeEach(() => {
        props = {
            modelValue: 10,
            min: 0,
            max: 20,
            title: 'knime',
            type: 'double'
        };

        wrapper = shallowMount(NumberInput, {
            props
        });
    });

    it('renders', () => {
        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.isVisible()).toBeTruthy();
    });

    it('renders invalid style', () => {
        wrapper.setProps({ isValid: false });
        expect(wrapper.find('.invalid-marker').exists()).toBe(true);
        wrapper.setProps({ isValid: true });
        expect(wrapper.find('.invalid-marker').exists()).toBe(false);
    });

    it('has validate logic to check min/max values', () => {
        expect(wrapper.vm.validate().isValid).toBe(true);
        wrapper.setProps({ modelValue: -5 });
        expect(wrapper.vm.validate()).toStrictEqual(
            { errorMessage: 'Current value is outside allowed range.', isValid: false }
        );
        wrapper.setProps({ modelValue: 25 });
        expect(wrapper.vm.validate()).toStrictEqual(
            { errorMessage: 'Current value is outside allowed range.', isValid: false }
        );
        wrapper.setProps({ modelValue: 5 });
        expect(wrapper.vm.validate().isValid).toBe(true);
    });

    it('has validate logic to check non-numeric values', () => {
        expect(wrapper.vm.validate().isValid).toBe(true);
        wrapper.setProps({ modelValue: 'test' });
        expect(wrapper.vm.validate()).toStrictEqual({ errorMessage: 'Current value is not a number.', isValid: false });
    });

    it('prevents changing value with spinners when result would be invalid', () => {
        expect(wrapper.vm.getValue()).toBe(10);
        wrapper.setProps({ modelValue: -5 });
        expect(wrapper.vm.validate()).toStrictEqual(
            { errorMessage: 'Current value is outside allowed range.', isValid: false }
        );
        wrapper.vm.changeValue(-1);
        expect(wrapper.vm.getValue()).toBe(-5);
        wrapper.vm.changeValue(1);
        expect(wrapper.vm.getValue()).toBe(1);
        expect(wrapper.vm.validate().isValid).toBe(true);
        wrapper.setProps({ modelValue: 25 });
        expect(wrapper.vm.validate()).toStrictEqual(
            { errorMessage: 'Current value is outside allowed range.', isValid: false }
        );
        wrapper.vm.changeValue(1);
        expect(wrapper.vm.getValue()).toBe(25);
        wrapper.vm.changeValue(-1);
        expect(wrapper.vm.getValue()).toBe(19);
        expect(wrapper.vm.validate().isValid).toBe(true);
    });

    it('increments up and down properly with spinner controls', () => {
        vi.useFakeTimers();
        let event = {
            type: 'mousedown'
        };

        expect(wrapper.vm.getValue()).toBe(10);
        wrapper.vm.mouseEvent(event, 'increase');
        vi.advanceTimersByTime(50);
        wrapper.vm.mouseEvent({}, 'increase');
        expect(wrapper.vm.getValue()).toBe(10.1);
        wrapper.vm.mouseEvent(event, 'decrease');
        vi.advanceTimersByTime(50);
        wrapper.vm.mouseEvent({}, 'decrease');
        expect(wrapper.vm.getValue()).toBe(10);
    });

    it('applies hover class', () => {
        const input = wrapper.find('input');
        expect(input.find('.hover').exists()).toBe(false);
        input.trigger('mouseenter');
        expect(input.find('.hover').exists()).toBe(true);
        input.trigger('mouseleave');
        expect(input.find('.hover').exists()).toBe(false);
    });

    it('transforms to (standard) scientific notation', () => {
        wrapper.setProps({ modelValue: '3e5' });
        expect(wrapper.vm.getValue()).toStrictEqual(300000);
        wrapper.setProps({ modelValue: '4.423532523e5' });
        expect(wrapper.vm.getValue()).toStrictEqual(442353.2523);
    });

    it('accepts decimal point as separator', () => {
        const mockEvent = {
            data: '5',
            inputType: '',
            target: {
                modelValue: '1.5'
            }
        };
        wrapper.vm.$refs.input.value = '1.5';
       
        wrapper.vm.onInput(mockEvent);
        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
        expect(wrapper.emitted('update:modelValue')[0][0]).toStrictEqual(1.5);
    });

    it('converts invalid decimal point to number', () => {
        const mockEvent = {
            data: '.',
            inputType: '',
            target: {
                modelValue: ''
            }
        };
        wrapper.vm.$refs.input.value = '1.';
        
        wrapper.vm.onInput(mockEvent);
        expect(wrapper.emitted('update:modelValue')).toBeFalsy();
    });

    it('accepts decimal point as separator on delete', () => {
        const mockEvent = {
            data: null,
            inputType: 'deleteContentBackward',
            target: {
                modelValue: ''
            }
        };
        wrapper.vm.$refs.input.value = '0';

        wrapper.vm.onInput(mockEvent);
        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
        expect(wrapper.emitted('update:modelValue')[0][0]).toStrictEqual(1);
    });
});
