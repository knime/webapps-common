import { mount } from '@vue/test-utils';

import Dropdown from '~/ui/components/forms/Dropdown';

describe('Dropdown.vue', () => {
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
        }, {
            id: 'test4',
            text: 'test4'
        }, {
            id: 'test5',
            text: 'test5'
        }],
        ariaLabel: 'Test Label'
    };

    it('renders', () => {
        const wrapper = mount(Dropdown, {
            propsData
        });
        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.isVisible()).toBeTruthy();
        expect(wrapper.findAll('[role=option]').length).toBe(propsData.possibleValues.length);
    });

    it('sets the correct aria-* attributes', () => {
        const wrapper = mount(Dropdown, {
            propsData
        });

        let button = wrapper.find('[role=button]');
        expect(button.attributes('aria-label')).toBe(propsData.ariaLabel);
    });

    it('shows placeholder if no value set', () => {
        let placeholder = 'my-placeholder';
        const wrapper = mount(Dropdown, {
            propsData: {
                ...propsData,
                placeholder
            }
        });

        let button = wrapper.find('[role=button]');
        expect(button.text()).toBe(placeholder);
    });

    it('shows invalid value if value is invalid', () => {
        const wrapper = mount(Dropdown, {
            propsData: {
                ...propsData,
                value: 'no'
            }
        });

        let button = wrapper.find('[role=button]');
        expect(button.text()).toBe('no (invalid)');
    });

    it('shows invalid state indicator if isValid is false', () => {
        const wrapper = mount(Dropdown, {
            propsData: {
                ...propsData,
                isValid: false
            }
        });

        let root = wrapper.find('div');
        expect(root.classes()).toContain('invalid');
    });

    it('opens the listbox on click of button and sets the values to the clicked value', () => {
        const wrapper = mount(Dropdown, {
            propsData
        });
        let newValueIndex = 1;
        let listbox = wrapper.find('[role=listbox]');

        // open list
        wrapper.find('[role=button]').trigger('click');
        expect(listbox.isVisible()).toBe(true);

        let input = wrapper.findAll('li[role=option]').at(newValueIndex);
        input.trigger('click');

        expect(wrapper.emitted().input[0][0]).toEqual(propsData.possibleValues[newValueIndex].id);

        // listbox closed
        expect(listbox.isVisible()).toBe(false);
    });

    describe('keyboard navigation', () => {
        it('opens and closes the listbox on enter/esc', () => {
            const wrapper = mount(Dropdown, {
                propsData
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
            const wrapper = mount(Dropdown, {
                propsData: {
                    ...propsData,
                    value: 'test2' // defines start point
                }
            });

            let ul = wrapper.find('ul');
            ul.trigger('keydown.down');
            expect(wrapper.emitted().input[0][0]).toEqual('test3');
        });

        it('sets the values on keyup navigation', () => {
            const wrapper = mount(Dropdown, {
                propsData: {
                    ...propsData,
                    value: 'test2' // defines start point
                }
            });

            let ul = wrapper.find('ul');
            ul.trigger('keydown.up');
            expect(wrapper.emitted().input[0][0]).toEqual('test1');
        });

        it('sets no values on keyup navigation at the start', () => {
            const wrapper = mount(Dropdown, {
                propsData: {
                    ...propsData,
                    value: 'test1' // defines start point
                }
            });

            let ul = wrapper.find('ul');
            ul.trigger('keydown.up');
            expect(wrapper.emitted().input).toBeFalsy();
        });

        it('sets no values on keydown navigation at the end', () => {
            const wrapper = mount(Dropdown, {
                propsData: {
                    ...propsData,
                    value: 'test5' // defines start point
                }
            });

            let ul = wrapper.find('ul');
            ul.trigger('keydown.down');
            expect(wrapper.emitted().input).toBeFalsy();
        });

        it('sets the values to the first value on home key', () => {
            const wrapper = mount(Dropdown, {
                propsData: {
                    ...propsData,
                    value: 'test3' // defines start point
                }
            });

            let ul = wrapper.find('ul');
            ul.trigger('keydown.home');
            expect(wrapper.emitted().input[0][0]).toBe('test1');
        });

        it('sets the values to the last value on end key', () => {
            const wrapper = mount(Dropdown, {
                propsData: {
                    ...propsData,
                    value: 'test3' // defines start point
                }
            });

            let ul = wrapper.find('ul');
            ul.trigger('keydown.end');
            expect(wrapper.emitted().input[0][0]).toBe('test5');
        });
    });

});
