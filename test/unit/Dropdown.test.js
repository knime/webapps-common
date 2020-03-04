import { mount } from '@vue/test-utils';

import Dropdown from '~/ui/components/forms/Dropdown';

describe('Dropdown.vue', () => {
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
            ariaLabel: 'Dropdown'
        };
        const wrapper = mount(Dropdown, {
            propsData
        });
        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.isVisible()).toBeTruthy();
        expect(wrapper.findAll('[role=option]').length).toBe(propsData.possibleValues.length);
    });

    it('opens the listbox on click of button and sets the values to the clicked value', () => {
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
        const wrapper = mount(Dropdown, {
            propsData: {
                possibleValues,
                value: '',
                placeholder: '',
                ariaLabel: 'Dropdown'
            }
        });
        let newValueIndex = 1;
        let listbox = wrapper.find('[role=listbox]');

        // open list
        wrapper.find('[role=button]').trigger('click');
        expect(listbox.isVisible()).toBe(true);

        let input = wrapper.findAll('li[role=option]').at(newValueIndex);
        input.trigger('click');

        expect(wrapper.emitted().input[0][0]).toEqual(possibleValues[newValueIndex].id);

        // listbox closed
        expect(listbox.isVisible()).toBe(false);
    });

    it('opens and closes the listbox on enter/esc', () => {
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
        const wrapper = mount(Dropdown, {
            propsData: {
                possibleValues,
                value: '',
                placeholder: '',
                ariaLabel: 'Dropdown'
            }
        });

        let listbox = wrapper.find('[role=listbox]');

        // open list
        wrapper.find('[role=button]').trigger('keydown.enter');
        expect(listbox.isVisible()).toBe(true);

        // close listbox
        listbox.trigger('keydown.esc');
        expect(listbox.isVisible()).toBe(false);
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
        const wrapper = mount(Dropdown, {
            propsData: {
                possibleValues,
                value: 'test2', // defines start point
                placeholder: '',
                ariaLabel: 'Dropdown'
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
        const wrapper = mount(Dropdown, {
            propsData: {
                possibleValues,
                value: 'test2', // defines start point
                placeholder: '',
                ariaLabel: 'Dropdown'
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
        const wrapper = mount(Dropdown, {
            propsData: {
                possibleValues,
                value: 'test1', // defines start point
                placeholder: '',
                ariaLabel: 'Dropdown'
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
        const wrapper = mount(Dropdown, {
            propsData: {
                possibleValues,
                value: 'test3', // defines start point
                placeholder: '',
                ariaLabel: 'Dropdown'
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
        const wrapper = mount(Dropdown, {
            propsData: {
                possibleValues,
                value: 'test3', // defines start point
                placeholder: '',
                ariaLabel: 'Dropdown'
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
        const wrapper = mount(Dropdown, {
            propsData: {
                possibleValues,
                value: 'test3', // defines start point
                placeholder: '',
                ariaLabel: 'Dropdown'
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
        const wrapper = mount(Dropdown, {
            propsData: {
                possibleValues,
                value: 'test3', // defines start point
                placeholder: '',
                ariaLabel
            }
        });

        let button = wrapper.find('[role=button]');
        expect(button.attributes('aria-label')).toBe(ariaLabel);
    });

    it('show placeholder if value is not in possible values', () => {
        let placeholder = 'my-placeholder';
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
        const wrapper = mount(Dropdown, {
            propsData: {
                possibleValues,
                value: 'no', // defines start point
                placeholder,
                ariaLabel: 'label'
            }
        });

        let button = wrapper.find('[role=button]');
        expect(button.text()).toBe(placeholder);
    });

    it('show invalid state indicator if isValid is false', () => {
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
        const wrapper = mount(Dropdown, {
            propsData: {
                possibleValues,
                value: 'no', // defines start point
                isValid: false,
                ariaLabel: 'label'
            }
        });

        let root = wrapper.find('div');
        expect(root.classes()).toContain('invalid');
    });

});
