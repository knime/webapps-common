import { mount, shallowMount } from '@vue/test-utils';

import Checkboxes from '~/ui/components/forms/Checkboxes.vue';
import Checkbox from '~/ui/components/forms/Checkbox.vue';

describe('Checkboxes.vue', () => {
    let propsData;

    beforeEach(() => {
        propsData = {
            possibleValues: [{
                id: 'test1',
                text: 'test1'
            }, {
                id: 'test2',
                text: 'test2'
            }, {
                id: 'test3',
                text: 'test3'
            }]
        };
    });

    it('renders', () => {
        const wrapper = mount(Checkboxes, {
            propsData
        });
        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.isVisible()).toBeTruthy();
        let checkboxes = wrapper.findAll(Checkbox);
        propsData.possibleValues.forEach((value, i) => {
            expect(checkboxes.at(i).text()).toContain(value.text);
        });
        expect(checkboxes.length).toBe(propsData.possibleValues.length);
    });

    it('sets the values to the checked value', () => {
        const wrapper = mount(Checkboxes, {
            propsData: {
                ...propsData,
                value: ['test1']
            }
        });
        // current value
        expect(wrapper.findAll(Checkbox).at(0).props('value')).toBe(true);
        expect(wrapper.vm.hasSelection()).toBe(true);

        let checkboxTest2 = wrapper.findAll(Checkbox).at(1);

        // check the Checkbox 'test2'
        checkboxTest2.vm.onInput({ target: { checked: true } });
        expect(wrapper.emitted().input[0][0]).toStrictEqual(['test1', 'test2']);

        // test uncheck 'test2'
        checkboxTest2.vm.onInput({ target: { checked: false } });
        expect(wrapper.emitted().input[1][0]).toStrictEqual(['test1']);
    });

    it('provides a valid hasSelection method', () => {
        const wrapper = mount(Checkboxes, {
            propsData
        });
        expect(wrapper.vm.hasSelection()).toBe(false);

        wrapper.setProps({ value: ['test1'] });
        expect(wrapper.vm.hasSelection()).toBe(true);
    });

    it('validation of possibleValues', () => {
        const wrapper = shallowMount(Checkboxes);

        const propPossibleValues = wrapper.vm.$options.props.possibleValues;
        expect(propPossibleValues.required).toBeFalsy();
        expect(propPossibleValues.type).toBe(Array);
        expect(propPossibleValues.validator && propPossibleValues.validator('str')).toBeFalsy();
        expect(propPossibleValues.validator && propPossibleValues.validator([])).toBeTruthy();
    });
});
