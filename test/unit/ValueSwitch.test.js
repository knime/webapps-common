import { mount } from '@vue/test-utils';

import ValueSwitch from '~/ui/components/forms/ValueSwitch';
import BaseRadioButtons from '~/ui/components/forms/BaseRadioButtons';

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
        let value = 'test3';
        const wrapper = mount(ValueSwitch, {
            propsData: {
                possibleValues,
                value
            }
        });

        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.isVisible()).toBeTruthy();
        const baseComponent = wrapper.find(BaseRadioButtons);
        expect(baseComponent.props('possibleValues')).toBe(possibleValues);
        expect(baseComponent.props('value')).toBe(value);
    });

    it('passes-through all listeners', () => {
        let wrapper = mount(ValueSwitch, {
            listeners: {
                fakeEvent: jest.fn()
            }
        });
        expect(wrapper.find(BaseRadioButtons).vm.$listeners).toHaveProperty('fakeEvent');
    });
});
