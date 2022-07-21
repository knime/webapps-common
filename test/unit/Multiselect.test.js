import { mount, createLocalVue } from '@vue/test-utils';

const localVue = createLocalVue();

import Multiselect from '~/ui/components/forms/Multiselect.vue';

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
            },
            localVue
        });
        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.isVisible()).toBeTruthy();
        expect(wrapper.classes()).toContain('multiselect');
    });

    it('renders invalid style', () => {
        const wrapper = mount(Multiselect, {
            propsData: {
                isValid: false
            },
            localVue
        });

        let root = wrapper.find('div');
        expect(root.classes()).toContain('invalid');
    });


    it('renders placeholder until options have been selected', () => {
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
            },
            localVue
        });

        let button = wrapper.find('[role="button"]');
        expect(button.text()).toBe('Test Title');
        expect(button.classes()).toContain('placeholder');

        wrapper.vm.onInput('test1', true);
        expect(button.text()).toBe('test1');
        expect(button.classes()).not.toContain('placeholder');
        
        wrapper.vm.onInput('test2', true);
        expect(button.text()).toBe('test1, Test2');
        expect(button.classes()).not.toContain('placeholder');
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
            },
            localVue
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
            },
            localVue
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
            },
            localVue
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
            },
            localVue
        });
        wrapper.vm.onInput('test1', true);
        expect(wrapper.vm.checkedValue).toContain('test1');
        expect(wrapper.vm.checkedValue).toHaveLength(1);
        wrapper.vm.onInput('test1', false);
        expect(wrapper.vm.checkedValue).toHaveLength(0);
    });

    describe('keyboard interaction', () => {
        it('show options on space', () => {
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
                },
                localVue
            });
            let button = wrapper.find('[role=button]');
            button.trigger('keydown.space');
            expect(wrapper.vm.collapsed).toBe(false);
        });

        it('hide options on esc', () => {
            jest.useFakeTimers();
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
                },
                localVue
            });
            let toggleFocusMock = jest.spyOn(wrapper.vm.$refs.toggle, 'focus');
            let button = wrapper.find('[role=button]');
            wrapper.vm.collapsed = false;
            button.trigger('keydown.esc');
            jest.runAllTimers();
            expect(wrapper.vm.collapsed).toBe(true);
            expect(toggleFocusMock).toHaveBeenCalled();
        });

        it('hide options when focus leaves the component', () => {
            jest.useFakeTimers();

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
                },
                localVue
            });
            let refocusMock = jest.spyOn(wrapper.vm.$refs.toggle, 'focus');
            let onFocusOutMock = jest.spyOn(wrapper.vm, 'onFocusOut');
            let closeMenuMock = jest.spyOn(wrapper.vm, 'closeOptions');
            expect(wrapper.vm.collapsed).toBe(true);
            wrapper.setData({ collapsed: false });
            expect(wrapper.vm.collapsed).toBe(false);

            wrapper.trigger('focusout');

            jest.runAllTimers();

            expect(onFocusOutMock).toHaveBeenCalled();
            expect(closeMenuMock).toHaveBeenCalledWith(false);
            expect(refocusMock).not.toHaveBeenCalled();
            expect(wrapper.vm.collapsed).toBe(true);
        });

        describe('arrow key navigation', () => {
            it('gets next item to focus', () => {
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
                    },
                    localVue
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
                    },
                    localVue
                });
                let onDownMock = jest.spyOn(wrapper.vm, 'onDown');
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
                    },
                    localVue
                });
                let onUpMock = jest.spyOn(wrapper.vm, 'onUp');
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
                    },
                    localVue
                });
                let onDownMock = jest.spyOn(wrapper.vm, 'onDown');
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
                    },
                    localVue
                });
                let onUpMock = jest.spyOn(wrapper.vm, 'onUp');
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
        });
    });
});
