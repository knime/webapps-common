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

    it('sets the values on keydown navigation', () => {
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
                value: 'test2', // defines start point
                placeholder: '',
                ariaLabel: 'ListBox'
            }
        });

        let ul = wrapper.find('ul');
        ul.trigger('keydown.down',);
        expect(wrapper.emitted().input[0][0]).toEqual('test3');
    });

    it('sets the values on keyup navigation', () => {
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
                value: 'test2', // defines start point
                placeholder: '',
                ariaLabel: 'ListBox'
            }
        });

        let ul = wrapper.find('ul');
        ul.trigger('keydown.up');
        expect(wrapper.emitted().input[0][0]).toEqual('test1');
    });

    it('sets no values on keyup navigation at the start', () => {
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
                value: 'test1', // defines start point
                placeholder: '',
                ariaLabel: 'ListBox'
            }
        });

        let ul = wrapper.find('ul');
        ul.trigger('keydown.up');
        expect(wrapper.emitted().input).toBeFalsy();
    });


    it('sets no values on keydown navigation at the end', () => {
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
                value: 'test3', // defines start point
                placeholder: '',
                ariaLabel: 'ListBox'
            }
        });

        let ul = wrapper.find('ul');
        ul.trigger('keydown.down');
        expect(wrapper.emitted().input).toBeFalsy();
    });

    it('sets the values to the first value on home key', () => {
        let possibleValues = [{
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
        const wrapper = mount(ListBox, {
            propsData: {
                possibleValues,
                value: 'test3', // defines start point
                placeholder: '',
                ariaLabel: 'ListBox'
            }
        });

        let ul = wrapper.find('ul');
        ul.trigger('keydown.home');
        expect(wrapper.emitted().input[0][0]).toBe('test1');
    });

    it('sets the values to the last value on end key', () => {
        let possibleValues = [{
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
        const wrapper = mount(ListBox, {
            propsData: {
                possibleValues,
                value: 'test3', // defines start point
                placeholder: '',
                ariaLabel: 'ListBox'
            }
        });

        let ul = wrapper.find('ul');
        ul.trigger('keydown.end');
        expect(wrapper.emitted().input[0][0]).toBe('test5');
    });

    it('sets the correct aria-* attributes', () => {
        let ariaLabel = 'Test Label';
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
                value: 'test3', // defines start point
                placeholder: '',
                ariaLabel
            }
        });

        let ul = wrapper.find('ul');
        expect(ul.attributes('aria-label')).toBe(ariaLabel);
    });

});
