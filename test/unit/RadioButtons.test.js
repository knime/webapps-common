import { mount } from '@vue/test-utils';

import RadioButtons from '~/ui/components/forms/RadioButtons';

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

    it('renders', () => {
        const wrapper = mount(RadioButtons, {
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

    it('renders when possibleValues is empty', () => {
        expect(mount(RadioButtons).html()).toBeTruthy();
    });

    it('renders horizontal by default', () => {
        const wrapper = mount(RadioButtons, {
            propsData: {
                possibleValues
            }
        });
        expect(wrapper.props('alignment')).toBe('horizontal');
        expect(wrapper.find('div').classes()).toContain('horizontal');
    });

    it('renders vertical', () => {
        const wrapper = mount(RadioButtons, {
            propsData: {
                possibleValues,
                alignment: 'vertical'
            }
        });
        expect(wrapper.find('div').classes()).toContain('vertical');
    });

    it('renders selected value', () => {
        let value = 'test3';
        const wrapper = mount(RadioButtons, {
            propsData: {
                possibleValues,
                value
            }
        });

        let radioInputs = wrapper.findAll('input[type=radio]');
        possibleValues.forEach((option, i) => {
            if (option.id === value) {
                expect(radioInputs.at(i).element.checked).toBeTruthy();
            } else {
                expect(radioInputs.at(i).element.checked).not.toBeTruthy();
            }
        });
    });

    it('emits event for selected value', () => {
        const wrapper = mount(RadioButtons, {
            propsData: {
                possibleValues
            }
        });
        let newValue = 'test2';
        let input = wrapper.find(`input[value=${newValue}]`);
        input.setChecked(true);
        expect(wrapper.emitted().input[0][0]).toEqual(newValue);
    });

    it('provides a valid hasSelection method', () => {
        const wrapper = mount(RadioButtons, {
            propsData: {
                possibleValues
            }
        });
        expect(wrapper.vm.hasSelection()).toBe(false);

        let input = wrapper.find('input[value=test2]');
        input.element.checked = true; // setChecked does not work in this case
        expect(wrapper.vm.hasSelection()).toBe(true);
    });

});
