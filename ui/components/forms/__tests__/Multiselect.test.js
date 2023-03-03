import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';

import Multiselect from '../Multiselect.vue';
import Checkbox from '../Checkbox.vue';

const doMount = (options) => mount(Multiselect, {
    props: {
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
    },
    ...options
});

describe('Multiselect.vue', () => {
    it('renders', () => {
        const wrapper = doMount();
        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.isVisible()).toBeTruthy();
        expect(wrapper.classes()).toContain('multiselect');
    });

    it('renders invalid style', () => {
        const wrapper = doMount({
            props: {
                isValid: false
            }
        });

        let root = wrapper.find('div');
        expect(root.classes()).toContain('invalid');
    });

    it('renders placeholder until options have been selected', async () => {
        const wrapper = doMount({
            props: {
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

        let button = wrapper.find('[role="button"]');
        expect(button.text()).toBe('Test Title');
        expect(button.classes()).toContain('placeholder');

        await wrapper.vm.onUpdateModelValue('test1', true);
        expect(button.text()).toBe('test1');
        expect(button.classes()).not.toContain('placeholder');
        
        await wrapper.vm.onUpdateModelValue('test2', true);
        expect(button.text()).toBe('test1, Test2');
        expect(button.classes()).not.toContain('placeholder');
    });

    it('emits input events', async () => {
        const wrapper = doMount();
        await wrapper.vm.onUpdateModelValue('test1', true);
        expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    });

    it('toggles properly', () => {
        const wrapper = doMount();
        expect(wrapper.vm.collapsed).toBe(true);
        wrapper.vm.toggle();
        expect(wrapper.vm.collapsed).toBe(false);
        wrapper.vm.toggle();
        expect(wrapper.vm.collapsed).toBe(true);
    });

    it('adds values to the checked values', () => {
        const wrapper = doMount();
        wrapper.vm.onUpdateModelValue('test1', true);
        expect(wrapper.vm.checkedValue).toContain('test1');
    });

    it('removes values from the checked values', () => {
        const wrapper = doMount();
        wrapper.vm.onUpdateModelValue('test1', true);
        expect(wrapper.vm.checkedValue).toContain('test1');
        expect(wrapper.vm.checkedValue).toHaveLength(1);
        wrapper.vm.onUpdateModelValue('test1', false);
        expect(wrapper.vm.checkedValue).toHaveLength(0);
    });

    describe('keyboard interaction', () => {
        it('show options on space', () => {
            const wrapper = doMount();
            let button = wrapper.find('[role=button]');
            button.trigger('keydown.space');
            expect(wrapper.vm.collapsed).toBe(false);
        });

        it('hide options on esc', () => {
            vi.useFakeTimers();
            const wrapper = doMount();
            let toggleFocusMock = vi.spyOn(wrapper.vm.$refs.toggle, 'focus');
            let button = wrapper.find('[role=button]');
            wrapper.vm.collapsed = false;
            button.trigger('keydown.esc');
            vi.runAllTimers();
            expect(wrapper.vm.collapsed).toBe(true);
            expect(toggleFocusMock).toHaveBeenCalled();
        });

        it('hide options when focus leaves the component', () => {
            vi.useFakeTimers();
            const wrapper = doMount();
            let refocusMock = vi.spyOn(wrapper.vm.$refs.toggle, 'focus');
            let onFocusOutMock = vi.spyOn(wrapper.vm, 'onFocusOut');
            let closeMenuMock = vi.spyOn(wrapper.vm, 'closeOptions');
            expect(wrapper.vm.collapsed).toBe(true);
            wrapper.setData({ collapsed: false });
            expect(wrapper.vm.collapsed).toBe(false);

            wrapper.trigger('focusout');

            vi.runAllTimers();

            expect(onFocusOutMock).toHaveBeenCalled();
            expect(closeMenuMock).toHaveBeenCalledWith(false);
            expect(refocusMock).not.toHaveBeenCalled();
            expect(wrapper.vm.collapsed).toBe(true);
        });

        describe('arrow key navigation', () => {
            it('gets next item to focus', () => {
                const wrapper = doMount({
                    attachTo: document.body
                });
                // up and down
                wrapper.vm.focusOptions[1].focus();
                expect(document.activeElement).toBe(wrapper.vm.focusOptions[1]);
                expect(wrapper.vm.getNextElement(-1)).toBe(wrapper.vm.focusOptions[0]);
                expect(wrapper.vm.getNextElement(1)).toBe(wrapper.vm.focusOptions[2]);
                // jumps to end of list
                wrapper.vm.focusOptions[0].focus();
                expect(document.activeElement).toBe(wrapper.vm.focusOptions[0]);
                expect(wrapper.vm.getNextElement(1)).toBe(wrapper.vm.focusOptions[1]);
                expect(wrapper.vm.getNextElement(-1)).toBe(wrapper.vm.focusOptions[2]);
                // jumps to start of list
                wrapper.vm.focusOptions[2].focus();
                expect(document.activeElement).toBe(wrapper.vm.focusOptions[2]);
                expect(wrapper.vm.getNextElement(-1)).toBe(wrapper.vm.focusOptions[1]);
                expect(wrapper.vm.getNextElement(1)).toBe(wrapper.vm.focusOptions[0]);
            });
    
            it('focuses next element on key down', () => {
                const wrapper = doMount({
                    attachTo: document.body
                });
                let onDownMock = vi.spyOn(wrapper.vm, 'onDown');
                expect(wrapper.vm.collapsed).toBe(true);
                wrapper.setData({ collapsed: false });
                expect(wrapper.vm.collapsed).toBe(false);
                // eslint-disable-next-line no-magic-numbers
                expect(wrapper.vm.focusOptions.length).toBe(3);
                wrapper.vm.focusOptions[0].focus();
                expect(document.activeElement).toBe(wrapper.vm.focusOptions[0]);
    
                wrapper.trigger('keydown.down');
    
                expect(document.activeElement).toBe(wrapper.vm.focusOptions[1]);
                expect(onDownMock).toHaveBeenCalled();
            });
    
            it('focuses previous element on key up', () => {
                const wrapper = doMount({
                    attachTo: document.body
                });
                let onUpMock = vi.spyOn(wrapper.vm, 'onUp');
                expect(wrapper.vm.collapsed).toBe(true);
                wrapper.setData({ collapsed: false });
                expect(wrapper.vm.collapsed).toBe(false);
                // eslint-disable-next-line no-magic-numbers
                expect(wrapper.vm.focusOptions.length).toBe(3);
                wrapper.vm.focusOptions[1].focus();
                expect(document.activeElement).toBe(wrapper.vm.focusOptions[1]);
    
                wrapper.trigger('keydown.up');
    
                expect(document.activeElement).toBe(wrapper.vm.focusOptions[0]);
                expect(onUpMock).toHaveBeenCalled();
            });

            it('focuses first element on key down at list end', () => {
                const wrapper = doMount({
                    attachTo: document.body
                });
                let onDownMock = vi.spyOn(wrapper.vm, 'onDown');
                expect(wrapper.vm.collapsed).toBe(true);
                wrapper.setData({ collapsed: false });
                expect(wrapper.vm.collapsed).toBe(false);
                // eslint-disable-next-line no-magic-numbers
                expect(wrapper.vm.focusOptions.length).toBe(3);
                wrapper.vm.focusOptions[2].focus();
                expect(document.activeElement).toBe(wrapper.vm.focusOptions[2]);
    
                wrapper.trigger('keydown.down');
    
                expect(document.activeElement).toBe(wrapper.vm.focusOptions[0]);
                expect(onDownMock).toHaveBeenCalled();
            });
    
            it('focuses last element on key up at list start', () => {
                const wrapper = doMount({
                    attachTo: document.body
                });
                let onUpMock = vi.spyOn(wrapper.vm, 'onUp');
                expect(wrapper.vm.collapsed).toBe(true);
                wrapper.setData({ collapsed: false });
                expect(wrapper.vm.collapsed).toBe(false);
                // eslint-disable-next-line no-magic-numbers
                expect(wrapper.vm.focusOptions.length).toBe(3);
                wrapper.vm.focusOptions[0].focus();
                expect(document.activeElement).toBe(wrapper.vm.focusOptions[0]);
    
                wrapper.trigger('keydown.up');
    
                expect(document.activeElement).toBe(wrapper.vm.focusOptions[2]);
                expect(onUpMock).toHaveBeenCalled();
            });

            it('disables options if `disabled` is set', () => {
                const wrapper = doMount({
                    props: {
                        possibleValues: [{
                            id: 'test1',
                            text: 'test1',
                            disabled: true
                        }, {
                            id: 'test2',
                            text: 'test2'
                        }, {
                            id: 'test3',
                            text: 'test3',
                            disabled: true
                        }]
                    },
                    attachTo: document.body
                });

                const checkboxes = wrapper.findAllComponents(Checkbox);
        
                expect(checkboxes[0].props('disabled')).toBe(true);
                expect(checkboxes[1].props('disabled')).toBe(false);
                expect(checkboxes[2].props('disabled')).toBe(true);
            });

            it('renders custom seperator', () => {
                const wrapper = doMount({
                    props: {
                        possibleValues: [{
                            id: 'test1',
                            text: 'Test1'
                        }, {
                            id: 'test2',
                            text: 'Test2'
                        }],
                        modelValue: ['test1', 'test2'],
                        separator: ' & '
                    }
                });

                const button = wrapper.find('[role="button"]');
                expect(button.text()).toBe('Test1 & Test2');
            });

            it('renders count and placeholder if summaryMaxItemCount is set', () => {
                const wrapper = doMount({
                    props: {
                        possibleValues: [{
                            id: 'test1',
                            text: 'Test1'
                        }, {
                            id: 'test2',
                            text: 'Test2'
                        }, {
                            id: 'test3',
                            text: 'Test3'
                        }, {
                            id: 'test4',
                            text: 'Test4'
                        }],
                        modelValue: ['test1', 'test2', 'test4'],
                        summaryMaxItemCount: 2,
                        summaryName: 'Fische'
                    }
                });

                const button = wrapper.find('[role="button"]');
                expect(button.text()).toBe('3 Fische');
            });
        });
    });
});