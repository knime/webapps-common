import { mount } from '@vue/test-utils';

import ValueSwitch from '~/ui/components/forms/ValueSwitch';

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

    it('renders', () => {
        const wrapper = mount(ValueSwitch, {
            propsData: {
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

    it('renders selected value', () => {
        let value = 'test3';
        const wrapper = mount(ValueSwitch, {
            propsData: {
                possibleValues,
                value
            }
        });

        let switchValues = wrapper.findAll('input[type=radio]');
        possibleValues.forEach((option, i) => {
            if (option.id === value) {
                expect(switchValues.at(i).element.checked).toBeTruthy();
            } else {
                expect(switchValues.at(i).element.checked).not.toBeTruthy();
            }
        });
    });
});
