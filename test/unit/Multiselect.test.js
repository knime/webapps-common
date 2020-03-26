import { mount } from '@vue/test-utils';

import Multiselect from '~/ui/components/forms/Multiselect';

describe('Multiselect.vue', () => {
    it('renders', () => {
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
                }]
            }
        });
        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.isVisible()).toBeTruthy();
        expect(wrapper.classes()).toContain('multiselect');
    });

    it('shows invalid state indicator if isValid is false', () => {
        const wrapper = mount(Multiselect, {
            propsData: {
                isValid: false
            }
        });

        let root = wrapper.find('div');
        expect(root.classes()).toContain('invalid');
    });

    it('emits input events', () => {
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
                }]
            }
        });
        wrapper.vm.onInput('test1', true);
        expect(wrapper.emitted().input).toBeTruthy();
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
                }]
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
                }]
            }
        });
        wrapper.vm.onInput('test1', true);
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
                }]
            }
        });
        wrapper.vm.onInput('test1', true);
        expect(wrapper.vm.checkedValue).toContain('test1');
        expect(wrapper.vm.checkedValue).toHaveLength(1);
        wrapper.vm.onInput('test1', false);
        expect(wrapper.vm.checkedValue).toHaveLength(0);
    });

    describe('keyboard interaction', () => {
        it('show options on enter', () => {
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
                    }]
                }
            });
            let button = wrapper.find('[role=button]');
            button.trigger('keydown.enter');
            expect(wrapper.vm.collapsed).toBe(false);
        });
        it('hide options on esc', () => {
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
                    }]
                }
            });
            let button = wrapper.find('[role=button]');
            wrapper.vm.collapsed = false;
            button.trigger('keydown.esc');
            expect(wrapper.vm.collapsed).toBe(true);
        });
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
                placeholder: 'Test Title'
            }
        });
        expect(wrapper.vm.optionText).toBe('Test Title');
        wrapper.vm.onInput('test1', true);
        expect(wrapper.vm.optionText).toBe('test1');
        wrapper.vm.onInput('test2', true);
        expect(wrapper.vm.optionText).toBe('test1, Test2');
    });
});
