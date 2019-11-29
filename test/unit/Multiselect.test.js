import { mount } from '@vue/test-utils';

import Multiselect from '~/ui/components/forms/Multiselect';

describe('Multiselect.vue', () => {
    it('renders properly', () => {
        const wrapper = mount(Multiselect, {
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
                value: [],
                title: ''
            }
        });
        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.isVisible()).toBeTruthy();
        expect(wrapper.classes()).toContain('multiselect');
    });

    it('emits updateValue events', () => {
        const wrapper = mount(Multiselect, {
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
                value: [],
                title: ''
            }
        });
        wrapper.vm.onChange('test1', true);
        expect(wrapper.emitted().updateValue).toBeTruthy();
    });

    it('toggles properly', () => {
        const wrapper = mount(Multiselect, {
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
                value: [],
                title: ''
            }
        });
        expect(wrapper.vm.collapsed).toBe(true);
        wrapper.vm.toggle();
        expect(wrapper.vm.collapsed).toBe(false);
        wrapper.vm.toggle();
        expect(wrapper.vm.collapsed).toBe(true);
    });

    it('adds values to the checked values', () => {
        const wrapper = mount(Multiselect, {
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
                value: [],
                title: ''
            }
        });
        wrapper.vm.onChange('test1', true);
        expect(wrapper.vm.checkedValue).toContain('test1');
    });

    it('removes values from the checked values', () => {
        const wrapper = mount(Multiselect, {
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
                value: [],
                title: ''
            }
        });
        wrapper.vm.onChange('test1', true);
        expect(wrapper.vm.checkedValue).toContain('test1');
        expect(wrapper.vm.checkedValue).toHaveLength(1);
        wrapper.vm.onChange('test1', false);
        expect(wrapper.vm.checkedValue).toHaveLength(0);
    });

    it('uses the title text until options have been selected', () => {
        const wrapper = mount(Multiselect, {
            propsData: {
                possibleValues: [{
                    id: 'test1',
                    text: 'test1'
                }, {
                    id: 'test2',
                    text: 'test2',
                    selectedText: 'Test2'
                }, {
                    id: 'test3',
                    text: 'test3'
                }],
                value: [],
                title: 'Test Title'
            }
        });
        expect(wrapper.vm.optionText).toBe('Test Title');
        wrapper.vm.onChange('test1', true);
        expect(wrapper.vm.optionText).toBe('test1');
        wrapper.vm.onChange('test2', true);
        expect(wrapper.vm.optionText).toBe('test1, Test2');
    });
});
