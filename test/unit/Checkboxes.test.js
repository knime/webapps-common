import { mount } from '@vue/test-utils';

import Checkboxes from '~/ui/components/forms/Checkboxes';
import Checkbox from '~/ui/components/forms/Checkbox';

describe('Checkboxes.vue', () => {
    it('renders', () => {
        let propsData = {
            possibleValues: [{
                id: 'test1',
                text: 'test1'
            }, {
                id: 'test2',
                text: 'test2'
            }, {
                id: 'test3',
                text: 'test3'
            }],
            value: []
        };
        const wrapper = mount(Checkboxes, {
            propsData
        });
        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.isVisible()).toBeTruthy();
        expect(wrapper.findAll(Checkbox).length).toBe(propsData.possibleValues.length);
    });

    it('sets the values to the checked value', () => {
        const wrapper = mount(Checkboxes, {
            propsData: {
                possibleValues: [{
                    id: 'test1',
                    text: 'test1'
                }, {
                    id: 'test2',
                    text: 'test2'
                }, {
                    id: 'test3',
                    text: 'test3'
                }],
                value: ['test1']
            }
        });
        let input = wrapper.findAll(Checkbox).at(1);
        input.vm.onInput({ target: { checked: true } });
        expect(wrapper.emitted().input[0][0]).toStrictEqual(['test1', 'test2']);
    });

});
