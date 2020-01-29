import { mount } from '@vue/test-utils';

import ListBox from '~/ui/components/forms/ListBox';

describe('ListBox.vue', () => {
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
            value: '',
            placeholder: '',
            ariaLabel: 'ListBox'
        };
        const wrapper = mount(ListBox, {
            propsData
        });
        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.isVisible()).toBeTruthy();
        expect(wrapper.findAll('li[role=option]').length).toBe(propsData.possibleValues.length);
    });

    it('sets the values to the clicked value', () => {
        let possibleValues = [{
            id: 'test1',
            text: 'test1'
        }, {
            id: 'test2',
            text: 'test2'
        }, {
            id: 'test3',
            text: 'test3'
        }];
        const wrapper = mount(ListBox, {
            propsData: {
                possibleValues,
                value: '',
                placeholder: '',
                ariaLabel: 'ListBox'
            }
        });
        let newValueIndex = 1;
        let input = wrapper.findAll('li[role=option]').at(newValueIndex);
        input.trigger('click');
        expect(wrapper.emitted().input[0][0]).toEqual(possibleValues[newValueIndex].id);
    });

    // it('sets the values to the next value on keydown', () => {

    // it('sets the values to the next value on keyup', () => {

    // it('sets the values to the first value on home key', () => {

    // it('sets the values to the last value on end key', () => {

    // it('sets the corrent aria-* attributes', () => {

});
