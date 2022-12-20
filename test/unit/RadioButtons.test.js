import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';

import RadioButtons from '../RadioButtons.vue';
import BaseRadioButtons from '../BaseRadioButtons.vue';

describe('RadioButtons.vue', () => {
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

    it('renders and passes props to BaseRadioButtons', () => {
        let value = 'test3';
        const wrapper = mount(RadioButtons, {
            props: {
                possibleValues,
                value
            }
        });
        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.isVisible()).toBeTruthy();

        const baseComponent = wrapper.findComponent(BaseRadioButtons);
        expect(baseComponent.props('possibleValues')).toBe(possibleValues);
        expect(baseComponent.props('value')).toBe(value);
    });

    it('passes-through all listeners', () => {
        let wrapper = mount(RadioButtons, {
            listeners: {
                fakeEvent: vi.fn()
            }
        });
        expect(wrapper.findComponent(BaseRadioButtons).vm.$listeners).toHaveProperty('fakeEvent');
    });

    it('renders horizontal by default', () => {
        const wrapper = mount(RadioButtons, {
            props: {
                possibleValues
            }
        });
        expect(wrapper.props('alignment')).toBe('horizontal');
        expect(wrapper.find('div').classes()).toContain('horizontal');
    });

    it('renders vertical', () => {
        const wrapper = mount(RadioButtons, {
            props: {
                possibleValues,
                alignment: 'vertical'
            }
        });
        expect(wrapper.find('div').classes()).toContain('vertical');
    });

    it('provides a valid hasSelection method', () => {
        const wrapper = mount(RadioButtons, {
            props: {
                possibleValues
            }
        });
        expect(wrapper.vm.hasSelection()).toBe(false);

        let input = wrapper.find('input[value=test2]');
        input.element.checked = true; // setChecked does not work in this case
        expect(wrapper.vm.hasSelection()).toBe(true);
    });
});
