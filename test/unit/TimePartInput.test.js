/* eslint-disable no-magic-numbers */
import { shallowMount, mount } from '@vue/test-utils';

import TimePartInput from '../../ui/components/forms/TimePartInput';

describe('TimePartInput.vue', () => {
    let propsData, wrapper;

    beforeEach(() => {
        propsData = {
            value: 10,
            min: 0,
            max: 59,
            title: 'seconds',
            minDigits: 2
        };

        wrapper = shallowMount(TimePartInput, {
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
            {
                errorMessage: 'Current value is outside allowed range.',
                isValid: false
            }
        );
        wrapper.setProps({ value: 65 });
        expect(wrapper.vm.validate()).toStrictEqual(
            {
                errorMessage: 'Current value is outside allowed range.',
                isValid: false
            }
        );
        wrapper.setProps({ value: 5 });
        expect(wrapper.vm.validate().isValid).toBe(true);
    });

    it('has validate logic to check non-numeric values', () => {
        expect(wrapper.vm.validate().isValid).toBe(true);
        wrapper.setProps({ value: 'test' });
        expect(wrapper.vm.validate()).toStrictEqual({
            errorMessage: 'Current value is not a number.',
            isValid: false
        });
    });

    it('prevents changing value with spinners when result would be invalid', () => {
        expect(wrapper.vm.getValue()).toBe(10);
        wrapper.setProps({ value: -5 });
        expect(wrapper.vm.validate()).toStrictEqual(
            {
                errorMessage: 'Current value is outside allowed range.',
                isValid: false
            }
        );
        wrapper.vm.changeValue(-1);
        expect(wrapper.vm.getValue()).toBe(-5);
        wrapper.vm.changeValue(1);
        expect(wrapper.vm.getValue()).toBe(1);
        expect(wrapper.vm.validate().isValid).toBe(true);
        wrapper.setProps({ value: 65 });
        expect(wrapper.vm.validate()).toStrictEqual(
            {
                errorMessage: 'Current value is outside allowed range.',
                isValid: false
            }
        );
        wrapper.vm.changeValue(1);
        expect(wrapper.vm.getValue()).toBe(65);
        wrapper.vm.changeValue(-1);
        expect(wrapper.vm.getValue()).toBe(58);
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
        expect(wrapper.vm.getValue()).toBe(11);
        wrapper.vm.mouseEvent(event, 'decrease');
        jest.advanceTimersByTime(50);
        wrapper.vm.mouseEvent({}, 'decrease');
        expect(wrapper.vm.getValue()).toBe(10);
    });

    it('pads the value with zeros on the left side if minDigits prop is set', () => {
        propsData.value = 11;
        propsData.minDigits = 5;
        propsData.max = 100;
        propsData.min = -100;
        let wrapper2 = mount(TimePartInput, {
            propsData
        });
        // formats value on initial render
        const inputElement = wrapper2.find({ ref: 'input' }).element;
        expect(inputElement.value).toBe('00011');
        // updates format if prop changes
        wrapper2.setProps({ value: 22 });
        expect(inputElement.value).toBe('00022');
        // does not format negative values
        wrapper2.setProps({ value: -65 });
        expect(inputElement.value).toBe('-65');
    });

    it('applies hover class', () => {
        const input = wrapper.find('input');
        expect(input.find('.hover').exists()).toBe(false);
        input.trigger('mouseenter');
        expect(input.find('.hover').exists()).toBe(true);
        input.trigger('mouseleave');
        expect(input.find('.hover').exists()).toBe(false);
    });

    it('handles @wheel event', () => {
        const input = wrapper.find('input');
        input.trigger('wheel', { deltaY: -3 });
        expect(wrapper.emitted().input[0][0]).toBe(11);
        input.trigger('wheel', { deltaY: 3 });
        input.trigger('wheel', { deltaY: 3 });
        expect(wrapper.emitted().input[2][0]).toBe(9);
    });

    it('emits @bounds if max value would be exceeded', () => {
        // does not emit via props
        wrapper.setProps({ value: 62 });
        expect(wrapper.emitted().bounds).toBeUndefined();

        // emits using changeValue
        wrapper.setProps({ value: 59 });
        wrapper.vm.changeValue(1);
        expect(wrapper.emitted().bounds[0][0]).toStrictEqual({
            input: 60,
            limit: 59,
            type: 'max',
            value: 59
        });

        // emits via onInput
        wrapper.setProps({ value: 20 });
        const input = wrapper.find({ ref: 'input' });
        input.element.value = '63';
        input.trigger('input');
        expect(wrapper.emitted().bounds[1][0]).toStrictEqual({
            input: 63,
            limit: 59,
            type: 'max',
            value: 59
        });
    });

    it('emits @bounds if min value would be exceeded', () => {
        // does not emit via props
        wrapper.setProps({ value: -1 });
        expect(wrapper.emitted().bounds).toBeUndefined();

        // emits using changeValue
        wrapper.setProps({ value: 0 });
        wrapper.vm.changeValue(-1);
        expect(wrapper.emitted().bounds[0][0]).toStrictEqual({
            input: -1,
            limit: 0,
            type: 'min',
            value: 0
        });

        // emits via onInput
        wrapper.setProps({ value: 0 });
        const input = wrapper.find({ ref: 'input' });
        input.element.value = '-5';
        input.trigger('input');
        expect(wrapper.emitted().bounds[1][0]).toStrictEqual({
            input: -5,
            limit: 0,
            type: 'min',
            value: 0
        });
    });

});
