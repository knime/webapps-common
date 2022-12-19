import { mount } from '@vue/test-utils';

import ListBox from '../ListBox.vue';

describe('ListBox.vue', () => {
    let props;

    beforeEach(() => {
        props = {
            possibleValues: [{
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
            }],
            ariaLabel: 'Test Label'
        };
    });

    it('renders', () => {
        const wrapper = mount(ListBox, {
            props
        });
        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.isVisible()).toBeTruthy();

        let options = wrapper.findAll('li[role=option]');
        expect(options.length).toBe(props.possibleValues.length);
        props.possibleValues.forEach((value, i) => {
            expect(options[i].text()).toContain(value.text);
        });
    });

    it('renders selected value', () => {
        let value = 'test3';
        const wrapper = mount(ListBox, {
            props: {
                ...props,
                value
            }
        });

        let options = wrapper.findAll('li[role=option]');
        props.possibleValues.forEach((option, i) => {
            let classes = options[i].classes();
            if (option.id === value) {
                expect(classes).toContain('focused');
            } else {
                expect(classes).not.toContain('focused');
            }
        });
    });

    it('invalidates if invalid value is selected', () => {
        const value = props.possibleValues[0].id;
        const wrapper = mount(ListBox, {
            props: {
                ...props,
                value
            }
        });

        expect(wrapper.vm.validate().isValid).toBe(true);

        wrapper.setProps({ modelValue: 'non-valid-id' });

        expect(wrapper.vm.validate().isValid).toBe(false);

        wrapper.setProps({ value });

        expect(wrapper.vm.validate().isValid).toBe(true);
    });

    it('renders invalid value', () => {
        let value = 'non-valid';
        const wrapper = mount(ListBox, {
            props: {
                ...props,
                value
            }
        });

        let options = wrapper.findAll('li[role=option]');
        const selectableValues = [{ id: value }, ...props.possibleValues];

        // look for the invalid value
        wrapper.findAll('li[role=option]');
        selectableValues.forEach((option, i) => {
            if (option.id === value) {
                expect(options[i].text().includes(value)).toBeTruthy();
            }
        });

        // set to a valid id
        wrapper.setProps({ modelValue: props.possibleValues[0].id });

        // invalid value should still be there
        wrapper.findAll('li[role=option]');
        selectableValues.forEach((option, i) => {
            if (option.id === value) {
                expect(options[i].text().includes(value)).toBeTruthy();
            }
        });
    });

    it('puts invalid class only on invalid values', () => {
        let value = 'just-not-valid';
        const wrapper = mount(ListBox, {
            props: {
                ...props,
                value
            }
        });

        let options = wrapper.findAll('li[role=option]');
        const selectableValues = [{ id: value }, ...props.possibleValues];

        selectableValues.forEach((option, i) => {
            let classes = options[i].classes();
            if (option.id === value) {
                expect(classes).toContain('invalid');
            } else {
                expect(classes).not.toContain('invalid');
            }
        });
    });

    it('sets the correct aria-* attributes', () => {
        const wrapper = mount(ListBox, {
            props
        });

        let ul = wrapper.find('ul');
        expect(ul.attributes('aria-label')).toBe(props.ariaLabel);
    });

    it('renders invalid style', () => {
        const wrapper = mount(ListBox, {
            props: {
                ...props,
                isValid: false
            }
        });

        let root = wrapper.find('div');
        expect(root.classes()).toContain('invalid');
    });

    it('emits event for clicked value', () => {
        const wrapper = mount(ListBox, {
            props
        });
        let newValueIndex = 1;
        let input = wrapper.findAll('li[role=option]').at(newValueIndex);
        input.trigger('click');
        expect(wrapper.emitted('update:modelValue')[0][0]).toEqual(props.possibleValues[newValueIndex].id);
    });

    it('provides a valid hasSelection method', () => {
        const wrapper = mount(ListBox, {
            props
        });
        expect(wrapper.vm.hasSelection()).toBe(false);

        let newValueIndex = 1;
        let input = wrapper.findAll('li[role=option]').at(newValueIndex);
        input.trigger('click');
        expect(wrapper.vm.hasSelection()).toBe(true);
    });

    describe('keyboard navigation', () => {
        it('sets the values on keydown navigation', () => {
            const wrapper = mount(ListBox, {
                props: {
                    ...props,
                    modelValue: 'test2' // defines start point
                }
            });

            let ul = wrapper.find('ul');
            ul.trigger('keydown.down');
            expect(wrapper.emitted('update:modelValue')[0][0]).toEqual('test3');
        });

        it('sets the values on keyup navigation', () => {
            const wrapper = mount(ListBox, {
                props: {
                    ...props,
                    modelValue: 'test2' // defines start point
                }
            });

            let ul = wrapper.find('ul');
            ul.trigger('keydown.up');
            expect(wrapper.emitted('update:modelValue')[0][0]).toEqual('test1');
        });

        it('sets no values on keyup navigation at the start', () => {
            const wrapper = mount(ListBox, {
                props: {
                    ...props,
                    modelValue: 'test1' // defines start point
                }
            });

            let ul = wrapper.find('ul');
            ul.trigger('keydown.up');
            expect(wrapper.emitted('update:modelValue')).toBeFalsy();
        });


        it('sets no values on keydown navigation at the end', () => {
            const wrapper = mount(ListBox, {
                props: {
                    ...props,
                    modelValue: 'test5' // defines start point
                }
            });

            let ul = wrapper.find('ul');
            ul.trigger('keydown.down');
            expect(wrapper.emitted('update:modelValue')).toBeFalsy();
        });

        it('sets the values to the first value on home key', () => {
            const wrapper = mount(ListBox, {
                props: {
                    ...props,
                    modelValue: 'test3' // defines start point
                }
            });

            let ul = wrapper.find('ul');
            ul.trigger('keydown.home');
            expect(wrapper.emitted('update:modelValue')[0][0]).toBe('test1');
        });

        it('sets the values to the last value on end key', () => {
            const wrapper = mount(ListBox, {
                props: {
                    ...props,
                    modelValue: 'test3' // defines start point
                }
            });

            let ul = wrapper.find('ul');
            ul.trigger('keydown.end');
            expect(wrapper.emitted('update:modelValue')[0][0]).toBe('test5');
        });
    });
});
