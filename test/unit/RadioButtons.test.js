import { mount } from '@vue/test-utils';

import RadioButtons from '~/ui/components/forms/RadioButtons';

describe('RadioButtons.vue', () => {
    let possibleValues;

    beforeEach(() => {
        possibleValues = [{
            id: 'test1',
            text: 'test1'
        }, {
            id: 'test2',
            text: 'test2'
        }, {
            id: 'test3',
            text: 'test3'
        }, {
            id: 'test4',
            text: 'test4'
        }, {
            id: 'test5',
            text: 'test5'
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
        expect(wrapper.findAll('input[type=radio]').length).toBe(possibleValues.length);
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

    it('sets the values to the checked value', () => {
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
        let input = wrapper.find('input[value=test2]');
        input.element.checked = true; // setChecked does not work in this case
        expect(wrapper.vm.hasSelection()).toBe(true);
    });

});
