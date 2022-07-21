/* eslint-disable no-magic-numbers */
import { shallowMount } from '@vue/test-utils';

import NumberInput from '~/ui/components/forms/NumberInput.vue';

describe('NumberInput.vue', () => {
    let propsData, wrapper;

    beforeEach(() => {
        propsData = {
            value: 10,
            min: 0,
            max: 20,
            title: 'knime',
            type: 'double'
        };

        wrapper = shallowMount(NumberInput, {
            propsData
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
        wrapper.setProps({ value: -5 });
        expect(wrapper.vm.validate()).toStrictEqual(
            { errorMessage: 'Current value is outside allowed range.', isValid: false }
        );
        wrapper.setProps({ value: 25 });
        expect(wrapper.vm.validate()).toStrictEqual(
            { errorMessage: 'Current value is outside allowed range.', isValid: false }
        );
        wrapper.setProps({ value: 5 });
        expect(wrapper.vm.validate().isValid).toBe(true);
    });

    it('has validate logic to check non-numeric values', () => {
        expect(wrapper.vm.validate().isValid).toBe(true);
        wrapper.setProps({ value: 'test' });
        expect(wrapper.vm.validate()).toStrictEqual({ errorMessage: 'Current value is not a number.', isValid: false });
    });

    it('prevents changing value with spinners when result would be invalid', () => {
        expect(wrapper.vm.getValue()).toBe(10);
        wrapper.setProps({ value: -5 });
        expect(wrapper.vm.validate()).toStrictEqual(
            { errorMessage: 'Current value is outside allowed range.', isValid: false }
        );
        wrapper.vm.changeValue(-1);
        expect(wrapper.vm.getValue()).toBe(-5);
        wrapper.vm.changeValue(1);
        expect(wrapper.vm.getValue()).toBe(1);
        expect(wrapper.vm.validate().isValid).toBe(true);
        wrapper.setProps({ value: 25 });
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
        jest.useFakeTimers();
        let event = {
            type: 'mousedown'
        };

        expect(wrapper.vm.getValue()).toBe(10);
        wrapper.vm.mouseEvent(event, 'increase');
        jest.advanceTimersByTime(50);
        wrapper.vm.mouseEvent({}, 'increase');
        expect(wrapper.vm.getValue()).toBe(10.1);
        wrapper.vm.mouseEvent(event, 'decrease');
        jest.advanceTimersByTime(50);
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
        wrapper.setProps({ value: '3e5' });
        expect(wrapper.vm.getValue()).toStrictEqual(300000);
        wrapper.setProps({ value: '4.423532523e5' });
        expect(wrapper.vm.getValue()).toStrictEqual(442353.2523);
    });
});
